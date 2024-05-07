const { render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')
const { KnownDevices } = require('puppeteer')

const iPhone = KnownDevices['iPhone 6']

const navigationSelector = `.govuk-service-header__navigation-list`
const toggleButtonSelector = '.govuk-js-service-header-toggle'

describe('/components/service-header', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('service-header')

    // The only JS functionality this component has currently is on mobile
    // viewports, so let's emulate a phone.
    await page.emulate(iPhone)
  })

  describe('/components/password-input/with-navigation', () => {
    describe('when JavaScript is unavailable or fails', () => {
      beforeAll(async () => {
        await page.setJavaScriptEnabled(false)
        await render(page, 'service-header', examples['with navigation'])
      })

      afterAll(async () => {
        await page.setJavaScriptEnabled(true)
      })

      it('renders navigation expanded by default', async () => {
        const navigationIsVisible = await page.waitForSelector(
          navigationSelector,
          { visible: true, timeout: 10000 }
        )

        expect(navigationIsVisible).toBeTruthy()
      })

      it('renders the toggle button hidden', async () => {
        const buttonHiddenAttribute = await page.$eval(
          toggleButtonSelector,
          (el) => el.hasAttribute('hidden')
        )

        expect(buttonHiddenAttribute).toBeTruthy()
      })
    })

    describe('when JavaScript is available', () => {
      describe('if no navigation is present', () => {
        it('exits gracefully with no errors', async () => {
          // Errors logged to the console will cause this test to fail
          return expect(
            render(page, 'service-header', examples.default)
          ).resolves.not.toThrow()
        })
      })

      describe('errors at instantiation', () => {
        it('can throw a SupportError if appropriate', async () => {
          await expect(
            render(page, 'service-header', examples.default, {
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

        it('throws when $module is not set', async () => {
          await expect(
            render(page, 'service-header', examples.default, {
              beforeInitialisation($module) {
                // Remove the root of the components as a way
                // for the constructor to receive the wrong type for `$module`
                $module.remove()
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message: 'Service Header: Root element (`$module`) not found'
            }
          })
        })

        it("throws when the toggle's aria-control attribute is missing", async () => {
          await expect(
            render(page, 'service-header', examples['with navigation'], {
              beforeInitialisation($module, { selector }) {
                $module.querySelector(selector).removeAttribute('aria-controls')
              },
              context: {
                selector: toggleButtonSelector
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'Service Header: Navigation button (`<button class="govuk-js-service-header-toggle">`) attribute (`aria-controls`) not found'
            }
          })
        })

        it('throws when the menu is missing, but a toggle is present', async () => {
          await expect(
            render(page, 'service-header', examples['with navigation'], {
              beforeInitialisation($module, { selector }) {
                // Remove the `<ul>` referenced by $menuButton's `aria-controls`
                $module.querySelector(selector).remove()
              },
              context: {
                selector: navigationSelector
              }
            })
          ).rejects.toMatchObject({
            cause: {
              name: 'ElementError',
              message:
                'Service Header: Navigation (`<ul id="navigation">`) not found'
            }
          })
        })
      })

      describe('on page load', () => {
        beforeAll(async () => {
          await render(page, 'service-header', examples['with navigation'])
        })

        it('renders navigation hidden by default', async () => {
          const navigationIsHidden = await page.$eval(
            navigationSelector,
            (el) => el.hasAttribute('hidden')
          )

          expect(navigationIsHidden).toBeTruthy()
        })

        it('renders the toggle button visibly', async () => {
          const buttonHiddenAttribute = await page.$eval(
            toggleButtonSelector,
            (el) => el.hasAttribute('hidden')
          )

          expect(buttonHiddenAttribute).toBeFalsy()
        })

        it('renders the toggle button with `aria-expanded` set to false', async () => {
          const toggleExpandedAttribute = await page.$eval(
            toggleButtonSelector,
            (el) => el.getAttribute('aria-expanded')
          )

          expect(toggleExpandedAttribute).toBe('false')
        })
      })

      describe('when toggle button is clicked once', () => {
        beforeAll(async () => {
          await render(page, 'service-header', examples['with navigation'])
          await page.waitForSelector(toggleButtonSelector)
          await page.click(toggleButtonSelector)
        })

        it('shows the navigation', async () => {
          const navigationHiddenAttribute = await page.$eval(
            navigationSelector,
            (el) => el.hasAttribute('hidden')
          )

          expect(navigationHiddenAttribute).toBeFalsy()
        })

        it('sets `aria-expanded` to true', async () => {
          const toggleExpandedAttribute = await page.$eval(
            toggleButtonSelector,
            (el) => el.getAttribute('aria-expanded')
          )

          expect(toggleExpandedAttribute).toBe('true')
        })
      })

      describe('when toggle button is clicked twice', () => {
        beforeAll(async () => {
          await render(page, 'service-header', examples['with navigation'])
          await page.waitForSelector(toggleButtonSelector)
          await page.click(toggleButtonSelector)
          await page.click(toggleButtonSelector)
        })

        it('hides the navigation', async () => {
          const navigationHiddenAttribute = await page.$eval(
            navigationSelector,
            (el) => el.hasAttribute('hidden')
          )

          expect(navigationHiddenAttribute).toBeTruthy()
        })

        it('sets `aria-expanded` to false', async () => {
          const toggleExpandedAttribute = await page.$eval(
            toggleButtonSelector,
            (el) => el.getAttribute('aria-expanded')
          )

          expect(toggleExpandedAttribute).toBe('false')
        })
      })
    })
  })
})
