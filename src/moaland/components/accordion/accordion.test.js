/* eslint-env jest */

const configPaths = require('../../../../config/paths.json')
const PORT = configPaths.ports.test

const baseUrl = 'http://localhost:' + PORT

describe('/components/accordion', () => {
  describe('/components/accordion/preview', () => {
    describe('when JavaScript is unavailable or fails', () => {
      beforeAll(async () => {
        await page.setJavaScriptEnabled(false)
      })

      afterAll(async () => {
        await page.setJavaScriptEnabled(true)
      })

      it('falls back to making all accordion sections visible', async () => {
        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        const numberOfExampleSections = 2

        for (var i = 0; i < numberOfExampleSections; i++) {
          var isContentVisible = await page.waitForSelector('.moaland-accordion .moaland-accordion__section:nth-of-type(' + (i + 1) + ') .moaland-accordion__section-content',
            { visible: true, timeout: 1000 }
          )
          expect(isContentVisible).toBeTruthy()
        }
      })

      it('does not display "+/-" in the section headings', async () => {
        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        const numberOfIcons = await page.evaluate(() => document.body.querySelectorAll('.moaland-accordion .moaland-accordion__section .moaland-accordion__icon').length)
        expect(numberOfIcons).toEqual(0)
      })
    })

    describe('when JavaScript is available', () => {
      it('should indicate that the sections are not expanded', async () => {
        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        const numberOfExampleSections = 2

        for (var i = 0; i < numberOfExampleSections; i++) {
          const sectionHeaderButtonExpanded = await page.evaluate(function (i) {
            return document.body.querySelector('.moaland-accordion .moaland-accordion__section:nth-of-type(' + (2 + i) + ') .moaland-accordion__section-button').getAttribute('aria-expanded')
          }, i)

          expect(sectionHeaderButtonExpanded).toEqual('false')
        }
      })

      it('should change the Open all button to Close all when both sections are opened', async () => {
        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        await page.click('.moaland-accordion .moaland-accordion__section:nth-of-type(2) .moaland-accordion__section-header')

        await page.click('.moaland-accordion .moaland-accordion__section:nth-of-type(3) .moaland-accordion__section-header')

        var openOrCloseAllButtonText = await page.evaluate(() => document.body.querySelector('.moaland-accordion__open-all').textContent)

        expect(openOrCloseAllButtonText).toEqual('Close all sections')
      })

      it('should open both sections when the Open all button is clicked', async () => {
        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        await page.click('.moaland-accordion__open-all')

        const firstSectionHeaderButtonExpanded = await page.evaluate(() => document.body.querySelectorAll('.moaland-accordion__section').item(0).querySelector('.moaland-accordion__section-button').getAttribute('aria-expanded'))

        expect(firstSectionHeaderButtonExpanded).toBeTruthy()

        const secondSectionHeaderButtonExpanded = await page.evaluate(() => document.body.querySelectorAll('.moaland-accordion__section').item(1).querySelector('.moaland-accordion__section-button').getAttribute('aria-expanded'))

        expect(secondSectionHeaderButtonExpanded).toBeTruthy()
      })

      it('should already have all sections open if they have the expanded class', async () => {
        await page.goto(baseUrl + '/components/accordion/with-all-sections-already-open/preview', { waitUntil: 'load' })

        const numberOfExampleSections = 2

        for (var i = 0; i < numberOfExampleSections; i++) {
          const sectionHeaderButtonExpanded = await page.evaluate(function (i) {
            return document.body.querySelector('.moaland-accordion .moaland-accordion__section:nth-of-type(' + (2 + i) + ') .moaland-accordion__section-button').getAttribute('aria-expanded')
          }, i)

          expect(sectionHeaderButtonExpanded).toEqual('true')
        }

        const openOrCloseAllButtonText = await page.evaluate(() => document.body.querySelector('.moaland-accordion__open-all').textContent)

        expect(openOrCloseAllButtonText).toEqual('Close all sections')
      })

      it('should maintain the expanded state after a page refresh', async () => {
        const sectionHeaderButton = '.moaland-accordion .moaland-accordion__section:nth-of-type(2) .moaland-accordion__section-button'

        await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

        await page.click(sectionHeaderButton)

        const expandedState = await page.evaluate((sectionHeaderButton) => {
          return document.body.querySelector(sectionHeaderButton).getAttribute('aria-expanded')
        }, sectionHeaderButton)

        await page.reload({
          waitUntil: 'load'
        })

        const expandedStateAfterRefresh = await page.evaluate((sectionHeaderButton) => {
          return document.body.querySelector(sectionHeaderButton).getAttribute('aria-expanded')
        }, sectionHeaderButton)

        expect(expandedState).toEqual(expandedStateAfterRefresh)
      })

      describe('"+/-" icon', () => {
        it('should display "+/-" in the section headings', async () => {
          await page.goto(baseUrl + '/components/accordion/preview', { waitUntil: 'load' })

          const numberOfExampleSections = 2

          const numberOfIcons = await page.evaluate(() => document.body.querySelectorAll('.moaland-accordion .moaland-accordion__section .moaland-accordion__icon').length)
          expect(numberOfIcons).toEqual(numberOfExampleSections)
        })
      })
    })
  })
})
