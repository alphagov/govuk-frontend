/**
 * @jest-environment puppeteer
 */

const { fetch } = require('undici')
const { WebSocket } = require('ws')

const { allComponents } = require('../../../lib/file-helper')

const configPaths = require('../../../config/paths.js')

const PORT = configPaths.ports.test
const baseUrl = 'http://localhost:' + PORT

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
