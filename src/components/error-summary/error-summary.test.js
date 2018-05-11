/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const configPaths = require('../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT

beforeAll(async (done) => {
  browser = global.__BROWSER__
  page = await browser.newPage()
  done()
})

afterAll(async (done) => {
  await page.close()
  done()
})

describe('Error Summary', () => {
  it('is automatically focused when the page loads', async () => {
    await page.goto(baseUrl + '/components/error-summary/preview', { waitUntil: 'load' })

    const moduleName = await page.evaluate(() => document.activeElement.dataset.module)
    expect(moduleName).toBe('error-summary')
  })
})
