const {
  goToComponent,
  renderAndInitialise
} = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')
const { KnownDevices } = require('puppeteer')

const iPhone = KnownDevices['iPhone 6']

describe('Header navigation', () => {
  beforeAll(async () => {
    await page.emulate(iPhone)
  })

  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)

      await goToComponent(page, 'header', {
        exampleName: 'with-navigation'
      })
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('shows the navigation', async () => {
      const navDisplay = await page.$eval(
        '.govuk-header__navigation-list',
        (el) => window.getComputedStyle(el).getPropertyValue('display')
      )

      expect(navDisplay).toBe('block')
    })

    it('does not show the mobile menu button', async () => {
      const buttonDisplay = await page.$eval('.govuk-js-header-toggle', (el) =>
        window.getComputedStyle(el).getPropertyValue('display')
      )

      expect(buttonDisplay).toBe('none')
    })
  })

  describe('when JavaScript is available', () => {
    describe('when no navigation is present', () => {
      it('exits gracefully with no errors', async () => {
        // Errors logged to the console will cause this test to fail
        await goToComponent(page, 'header')
      })
    })

    describe('on page load', () => {
      beforeAll(async () => {
        await goToComponent(page, 'header', {
          exampleName: 'with-navigation'
        })
      })

      it('reveals the menu button', async () => {
        const hidden = await page.$eval('.govuk-js-header-toggle', (el) =>
          el.hasAttribute('hidden')
        )

        const buttonDisplay = await page.$eval(
          '.govuk-js-header-toggle',
          (el) => window.getComputedStyle(el).getPropertyValue('display')
        )

        expect(hidden).toBe(false)
        expect(buttonDisplay).toBe('block')
      })

      it('hides the menu via the hidden attribute', async () => {
        const hidden = await page.$eval(
          '.govuk-header__navigation-list',
          (el) => el.hasAttribute('hidden')
        )

        const navDisplay = await page.$eval(
          '.govuk-header__navigation-list',
          (el) => window.getComputedStyle(el).getPropertyValue('display')
        )

        expect(hidden).toBe(true)
        expect(navDisplay).toBe('none')
      })

      it('exposes the collapsed state of the menu button using aria-expanded', async () => {
        const ariaExpanded = await page.$eval(
          '.govuk-header__menu-button',
          (el) => el.getAttribute('aria-expanded')
        )

        expect(ariaExpanded).toBe('false')
      })
    })

    describe('when menu button is pressed', () => {
      beforeAll(async () => {
        await goToComponent(page, 'header', {
          exampleName: 'with-navigation'
        })

        await page.waitForSelector('.govuk-js-header-toggle')
        await page.click('.govuk-js-header-toggle')
      })

      it('shows the menu', async () => {
        const hidden = await page.$eval(
          '.govuk-header__navigation-list',
          (el) => el.hasAttribute('hidden')
        )

        const navDisplay = await page.$eval(
          '.govuk-header__navigation-list',
          (el) => window.getComputedStyle(el).getPropertyValue('display')
        )

        expect(hidden).toBe(false)
        expect(navDisplay).toBe('block')
      })

      it('exposes the expanded state of the menu button using aria-expanded', async () => {
        const ariaExpanded = await page.$eval(
          '.govuk-header__menu-button',
          (el) => el.getAttribute('aria-expanded')
        )

        expect(ariaExpanded).toBe('true')
      })
    })

    describe('when menu button is pressed twice', () => {
      beforeAll(async () => {
        await goToComponent(page, 'header', {
          exampleName: 'with-navigation'
        })

        await page.waitForSelector('.govuk-js-header-toggle')
        await page.click('.govuk-js-header-toggle')
        await page.click('.govuk-js-header-toggle')
      })

      it('adds the hidden attribute back to the menu, hiding it', async () => {
        const hidden = await page.$eval(
          '.govuk-header__navigation-list',
          (el) => el.hasAttribute('hidden')
        )

        const navDisplay = await page.$eval(
          '.govuk-header__navigation-list',
          (el) => window.getComputedStyle(el).getPropertyValue('display')
        )

        expect(hidden).toBe(true)
        expect(navDisplay).toBe('none')
      })

      it('exposes the collapsed state of the menu button using aria-expanded', async () => {
        const ariaExpanded = await page.$eval(
          '.govuk-header__menu-button',
          (el) => el.getAttribute('aria-expanded')
        )

        expect(ariaExpanded).toBe('false')
      })
    })

    describe('errors at instantiation', () => {
      let examples

      beforeAll(async () => {
        examples = await getExamples('header')
      })

      it('throws when GOV.UK Frontend is not supported', async () => {
        await expect(
          renderAndInitialise(page, 'header', {
            params: examples.default,
            beforeInitialisation() {
              document.body.classList.remove('govuk-frontend-supported')
            }
          })
        ).rejects.toEqual({
          name: 'SupportError',
          message: 'GOV.UK Frontend is not supported in this browser'
        })
      })
    })
  })
})
