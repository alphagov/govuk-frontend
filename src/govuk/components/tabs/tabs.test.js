const { devices } = require('puppeteer')
const iPhone = devices['iPhone 6']

const { goTo, goToComponent } = require('../../../../lib/puppeteer-helpers.js')

describe('/components/tabs', () => {
  describe('/components/tabs/preview', () => {
    describe('when JavaScript is unavailable or fails', () => {
      beforeAll(async () => {
        await page.setJavaScriptEnabled(false)
        await goToComponent(page, 'tabs')
      })

      afterAll(async () => {
        await page.setJavaScriptEnabled(true)
      })

      it('falls back to making all tab containers visible', async () => {
        const isContentVisible = await page.waitForSelector('.govuk-tabs__panel', { visible: true, timeout: 1000 })
        expect(isContentVisible).toBeTruthy()
      })
    })

    describe('when JavaScript is available', () => {
      beforeAll(async () => {
        await goToComponent(page, 'tabs')
      })

      it('should indicate the open state of the first tab', async () => {
        const firstTabAriaSelected = await page.evaluate(() => document.body.querySelector('.govuk-tabs__list-item:first-child .govuk-tabs__tab').getAttribute('aria-selected'))
        expect(firstTabAriaSelected).toEqual('true')

        const firstTabClasses = await page.evaluate(() => document.body.querySelector('.govuk-tabs__list-item:first-child').className)
        expect(firstTabClasses).toContain('govuk-tabs__list-item--selected')
      })

      it('should display the first tab panel', async () => {
        const tabPanelIsHidden = await page.evaluate(() => document.body.querySelector('.govuk-tabs > .govuk-tabs__panel').classList.contains('govuk-tabs__panel--hidden'))
        expect(tabPanelIsHidden).toBeFalsy()
      })

      it('should hide all the tab panels except for the first one', async () => {
        const tabPanelIsHidden = await page.evaluate(() => document.body.querySelector('.govuk-tabs > .govuk-tabs__panel ~ .govuk-tabs__panel').classList.contains('govuk-tabs__panel--hidden'))
        expect(tabPanelIsHidden).toBeTruthy()
      })
    })

    describe('when a tab is pressed', () => {
      beforeEach(async () => {
        await goToComponent(page, 'tabs')
      })

      it('should indicate the open state of the pressed tab', async () => {
        // Click the second tab
        await page.click('.govuk-tabs__list-item:nth-child(2) .govuk-tabs__tab')

        const secondTabAriaSelected = await page.evaluate(() => document.body.querySelector('.govuk-tabs__list-item:nth-child(2) .govuk-tabs__tab').getAttribute('aria-selected'))
        expect(secondTabAriaSelected).toEqual('true')

        const secondTabClasses = await page.evaluate(() => document.body.querySelector('.govuk-tabs__list-item:nth-child(2)').className)
        expect(secondTabClasses).toContain('govuk-tabs__list-item--selected')
      })

      it('should display the tab panel associated with the selected tab', async () => {
        // Click the second tab
        await page.click('.govuk-tabs__list-item:nth-child(2) .govuk-tabs__tab')

        const secondTabPanelIsHidden = await page.evaluate(() => {
          const secondTabAriaControls = document.body.querySelector('.govuk-tabs__list-item:nth-child(2) .govuk-tabs__tab').getAttribute('aria-controls')
          return document.body.querySelector(`[id="${secondTabAriaControls}"]`).classList.contains('govuk-tabs__panel--hidden')
        })
        expect(secondTabPanelIsHidden).toBeFalsy()
      })

      describe('when the tab contains a DOM element', () => {
        beforeAll(async () => {
          await goToComponent(page, 'tabs')
        })

        it('should display the tab panel associated with the selected tab', async () => {
          await page.evaluate(() => {
            // Replace contents of second tab with a DOM element
            const secondTab = document.body.querySelector('.govuk-tabs__list-item:nth-child(2) .govuk-tabs__tab')
            secondTab.innerHTML = '<span>Tab 2</span>'
          })

          // Click the DOM element inside the second tab
          await page.click('.govuk-tabs__list-item:nth-child(2) .govuk-tabs__tab span')

          const secondTabPanelIsHidden = await page.evaluate(() => {
            const secondTabAriaControls = document.body.querySelector('.govuk-tabs__list-item:nth-child(2) .govuk-tabs__tab').getAttribute('aria-controls')
            return document.body.querySelector(`[id="${secondTabAriaControls}"]`).classList.contains('govuk-tabs__panel--hidden')
          })
          expect(secondTabPanelIsHidden).toBeFalsy()
        })
      })
    })

    describe('when first tab is focused and the right arrow key is pressed', () => {
      beforeEach(async () => {
        await goToComponent(page, 'tabs')
      })

      it('should indicate the open state of the next tab', async () => {
        // Press right arrow when focused on the first tab
        await page.focus('.govuk-tabs__list-item:first-child .govuk-tabs__tab')
        await page.keyboard.press('ArrowRight')

        const secondTabAriaSelected = await page.evaluate(() => document.body.querySelector('.govuk-tabs__list-item:nth-child(2) .govuk-tabs__tab').getAttribute('aria-selected'))
        expect(secondTabAriaSelected).toEqual('true')

        const secondTabClasses = await page.evaluate(() => document.body.querySelector('.govuk-tabs__list-item:nth-child(2)').className)
        expect(secondTabClasses).toContain('govuk-tabs__list-item--selected')
      })

      it('should display the tab panel associated with the selected tab', async () => {
        // Press right arrow
        await page.focus('.govuk-tabs__list-item:first-child .govuk-tabs__tab')
        await page.keyboard.down('ArrowRight')

        const secondTabPanelIsHidden = await page.evaluate(() => {
          const secondTabAriaControls = document.body.querySelector('.govuk-tabs__list-item:nth-child(2) .govuk-tabs__tab').getAttribute('aria-controls')
          return document.body.querySelector(`[id="${secondTabAriaControls}"]`).classList.contains('govuk-tabs__panel--hidden')
        })
        expect(secondTabPanelIsHidden).toBeFalsy()
      })
    })

    describe('when a hash associated with a tab panel is passed in the URL', () => {
      it('should indicate the open state of the associated tab', async () => {
        await goTo(page, '/components/tabs/preview/#past-week')

        const currentTabAriaSelected = await page.evaluate(() => document.body.querySelector('.govuk-tabs__tab[href="#past-week"]').getAttribute('aria-selected'))
        expect(currentTabAriaSelected).toEqual('true')

        const currentTabClasses = await page.evaluate(() => document.body.querySelector('.govuk-tabs__tab[href="#past-week"]').parentNode.className)
        expect(currentTabClasses).toContain('govuk-tabs__list-item--selected')

        const currentTabPanelIsHidden = await page.evaluate(() => document.getElementById('past-week').classList.contains('govuk-tabs__panel--hidden'))
        expect(currentTabPanelIsHidden).toBeFalsy()
      })

      it('should only update based on hashes that are tabs', async () => {
        await goToComponent(page, 'tabs', {
          exampleName: 'tabs-with-anchor-in-panel'
        })

        await page.click('[href="#anchor"]')

        const activeElementId = await page.evaluate(() => document.activeElement.id)
        expect(activeElementId).toEqual('anchor')
      })
    })

    describe('when rendered on a small device', () => {
      it('falls back to making the all tab containers visible', async () => {
        await page.emulate(iPhone)
        await goToComponent(page, 'tabs')
        const isContentVisible = await page.waitForSelector('.govuk-tabs__panel', { visible: true, timeout: 1000 })
        expect(isContentVisible).toBeTruthy()
      })
    })
  })
})
