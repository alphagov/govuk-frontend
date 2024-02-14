const { readFileSync } = require('fs')
const { join } = require('path')

const { AxePuppeteer } = require('@axe-core/puppeteer')
const { paths, urls } = require('@govuk-frontend/config')
const { renderPreview } = require('@govuk-frontend/lib/components')
const { componentNameToClassName } = require('@govuk-frontend/lib/names')
const mime = require('mime-types')
const slug = require('slug')

/**
 * Axe Puppeteer reporter
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {import('axe-core').RuleObject} [overrides] - Axe rule overrides
 * @returns {Promise<import('axe-core').AxeResults>} Axe Puppeteer instance
 */
async function axe(page, overrides = {}) {
  const reporter = new AxePuppeteer(page)
    .setLegacyMode(true) // Share single page via iframe
    .include('body')

  const defaultOptions = {
    /** @type {import('axe-core').RunOnly} */
    runOnly: {
      type: 'tag',
      values: [
        'best-practice',
        // WCAG 2.x
        'wcag2a',
        'wcag2aa',
        'wcag2aaa',
        // WCAG 2.1
        'wcag21a',
        'wcag21aa',
        // WCAG 2.2
        'wcag22aa'
      ]
    },
    /** @type {import('axe-core').RuleObject} */
    rules: {
      /**
       * Ignore 'Some page content is not contained by landmarks'
       * {@link https://github.com/alphagov/govuk-frontend/issues/1604}
       */
      region: { enabled: false },
      // Ignore colour contrast (enhanced) from WCAG Level AAA
      'color-contrast-enhanced': { enabled: false }
    }
  }

  // Ignore colour contrast for 'inactive' components
  if (page.url().includes('-disabled')) {
    defaultOptions.rules['color-contrast'] = { enabled: false }
  }

  const mergedOptions = defaultOptions

  mergedOptions.rules = { ...defaultOptions.rules, ...overrides }

  // Create report
  const report = await reporter.options(mergedOptions).analyze()

  // Add preview URL to report violations
  report.violations.forEach((violation) => {
    const { pathname } = new URL(page.url())

    // Replace file:// URLs with Review app
    const previewUrl = new URL(pathname, urls.app)

    /**
     * Add Review app preview URL below link to violation
     *
     * @example
     * ```console
     * You can find more information on this issue here:
     * https://dequeuniversity.com/rules/axe/4.8/aria-allowed-attr?application=axe-puppeteer
     * http://localhost:8080/components/radios/with-conditional-items/preview
     * ```
     */
    violation.helpUrl += `\n${previewUrl}`
  })

  return report
}

