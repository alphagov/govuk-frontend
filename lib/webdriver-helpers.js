const { componentNameToClassName } = require('./helper-functions.js')
const { renderHtml } = require('./jest-helpers.js')

const PORT = process.env.PORT || 3000

async function renderAndInitialise (browser, componentName, options = {}) {
  await goTo(browser, '/tests/boilerplate')

  const html = renderHtml(componentName, options.nunjucksParams)

  // Inject rendered HTML into the page
  await browser.execute(
    (htmlForSlot) => {
      document.querySelector('#slot').innerHTML = htmlForSlot
    },
    html
  )

  const initialiser =
    options.initialiser ||
    function ({ config, componentClassName }) {
      const $component = document.querySelector('[data-module]')
      new window.GOVUKFrontend[componentClassName]($component, config).init()
    }

  if (initialiser) {
    // Run a script to init the JavaScript component
    await browser.execute(initialiser, {
      config: options.javascriptConfig,
      componentClassName: componentNameToClassName(componentName)
    })
  }

  return browser
}

/**
 * Navigate to component preview browser
 *
 * @returns {Promise} - A promise that'll resolve once browser is on the component preview page
 */
function goToComponent (browser, componentName, { exampleName } = {}) {
  const componentPath = exampleName
    ? `/components/${componentName}/${exampleName}/preview`
    : `/components/${componentName}/preview`

  return goTo(browser, componentPath)
}

/**
 * Navigate to path
 */
async function goTo (browser, path) {
  const { href } = new URL(path, `http://localhost:${PORT}`)

  await browser.url(href)
}

module.exports = {
  renderAndInitialise,
  goTo,
  goToComponent
}
