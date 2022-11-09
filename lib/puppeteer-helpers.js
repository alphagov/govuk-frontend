const configPaths = require('../config/paths')

const { componentNameToJavaScriptClassName } = require('./helper-functions')
const { renderHtml } = require('./jest-helpers')

const PORT = process.env.PORT || configPaths.ports.test

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
 * @param {object} options.nunjucksParams - Params passed to the Nunjucks macro
 * @param {object} [options.javascriptConfig] - The configuration hash passed to
 *  the component's class for initialisation
 * @param {Function} [options.initialiser] - A function that'll run in the
 *  browser to execute arbitrary initialisation. Receives an object with the
 *  passed configuration as `config` and the PascalCased component name as
 *  `componentClassName`
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function renderAndInitialise (page, componentName, options) {
  await goTo(page, '/tests/boilerplate')

  const html = renderHtml(componentName, options.nunjucksParams)

  // Inject rendered HTML into the page
  await page.$eval('#slot', (slot, htmlForSlot) => {
    slot.innerHTML = htmlForSlot
  }, html)

  const initialiser = options.initialiser || function ({ config, componentClassName }) {
    const $component = document.querySelector('[data-module]')
    new window.GOVUKFrontend[componentClassName]($component, config).init()
  }

  if (initialiser) {
    // Run a script to init the JavaScript component
    await page.evaluate(initialiser, {
      config: options.javascriptConfig,
      componentClassName: componentNameToJavaScriptClassName(componentName)
    })
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
async function goTo (page, path) {
  const { href } = new URL(path, `http://localhost:${PORT}`)

  await page.goto(href)
  await page.bringToFront()

  return page
}

/**
 * Navigate to example
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} exampleName - Example name
 * @param {import('puppeteer').WaitForOptions} [options] - Navigation options (optional)
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
function goToExample (page, exampleName, options) {
  return goTo(page, `/examples/${exampleName}`, options)
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
 * @returns {string} The element's accessible name
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