/**
 * Render component HTML with browser preview
 *
 * Uses Nunjucks component {@link renderPreview} for HTML output, but runs
 * component JavaScript (where available) or `initAll()` in the browser
 *
 * It runs an optional `beforeInitialisation` function before initialising the
 * components, allowing to tweak the state of the page before the component gets
 * instantiated.
 *
 * @template {object} HandlerContext
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} [componentName] - The kebab-cased name of the component
 * @param {MacroRenderOptions} [renderOptions] - Nunjucks macro render options
 * @param {BrowserRenderOptions<HandlerContext>} [browserOptions] - Puppeteer browser render options
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function render(page, componentName, renderOptions, browserOptions) {
  await page.setRequestInterception(true)

  const exampleName = renderOptions?.fixture?.name ?? 'default'
  const exportName = componentNameToClassName(componentName ?? '')
  const selector = componentName
    ? `[data-module="govuk-${componentName}"]`
    : `[data-module]`

  const route = getComponentURL(componentName, {
    baseURL: new URL('file://'),
    exampleName
  })

  // Mock preview HTTP response
  page.once('request', (request) =>
    request.respond({
      body: renderPreview(componentName, renderOptions),
      contentType: 'text/html'
    })
  )

  // Mock assets HTTP responses
  page.on('request', requestHandler)

  // Navigate to component preview
  await goTo(page, route)

  // Call `beforeInitialisation` in a separate `$eval` call
  // as running it inside the body of the next `evaluate`
  // didn't provide a reliable execution
  if (browserOptions?.beforeInitialisation) {
    await page.$eval(
      selector,
      browserOptions.beforeInitialisation,
      browserOptions.context
    )
  }

  // Run a script to init the JavaScript component
  //
  // Use `evaluate` to ensure we run `document.querySelector` inside the
  // browser, like users would, rather than rely on Puppeteer looking for the
  // element which would cause an error in Jest-land rather than within the
  // browser if the element is missingß
  //
  // Puppeteer returns very little information on errors thrown during
  // `evaluate`, only a `name` that maps to the error class (and not its `name`
  // property, which means we get a mangled value). As a workaround, we can
  // gather and `return` the values we need from inside the browser
  try {
    if (!page.isJavaScriptEnabled()) {
      return page
    }

    const error = await page.evaluate(
      async (selector, exportName, config) => {
        const namespace = await import('govuk-frontend')

        // Skip custom initialisation without export
        if (!exportName || !namespace[exportName]) {
          return namespace.initAll()
        }

        // Find all matching modules
        const $modules = document.querySelectorAll(selector)

        try {
          // Loop and initialise all $modules or use default
          // selector `null` return value when none found
          ;($modules.length ? $modules : [null]).forEach(
            ($module) => new namespace[exportName]($module, config)
          )
        } catch ({ name, message }) {
          return { name, message }
        }
      },
      selector,
      exportName,
      browserOptions?.config
    )

    // Throw Puppeteer errors back to Jest
    if (error) {
      const message = componentName
        ? `Initialising \`new ${exportName}()\` with example '${exampleName}' threw:`
        : 'Initialising boilerplate preview'

      throw new Error(`${message}\n\t${error.name}: ${error.message}`, {
        cause: error
      })
    }

    await page.evaluateHandle('document.fonts.ready')
  } finally {
    // Disable middleware
    page.off('request', requestHandler)

    await page.setRequestInterception(false)
  }

  return page
}

/**
 * Component preview HTTP request handler
 *
 * - Returns early for requests already handled
 * - Responds to file:// asset requests (web fonts etc)
 * - Skips unknown requests
 *
 * @param {import('puppeteer').HTTPRequest} request - Puppeteer HTTP request
 * @returns {Promise<void>}
 */
async function requestHandler(request) {
  if (request.isInterceptResolutionHandled()) {
    return
  }

  const { pathname, protocol } = new URL(request.url())

  // Return static assets
  if (protocol === 'file:' && pathname.startsWith('/assets/')) {
    return request.respond({
      body: readFileSync(join(paths.package, `dist/govuk/${pathname}`)),
      contentType: mime.lookup(pathname) || 'text/plain'
    })
  }

  // Skip unknown requests
  return request.continue()
}

/**
 * Navigate to path
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {URL | string} path - Path or URL to navigate to
 * @param {object} [options] - Navigation options
 * @param {URL} [options.baseURL] - Base URL to override
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function goTo(page, path, options) {
  const { href, pathname } = !(path instanceof URL)
    ? new URL(path, options?.baseURL ?? urls.app)
    : path

  const response = await page.goto(href)
  const code = response.status()

  // Throw on HTTP errors (e.g. component URL typo)
  if (code >= 400) {
    throw new Error(`HTTP ${code} for '${pathname}'`)
  }

  await page.evaluateHandle('document.fonts.ready')
  await page.bringToFront()

  return page
}

/**
 * Navigate to example
 *
 * @param {import('puppeteer').Browser} browser - Puppeteer browser object
 * @param {string} exampleName - Example name
 * @param {object} [options] - Navigation options
 * @param {URL} [options.baseURL] - Base URL to override
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function goToExample(browser, exampleName, options) {
  return goTo(await browser.newPage(), `/examples/${exampleName}`, options)
}

/**
 * Navigate to component preview page
 *
 * @param {import('puppeteer').Browser} browser - Puppeteer browser object
 * @param {string} [componentName] - Component name
 * @param {Parameters<typeof getComponentURL>[1]} [options] - Navigation options
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function goToComponent(browser, componentName, options) {
  return goTo(await browser.newPage(), getComponentURL(componentName, options))
}

/**
 * Get component preview Review app URL
 *
 * @param {string} [componentName] - Component name
 * @param {object} [options] - Navigation options
 * @param {string} options.exampleName - Example name
 * @param {URL} [options.baseURL] - Base URL to override
 * @returns {URL} Review app component preview URL
 */
