const { componentNameToJavaScriptClassName } = require('./helper-functions.js')
const { renderHtml } = require('./jest-helpers.js')

const configPaths = require('../config/paths.js')
const PORT = configPaths.ports.test

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
 * @param {String} componentName - The kebab-cased name of the component
 * @param {Object} options
 * @param {Object} options.nunjucksParams - Params passed to the Nunjucks macro
 * @param {Object} [options.javascriptConfig] - The configuration hash passed to
 *  the component's class for initialisation
 * @param {Function} [options.initialiser] - A function that'll run in the
 *  browser to execute arbitrary initialisation. Receives an object with the
 *  passed configuration as `config` and the PascalCased component name as
 *  `componentClassName`
 * @returns {Promise<import('puppeteer').Page>} Puppeteer page object
 */
async function renderAndInitialise (page, componentName, options = {}) {
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
  return page
}

/**
 * Navigate to example
 *
 * @param {import('puppeteer').Page} page - Puppeteer page object
 * @param {string} exampleName - Example name
 * @param {import('puppeteer').WaitForOptions} [options] Navigation options (optional)
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
function goToComponent (page, componentName, { exampleName } = {}) {
  const componentPath = exampleName
    ? `/components/${componentName}/${exampleName}/preview`
    : `/components/${componentName}/preview`

  return goTo(page, componentPath)
}

module.exports = {
  renderAndInitialise,
  goTo,
  goToComponent,
  goToExample
}
