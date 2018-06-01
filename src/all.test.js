/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const util = require('util')

const configPaths = require('../config/paths.json')
const PORT = configPaths.ports.test

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const sassConfig = {
  includePaths: [ configPaths.src ]
}

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

describe('GOV.UK Frontend', () => {
  describe('javascript', async() => {
    it('can be accessed via `GOVUKFrontend`', async () => {
      await page.goto(baseUrl + '/', { waitUntil: 'load' })

      const GOVUKFrontendGlobal = await page.evaluate(() => window.GOVUKFrontend)

      expect(typeof GOVUKFrontendGlobal).toBe('object')
    })
  })
  describe('global styles', async() => {
    it('are disabled by default', async () => {
      const sass = `
        @import "all";
      `
      const results = await sassRender({ data: sass, ...sassConfig })
      expect(results.css.toString()).not.toContain(', a {')
      expect(results.css.toString()).not.toContain(', p {')
    })
    it('are enabled if $global-styles variable is set to true', async () => {
      const sass = `
        $govuk-global-styles: true;
        @import "all";
      `
      const results = await sassRender({ data: sass, ...sassConfig })
      expect(results.css.toString()).toContain(', a {')
      expect(results.css.toString()).toContain(', p {')
    })
  })
})
