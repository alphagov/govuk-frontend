const { componentNameToJavaScriptClassName } = require('./helper-functions.js')
const { renderHtml } = require('./jest-helpers.js')

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
 * @param {String} componentName - The kebab-cased name of the component
 * @param {Object} options
 * @param {String} options.baseUrl - The base URL of the test server
 * @param {Object} options.nunjucksParams - Params passed to the Nunjucks macro
 * @param {Object} [options.javascriptConfig] - The configuration hash passed to
 *  the component's class for initialisation
 * @param {Function} [options.initialiser] - A function that'll run in the
 *  browser to execute arbitrary initialisation. Receives an object with the
 *  passed configuration as `config` and the PascalCased component name as
 *  `componentClassName`
 * @returns {Promise<import('puppeteer').Page>}
 */
async function renderAndInitialise (componentName, options = {}) {
  await page.goto(`${options.baseUrl}/tests/boilerplate`, { waitUntil: 'load' })

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

module.exports = {
  renderAndInitialise
}
