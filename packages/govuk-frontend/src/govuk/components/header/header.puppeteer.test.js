/* eslint-disable no-new */

const { render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')
const { KnownDevices } = require('puppeteer')

const iPhone = KnownDevices['iPhone 6']

describe('Header navigation', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('header')
  })

  beforeAll(async () => {
    await page.emulate(iPhone)
  })

  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
      await render(page, 'header', examples['with navigation'])
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
        return expect(
          render(page, 'header', examples.default)
        ).resolves.not.toThrow()
      })
    })

    describe('on page load', () => {
      beforeAll(async () => {
        await render(page, 'header', examples['with navigation'])
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
        await render(page, 'header', examples['with navigation'])

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
        await render(page, 'header', examples['with navigation'])

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
      it('can throw a SupportError if appropriate', async () => {
        await expect(
          render(page, 'header', examples.default, {
            beforeInitialisation() {
              document.body.classList.remove('govuk-frontend-supported')
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'SupportError',
            message:
              'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet'
          }
        })
      })

      it('throws when initialised twice', async () => {
        await expect(
          render(page, 'header', examples.default, {
            async afterInitialisation($root) {
              const { Header } = await import('govuk-frontend')
              new Header($root)
            }
          })
        ).rejects.toMatchObject({
          name: 'InitError',
          message: 'Root element (`$root`) already initialised (`govuk-header`)'
        })
      })

      it('throws when $root is not set', async () => {
        await expect(
          render(page, 'header', examples.default, {
            beforeInitialisation($root) {
              // Remove the root of the components as a way
              // for the constructor to receive the wrong type for `$root`
              $root.remove()
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message: 'Header: Root element (`$root`) not found'
          }
        })
      })

      it("throws when the toggle's aria-control attribute is missing", async () => {
        await expect(
          render(page, 'header', examples['with navigation'], {
            beforeInitialisation($root, { selector }) {
              $root.querySelector(selector).removeAttribute('aria-controls')
            },
            context: {
              selector: '.govuk-js-header-toggle'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Header: Navigation button (`<button class="govuk-js-header-toggle">`) attribute (`aria-controls`) not found'
          }
        })
      })

      it('throws when the menu is missing, but a toggle is present', async () => {
        await expect(
          render(page, 'header', examples['with navigation'], {
            beforeInitialisation($root, { selector }) {
              // Remove the menu `<ul>` referenced by $menuButton's `aria-controls`
              $root.querySelector(selector).remove()
            },
            context: {
              selector: '#navigation'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message: 'Header: Navigation (`<ul id="navigation">`) not found'
          }
        })
      })
    })
  })
})
