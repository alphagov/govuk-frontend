const { ports } = require('govuk-frontend-config')

const { componentNameToClassName } = require('./helper-functions')
const { render } = require('./nunjucks-helpers')

/**
 * Render and initialise a component within test boilerplate HTML
 *
 * Renders a component's Nunjucks macro with the given params, injects it into
 * the test boilerplate page, then either:
 *
 * - instantiates the component class, passing the provided JavaScript
 *   configuration, and calls the init function
 * - runs the passed initialiser function inside the browser
 *   (which lets you instantiate it a different way, like using `initAll`,
 *   or run arbitrary code)
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} componentName - The kebab-cased name of the component
 * @param {object} options - Render and initialise options
 * @param {object} options.params - Nunjucks macro params
 * @param {object} [options.config] - Component instantiation config
 * @param {initialiseCallback} [options.initialiser] - A function that'll run in the
 *   browser to execute arbitrary initialisation. Receives an object with the
 *   passed configuration as `config` and the GOVUKFrontend global as `namespace`
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function renderAndInitialise (page, componentName, options) {
  await goTo(page, '/tests/boilerplate')

  const html = render(componentName, options.params)

  // Inject rendered HTML into the page
  await page.$eval('#slot', (slot, htmlForSlot) => {
    slot.innerHTML = htmlForSlot
  }, html)

  // Run a script to init the JavaScript component
  await page.evaluate((componentClassName, options) => {
    const $component = document.querySelector('[data-module]')

    // Check for window global
    if (!('GOVUKFrontend' in window) || !window.GOVUKFrontend[componentClassName]) {
      throw new Error(`Global 'window.GOVUKFrontend.${componentClassName}' not found`)
    }

    if (options.initialiser) {
      return options.initialiser({
        config: options.config,
        namespace: window.GOVUKFrontend
      })
    }

    new window.GOVUKFrontend[componentClassName]($component, options.config).init()
  }, componentNameToClassName(componentName), options)

  return page
}

/**
 * Navigate to path
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {URL['pathname']} path - URL path
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function goTo (page, path) {
  const { href } = new URL(path, `http://localhost:${ports.app}`)

  await page.goto(href)
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
function goToExample (page, exampleName) {
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
function goToComponent (page, componentName, options) {
  const componentPath = options?.exampleName
    ? `/components/${componentName}/${options.exampleName}/preview`
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
async function getProperty ($element, propertyName) {
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
function getAttribute ($element, attributeName) {
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
async function getAccessibleName (page, $element) {
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
async function isVisible ($element) {
  return !!await $element.boundingBox()
}

module.exports = {
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
 * @callback initialiseCallback
 * @param {{ config: object, namespace: object }} context - Initialiser context
 */
