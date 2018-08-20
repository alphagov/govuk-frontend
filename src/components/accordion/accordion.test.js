/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

// const devices = require('puppeteer/DeviceDescriptors')
// const iPhone = devices['iPhone 6']
// const iPad = devices['iPad landscape']
const configPaths = require('../../../config/paths.json')
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

describe('/components/accordion', () => {
  describe('/components/accordion/preview', () => {
    describe('when JavaScript is unavailable or fails', () => {
      it('falls back to making all accordion sections visible', async () => {
        await page.setJavaScriptEnabled(false)
        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        const numberOfExampleSections = 2

        for (var i = 0; i < numberOfExampleSections; i++) {
          var isContentVisible = await page.waitForSelector('.govuk-accordion .govuk-accordion__section:nth-of-type(' + (i + 1) + ') .govuk-accordion__section-body',
            { visible: true, timeout: 1000 }
          )
          expect(isContentVisible).toBeTruthy()
        }
      })
    })

    describe('when JavaScript is available', () => {
      it('it should indicate that the sections are not expanded', async () => {
        await page.setJavaScriptEnabled(true)
        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        const numberOfExampleSections = 2

        for (var i = 0; i < numberOfExampleSections; i++) {
          var sectionExpanded = await page.evaluate(() => document.body.querySelector('.govuk-accordion .govuk-accordion__section:nth-of-type(2)').getAttribute('aria-expanded'))

          expect(sectionExpanded).toEqual('false')
        }
      })

      it('should change the Open all button to Close all when both sections are opened', async () => {
        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header')

        await page.click('.govuk-accordion .govuk-accordion__section:nth-of-type(3) .govuk-accordion__section-header')

        var openOrCloseAllButtonText = await page.evaluate(() => document.body.querySelector('.govuk-accordion__expand-all').textContent)

        expect(openOrCloseAllButtonText).toEqual('Close all')
      })

      it('should should open both sections when the Opan all button is clicked', async () => {
        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        await page.click('.govuk-accordion__expand-all')

        const firstSectionExpanded = await page.evaluate(() => document.body.querySelector('.govuk-accordion .govuk-accordion__section:nth-of-type(2)').getAttribute('aria-expanded'))

        expect(firstSectionExpanded).toEqual('true')

        const secondSectionExpanded = await page.evaluate(() => document.body.querySelector('.govuk-accordion .govuk-accordion__section:nth-of-type(2)').getAttribute('aria-expanded'))

        expect(secondSectionExpanded).toEqual('true')
      })
    })
  })
})
