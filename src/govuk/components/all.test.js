/**
 * @jest-environment puppeteer
 */

const { fetch } = require('undici')
const { WebSocket } = require('ws')

const { allComponents, getFiles } = require('../../../lib/file-helper')
const { goToComponent } = require('../../../lib/puppeteer-helpers')

const configPaths = require('../../../config/paths.js')

describe('Visual regression via Percy', () => {
  let percySnapshot
  let componentsWithJavaScript

  beforeAll(async () => {
    // Polyfill fetch() detection, upload via WebSocket()
    // Fixes Percy running in a non-browser environment
    global.window = { fetch, WebSocket }
    percySnapshot = require('@percy/puppeteer')

    // Filter "JavaScript enabled" components only
    componentsWithJavaScript = allComponents

      // Get file listing per component
      .map((componentName) => [componentName, getFiles(`${configPaths.components}${componentName}`)])

      // Filter for "JavaScript enabled" via `${componentName}.mjs`
      .filter(([componentName, entries]) => entries.includes(`${componentName}.mjs`))

      // Component names only
      .map(([componentName]) => componentName)
  })

  afterAll(async () => {
    await page.setJavaScriptEnabled(true)
  })

  it('generate screenshots', async () => {
    for (const componentName of allComponents) {
      await page.setJavaScriptEnabled(true)

      // Screenshot preview page (with JavaScript)
      await goToComponent(page, componentName)
      await percySnapshot(page, `js: ${componentName}`)

      // Check for "JavaScript enabled" components
      if (componentsWithJavaScript.includes(componentName)) {
        await page.setJavaScriptEnabled(false)

        // Screenshot preview page (without JavaScript)
        await page.reload({ waitUntil: 'load' })
        await percySnapshot(page, `no-js: ${componentName}`)
      }
    }
  }, 120000)
})
