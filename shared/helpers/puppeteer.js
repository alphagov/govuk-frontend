const { AxePuppeteer } = require('@axe-core/puppeteer')
const { ports } = require('@govuk-frontend/config')
const { renderComponent } = require('govuk-frontend-lib/components')
const { componentNameToClassName } = require('govuk-frontend-lib/names')
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
    .withRules([
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
    ])

  // Ignore colour contrast for 'inactive' components
  if (page.url().includes('-disabled')) {
    overrides['color-contrast'] = { enabled: false }
  }

  // Shared rules for GOV.UK Frontend
  const rules = {
    /**
     * Ignore 'Some page content is not contained by landmarks'
     * {@link https://github.com/alphagov/govuk-frontend/issues/1604}
     */
    region: { enabled: false },
    ...overrides
  }

  // Create report
  const report = await reporter.options({ rules }).analyze()

  // Add preview URL to report violations
  report.violations.forEach((violation) => {
    violation.helpUrl = `${violation.helpUrl}\n${page.url()}`
  })

  return report
}

/**
 * Render and initialise a component within test boilerplate HTML
 *
 * Renders a component's Nunjucks macro with the given params, injects it into
 * the test boilerplate page, and instantiates the component class, passing the
 * provided JavaScript configuration.
 *
 * It runs an optional `beforeInitialisation` function before initialising the
 * components, allowing to tweak the state of the page before the component gets
 * instantiated.
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} componentName - The kebab-cased name of the component
 * @param {object} options - Render and initialise options
 * @param {MacroOptions} [options.params] - Nunjucks macro options (or params)
 * @param {Config[ConfigKey]} [options.config] - Component config (optional)
 * @param {($module: Element) => void} [options.beforeInitialisation] - A function that'll run in the browser
 *   before the component gets initialised
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function renderAndInitialise(page, componentName, options) {
  await goTo(page, '/tests/boilerplate')

  const html = renderComponent(componentName, options.params)

  // Inject rendered HTML into the page
  await page.$eval(
    '#slot',
    (slot, htmlForSlot) => {
      slot.innerHTML = htmlForSlot
    },
    html
  )

  // Call `beforeInitialisation` in a separate `$eval` call
  // as running it inside the body of the next `evaluate`
  // didn't provide a reliable execution
  if (options.beforeInitialisation) {
    await page.$eval('[data-module]', options.beforeInitialisation)
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
  // gather and `return` the values we need from inside the browser, and throw
  // them when back in Jest (to keep them triggering a Promise rejection)
  const error = await page.evaluate(
    async (exportName, options) => {
      const $module = document.querySelector('[data-module]')

      const namespace = await import('govuk-frontend')

      try {
        /* eslint-disable-next-line no-new */
        new namespace[exportName]($module, options.config)
      } catch ({ name, message }) {
        return { name, message }
      }
    },
    componentNameToClassName(componentName),
    options
  )

  if (error) {
    throw error
  }

  return page
}

/**
 * Navigate to path
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {URL['pathname']} path - URL path
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function goTo(page, path) {
  const { href, pathname } = new URL(path, `http://localhost:${ports.app}`)

  const response = await page.goto(href)
  const code = response.status()

  // Throw on HTTP errors (e.g. component URL typo)
  if (code >= 400) {
    throw new Error(`HTTP ${code} for '${pathname}'`)
  }

  await page.bringToFront()

  return page
}

/**
 * Navigate to example
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} exampleName - Example name
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
function goToExample(page, exampleName) {
  return goTo(page, `/examples/${exampleName}`)
}

/**
 * Navigate to component preview page
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} componentName - Component name
 * @param {object} [options] - Component options
 * @param {string} options.exampleName - Example name
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
function goToComponent(page, componentName, options) {
  const exampleName = slug(options?.exampleName ?? '', { lower: true })

  // Add example name to URL or use default
  const componentPath = exampleName
    ? `/components/${componentName}/${exampleName}/preview`
    : `/components/${componentName}/preview`

  return goTo(page, componentPath)
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
  renderAndInitialise,
  goTo,
  goToComponent,
  goToExample,
  getAttribute,
  getProperty,
  getAccessibleName,
  isVisible
}

/**
 * @typedef {import('govuk-frontend-lib/components').MacroOptions} MacroOptions
 * @typedef {import('govuk-frontend').Config} Config - Config for all components via `initAll()`
 * @typedef {keyof Config} ConfigKey - Component config keys, e.g. `accordion` and `characterCount`
 */
