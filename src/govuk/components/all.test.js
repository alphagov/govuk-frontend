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
      .map((component) => [component, getFiles(`${configPaths.components}${component}`)])

      // Filter for "JavaScript enabled" via `${component}.mjs`
      .filter(([component, entries]) => entries.includes(`${component}.mjs`))

      // Component names only
      .map(([component]) => component)
  })

  it('generate screenshots', async () => {
    for (const component of allComponents) {
      await page.setJavaScriptEnabled(true)

      // Screenshot preview page (with JavaScript)
      await goToComponent(page, component)
      await percySnapshot(page, `js: ${component}`)

      // Check for "JavaScript enabled" components
      if (componentsWithJavaScript.includes(component)) {
        await page.setJavaScriptEnabled(false)

        // Screenshot preview page (without JavaScript)
        await page.reload({ waitUntil: 'load' })
        await percySnapshot(page, `no-js: ${component}`)
      }
    }
  }, 120000)
})
