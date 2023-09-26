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

      it('throws when $module is not set', async () => {
        await expect(
          renderAndInitialise(page, 'header', {
            params: examples.default,
            beforeInitialisation($module) {
              // Remove the root of the components as a way
              // for the constructor to receive the wrong type for `$module`
              $module.remove()
            }
          })
        ).rejects.toEqual({
          name: 'ElementError',
          message: 'Header: $module not found'
        })
      })

      it('throws when receiving the wrong type for $module', async () => {
        await expect(
          renderAndInitialise(page, 'header', {
            params: examples.default,
            beforeInitialisation($module) {
              // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
              $module.outerHTML = `<svg data-module="govuk-header"></svg>`
            }
          })
        ).rejects.toEqual({
          name: 'ElementError',
          message: 'Header: $module is not an instance of HTMLElement'
        })
      })

      it('does not throw if the toggle is absent', async () => {
        // The default example is rendered without navigation
        // and should keep rendering. No expectations as the JavaScript
        // will just return early. All we ask of that test is for it not
        // to throw during the initialisation
        await renderAndInitialise(page, 'header', {
          params: examples.default
        })
      })

      it('throws when the toggle is of the wrong type', async () => {
        await expect(
          renderAndInitialise(page, 'header', {
            params: examples['with navigation'],
            beforeInitialisation($module) {
              // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
              $module.querySelector(
                '.govuk-js-header-toggle'
              ).outerHTML = `<svg class="govuk-js-header-toggle" ></svg>`
            }
          })
        ).rejects.toEqual({
          name: 'ElementError',
          message:
            'Header: .govuk-js-header-toggle is not an instance of HTMLElement'
        })
      })

      it("throws when the toggle's aria-control attribute is missing", async () => {
        await expect(
          renderAndInitialise(page, 'header', {
            params: examples['with navigation'],
            beforeInitialisation($module) {
              $module
                .querySelector('.govuk-js-header-toggle')
                .removeAttribute('aria-controls')
            }
          })
        ).rejects.toEqual({
          name: 'ElementError',
          message: 'Header: .govuk-js-header-toggle[aria-controls] not found'
        })
      })

      it('throws when the menu is missing, but a toggle is present', async () => {
        await expect(
          renderAndInitialise(page, 'header', {
            params: examples['with navigation'],
            beforeInitialisation($module) {
              // Remove the menu `<ul>` referenced by $menuButton's `aria-controls`
              $module.querySelector('#navigation').remove()
            }
          })
        ).rejects.toEqual({
          name: 'ElementError',
          message: 'Header: #navigation not found'
        })
      })
    })
  })
})