function getComponentURL(componentName, options) {
  let componentPath = '/components'

  // Add component name to URL
  if (componentName) {
    componentPath += `/${componentName}`

    // Format example name
    const exampleName = slug(options?.exampleName ?? '', {
      lower: true
    })

    // Add example name to URL
    if (exampleName && exampleName !== 'default') {
      componentPath += `/${exampleName}`
    }
  }

  // Add prefix suffix
  componentPath += '/preview'

  return new URL(componentPath, options?.baseURL ?? urls.app)
}

/**
 * Get property value for element
 *
 * @param {import('puppeteer').ElementHandle} $element - Puppeteer element handle
 * @param {string} propertyName - Property name to return value for
 * @returns {Promise<unknown>} Property value
 */
async function getProperty($element, propertyName) {
  const handle = await $element.getProperty(propertyName)
  return handle.jsonValue()
}

/**
 * Get attribute value for element
 *
 * @param {import('puppeteer').ElementHandle} $element - Puppeteer element handle
 * @param {string} attributeName - Attribute name to return value for
 * @returns {Promise<string | null>} Attribute value
 */
function getAttribute($element, attributeName) {
  return $element.evaluate((el, name) => el.getAttribute(name), attributeName)
}

/**
 * Gets the accessible name of the given element, if it exists in the accessibility tree
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {import('puppeteer').ElementHandle} $element - Puppeteer element handle
 * @returns {Promise<string>} The element's accessible name
 * @throws {TypeError} If the element has no corresponding node in the accessibility tree
 */
async function getAccessibleName(page, $element) {
  // Purposefully doesn't use `?.` to return undefined if there's no node in the
  // accessibility tree. This lets us distinguish different kinds of failures:
  // - assertion on the name failing: we need to figure out
  //   why the name is not set right
  // - TypeError accessing `name`: we need to figure out
  //   why there's no node in the accessibility tree
  return (await page.accessibility.snapshot({ root: $element })).name
}

/**
 * Check if element is visible
 *
 * @param {import('puppeteer').ElementHandle} $element - Puppeteer element handle
 * @returns {Promise<boolean>} Element visibility
 */
async function isVisible($element) {
  return !!(await $element.boundingBox())
}

module.exports = {
  axe,
  render,
  goTo,
  goToComponent,
  goToExample,
  getAttribute,
  getComponentURL,
  getProperty,
  getAccessibleName,
  isVisible
}

/**
 * Browser render options
 *
 * @template {object} HandlerContext
 * @typedef {object} BrowserRenderOptions - Component render options
 * @property {Config[ConfigKey]} [config] - Component JavaScript config
 * @property {HandlerContext} [context] - Context options for custom functions
 * @property {HandlerFunction<HandlerContext>} [beforeInitialisation] - Custom function to run before initialisation
 */

/**
 * Browser handler function with context options
 *
 * @template {object} HandlerContext
 * @typedef {import('puppeteer').EvaluateFuncWith<Element, [HandlerContext]>} HandlerFunction
 */

/**
 * @typedef {import('@govuk-frontend/lib/components').MacroRenderOptions} MacroRenderOptions
 * @typedef {import('govuk-frontend').Config} Config - Config for all components via `initAll()`
 * @typedef {import('govuk-frontend').ConfigKey} ConfigKey - Component config keys, e.g. `accordion` and `characterCount`
 */
