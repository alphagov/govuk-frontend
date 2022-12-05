const { componentNameToJavaScriptClassName } = require('./helper-functions.js')
const { renderHtml } = require('./jest-helpers.js')

async function goTo (page, path) {
  await page.goto(path)
  await page.bringToFront()

  return page
}

function goToExample (page, exampleName, options) {
  return goTo(page, `/examples/${exampleName}`, options)
}

function goToComponent (page, componentName, { exampleName } = {}) {
  const componentPath = exampleName
    ? `/components/${componentName}/${exampleName}/preview`
    : `/components/${componentName}/preview`

  return goTo(page, componentPath)
}

async function renderAndInitialise (page, componentName, options = {}) {
  await goTo(page, '/tests/boilerplate')

  const html = renderHtml(componentName, options.nunjucksParams)

  // Inject rendered HTML into the page
  await page.$eval(
    '#slot',
    (slot, htmlForSlot) => {
      slot.innerHTML = htmlForSlot
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
    await page.evaluate(initialiser, {
      config: options.javascriptConfig,
      componentClassName: componentNameToJavaScriptClassName(componentName)
    })
  }

  return page
}

module.exports = {
  goTo,
  goToComponent,
  goToExample,
  renderAndInitialise
}
