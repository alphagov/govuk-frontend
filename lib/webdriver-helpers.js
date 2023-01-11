const PORT = process.env.PORT || 3000

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
  goTo,
  goToComponent
}
