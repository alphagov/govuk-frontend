const { fetch } = require('undici')
const { WebSocket } = require('ws')

const { getDirectories } = require('../../../lib/file-helper')
const { goToComponent } = require('../../../lib/puppeteer-helpers')

const configPaths = require('../../../config/paths.js')

describe('Visual regression via Percy', () => {
  let percySnapshot

  let componentsFiles

  beforeAll(async () => {
    // Polyfill fetch() detection, upload via WebSocket()
    // Fixes Percy running in a non-browser environment
    global.window = { fetch, WebSocket }
    percySnapshot = require('@percy/puppeteer')

    // Component directory listing (with contents)
    componentsFiles = await getDirectories(configPaths.components)
  })

  afterAll(async () => {
    await page.setJavaScriptEnabled(true)
  })

  it('generate screenshots', async () => {
    for (const [componentName, { entries }] of componentsFiles) {
      await page.setJavaScriptEnabled(true)

      // Screenshot preview page (with JavaScript)
      await goToComponent(page, componentName)
      await percySnapshot(page, `js: ${componentName}`)

      // Check for "JavaScript enabled" components
      if (entries?.has(`${componentName}.mjs`)) {
        await page.setJavaScriptEnabled(false)

        // Screenshot preview page (without JavaScript)
        await page.reload({ waitUntil: 'load' })
        await percySnapshot(page, `no-js: ${componentName}`)
      }
    }
  }, 120000)
})
