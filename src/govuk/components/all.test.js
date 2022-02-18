/* eslint-env jest */

const { allComponents } = require('../../../lib/file-helper')
const { renderSass } = require('../../../lib/jest-helpers')

const configPaths = require('../../../config/paths.json')

const PORT = configPaths.ports.test
const baseUrl = 'http://localhost:' + PORT

const percySnapshot = require('@percy/puppeteer')

// We can't use the render function from jest-helpers, because we need control
// over the nunjucks environment.
const nunjucks = require('nunjucks')

describe('When nunjucks is configured with a different base path', () => {
  beforeAll(() => {
    // Create a new Nunjucks environment that uses the src directory as its
    // base path, rather than the components folder itself
    nunjucks.configure(configPaths.src)
  })

  it.each(allComponents)('render(\'%s\') does not error', (component) => {
    expect(() => {
      nunjucks.render(`components/${component}/template.njk`, {})
    }).not.toThrow()
  })
})

it('_all.scss renders to CSS without errors', () => {
  return renderSass({
    file: `${configPaths.src}/components/_all.scss`
  })
})

it.each(allComponents)('%s.scss renders to CSS without errors', (component) => {
  return renderSass({
    file: `${configPaths.src}/components/${component}/_${component}.scss`
  })
})

it.each(allComponents)('generate screenshots for Percy visual regression, with JavaScript disabled', async (component) => {
  await page.setJavaScriptEnabled(false)
  await page.goto(baseUrl + '/components/' + component + '/preview', { waitUntil: 'load' })
  await percySnapshot(page, 'no-js: ' + component)
})

it.each(allComponents)('generate screenshots for Percy visual regression, with JavaScript enabled', async (component) => {
  await page.setJavaScriptEnabled(true)
  await page.goto(baseUrl + '/components/' + component + '/preview', { waitUntil: 'load' })
  await percySnapshot(page, 'js: ' + component)
})
