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

  // Capture JavaScript errors.
  page.on('pageerror', error => {
    // If the stack trace includes 'all.js' then we want to fail these tests.
    if (error.stack.includes('all.js')) {
      throw error
    }
  })
  done()
})

afterAll(async (done) => {
  await page.close()
  done()
})

describe('GOV.UK Frontend', () => {
  describe('javascript', async () => {
    it('can be accessed via `GOVUKFrontend`', async () => {
      await page.goto(baseUrl + '/', { waitUntil: 'load' })

      const GOVUKFrontendGlobal = await page.evaluate(() => window.GOVUKFrontend)

      expect(typeof GOVUKFrontendGlobal).toBe('object')
    })
    it('exports `initAll` function', async () => {
      await page.goto(baseUrl + '/', { waitUntil: 'load' })

      const typeofInitAll = await page.evaluate(() => typeof window.GOVUKFrontend.initAll)

      expect(typeofInitAll).toEqual('function')
    })
    it('exports Components', async () => {
      await page.goto(baseUrl + '/', { waitUntil: 'load' })

      const GOVUKFrontendGlobal = await page.evaluate(() => window.GOVUKFrontend)

      var components = Object.keys(GOVUKFrontendGlobal).filter(method => method !== 'initAll')

      // Ensure GOV.UK Frontend exports the expected components
      expect(components).toEqual([
        'Button',
        'Details',
        'CharacterCount',
        'Checkboxes',
        'ErrorSummary',
        'Header',
        'Radios',
        'Tabs'
      ])
    })
    it('exported Components can be initialised', async () => {
      await page.goto(baseUrl + '/', { waitUntil: 'load' })

      const GOVUKFrontendGlobal = await page.evaluate(() => window.GOVUKFrontend)

      var components = Object.keys(GOVUKFrontendGlobal).filter(method => method !== 'initAll')

      // Check that all the components on the GOV.UK Frontend global can be initialised
      components.forEach(component => {
        page.evaluate(component => {
          const Component = window.GOVUKFrontend[component]
          const $module = document
          new Component($module).init()
        }, component)
      })
    })
  })
  describe('global styles', async () => {
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

  // Sass functions will be automatically evaluated at compile time and the
  // return value from the function will be used in the compiled CSS.
  //
  // However, CSS has native 'function'-esque syntax as well
  // (e.g. `background-image: url(...)`) and so if you call a non-existent
  // function then Sass will just include it as part of your CSS. This means if
  // you rename a function, or accidentally include a typo in the function name,
  // these function calls can end up in the compiled CSS.
  //
  // Example:
  //
  //   @function govuk-double($number) {
  //     @return $number * 2;
  //   }
  //
  //   .my-class {
  //     height: govuk-double(10px);
  //     width: govuk-duoble(10px);
  //   }
  //
  // Rather than throwing an error, the compiled CSS would look like:
  //
  //   .my-class {
  //     height: 20px;
  //     width: govuk-duoble(10px); // intentional typo
  //   }
  //
  // This test attempts to match anything that looks like a function call within
  // the compiled CSS - if it finds anything, it will result in the test
  // failing.
  it('does not contain any unexpected govuk- function calls', async () => {
    const sass = `@import "all"`

    const results = await sassRender({ data: sass, ...sassConfig })
    const css = results.css.toString()

    const functionCalls = css.match(/_?govuk-[\w-]+\(.*?\)/g)

    expect(functionCalls).toBeNull()
  })
})
