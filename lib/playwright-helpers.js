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

module.exports = {
  goTo,
  goToComponent,
  goToExample
}
