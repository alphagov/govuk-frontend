/**
 * @jest-environment puppeteer
 */

const { fetch } = require('undici')
const { WebSocket } = require('ws')

const { renderSass } = require('../../../lib/jest-helpers')
const { allComponents } = require('../../../lib/file-helper')

const configPaths = require('../../../config/paths.js')

const PORT = configPaths.ports.test
const baseUrl = 'http://localhost:' + PORT

describe('Sass render', () => {
  it('renders CSS for all components', () => {
    const file = `${configPaths.src}/components/_all.scss`

    return expect(renderSass({ file })).resolves.toEqual(
      expect.objectContaining({
        css: expect.any(Object),
        stats: expect.any(Object)
      })
    )
  })

  it('renders CSS for each component', () => {
    const sassTasks = allComponents.map((component) => {
      const file = `${configPaths.src}/components/${component}/_${component}.scss`

      return expect(renderSass({ file })).resolves.toEqual(
        expect.objectContaining({
          css: expect.any(Object),
          stats: expect.any(Object)
        })
      )
    })

    return Promise.all(sassTasks)
  })
})

describe('Visual regression via Percy', () => {
  let percySnapshot

  beforeAll(() => {
    // Polyfill fetch() detection, upload via WebSocket()
    // Fixes Percy running in a non-browser environment
    global.window = { fetch, WebSocket }
    percySnapshot = require('@percy/puppeteer')
  })

  it('generate screenshots', async () => {
    for (const component of allComponents) {
      await page.setJavaScriptEnabled(true)

      // Screenshot preview page (with JavaScript)
      await page.goto(baseUrl + '/components/' + component + '/preview', { waitUntil: 'load' })
      await percySnapshot(page, `js: ${component}`)

      await page.setJavaScriptEnabled(false)

      // Screenshot preview page (without JavaScript)
      await page.reload({ waitUntil: 'load' })
      await percySnapshot(page, `no-js: ${component}`)
    }
  }, 120000)
})
