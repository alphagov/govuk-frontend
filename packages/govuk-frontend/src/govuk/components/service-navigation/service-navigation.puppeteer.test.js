const { render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')
const { KnownDevices } = require('puppeteer')

const iPhone = KnownDevices['iPhone 6']

const navigationSelector = `.govuk-service-navigation__list`
const toggleButtonSelector = '.govuk-js-service-navigation-toggle'

describe('/components/service-navigation', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('service-navigation')

    // The only JS functionality this component has currently is on mobile
    // viewports, so let's emulate a phone.
    await page.emulate(iPhone)
  })

  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
      await render(page, 'service-navigation', examples.default)
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
          render(page, 'service-navigation', examples.default)
        ).resolves.not.toThrow()
      })
    })

    describe('when navigation is present but the menu button is not', () => {
      it('exits gracefully with no errors', async () => {
        // Errors logged to the console will cause this test to fail
        return expect(
          render(
            page,
            'service-navigation',
            examples['with collapseNavigationOnMobile set to false']
          )
        ).resolves.not.toThrow()
      })
    })

    describe('errors at instantiation', () => {
      it('can throw a SupportError if appropriate', async () => {
        await expect(
          render(page, 'service-navigation', examples.default, {
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

      it('throws when $root is not set', async () => {
        await expect(
          render(page, 'service-navigation', examples.default, {
            beforeInitialisation($root) {
              // Remove the root of the components as a way
              // for the constructor to receive the wrong type for `$root`
              $root.remove()
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'govuk-service-navigation: Root element (`$root`) not found'
          }
        })
      })

      it("throws when the toggle's aria-control attribute is missing", async () => {
        await expect(
          render(page, 'service-navigation', examples.default, {
            beforeInitialisation($root, { selector }) {
              $root
                .querySelector(selector)
                .removeAttribute('data-aria-controls')
            },
            context: {
              selector: toggleButtonSelector
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'govuk-service-navigation: Navigation button (`<button class="govuk-js-service-navigation-toggle">`) attribute (`data-aria-controls`) not found'
          }
        })
      })

      it('throws when the menu is missing, but a toggle is present', async () => {
        await expect(
          render(page, 'service-navigation', examples.default, {
            beforeInitialisation($root, { selector }) {
              // Remove the `<ul>` referenced by $menuButton's `aria-controls`
              $root.querySelector(selector).remove()
            },
            context: {
              selector: navigationSelector
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'govuk-service-navigation: Navigation (`<ul id="navigation">`) not found'
          }
        })
      })
    })

    describe('on page load', () => {
      beforeAll(async () => {
        await render(page, 'service-navigation', examples.default)
      })

      it('renders navigation hidden by default', async () => {
        const navigationIsHidden = await page.$eval(navigationSelector, (el) =>
          el.hasAttribute('hidden')
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

      it('adds the `aria-controls` attribute to the toggle', async () => {
        const toggleExpandedAttribute = await page.$eval(
          toggleButtonSelector,
          (el) => el.getAttribute('aria-controls')
        )

        expect(toggleExpandedAttribute).toBe('navigation')
      })
    })

    describe('when toggle button is clicked once', () => {
      beforeAll(async () => {
        await render(page, 'service-navigation', examples.default)
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
        await render(page, 'service-navigation', examples.default)
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

    describe('on wide viewports', () => {
      beforeAll(async () => {
        // First let's reset the viewport to a desktop one
        await page.setViewport({
          width: 1280,
          height: 720
        })
      })

      afterAll(async () => {
        // After tests have run reset teh viewport to a phone
        await page.emulate(iPhone)
      })

      describe('on page load', () => {
        beforeAll(async () => {
          await render(page, 'service-navigation', examples.default)
        })

        it('shows the navigation', async () => {
          const navigationHiddenAttribute = await page.$eval(
            navigationSelector,
            (el) => el.hasAttribute('hidden')
          )

          expect(navigationHiddenAttribute).toBeFalsy()
        })

        it('keeps the toggle button hidden', async () => {
          const buttonHiddenAttribute = await page.$eval(
            toggleButtonSelector,
            (el) => el.hasAttribute('hidden')
          )

          expect(buttonHiddenAttribute).toBeTruthy()
        })
      })

      describe('when page is resized to a narrow viewport', () => {
        beforeAll(async () => {
          await render(page, 'service-navigation', examples.default)

          // Once the page is loaded resize the viewport to a narrow one
          // Only set the width and height to avoid the page getting wiped
          await page.setViewport({
            width: iPhone.viewport.width,
            height: iPhone.viewport.height
          })

          // Wait that the page got updated after the resize,
          // as sometimes the tests run too early
          await page.waitForSelector(`${navigationSelector}[hidden]`)
        })

        it('hides the navigation', async () => {
          const navigationHiddenAttribute = await page.$eval(
            `${navigationSelector}[hidden]`,
            (el) => el.hasAttribute('hidden')
          )

          expect(navigationHiddenAttribute).toBeTruthy()
        })

        it('reveals the toggle button', async () => {
          const buttonHiddenAttribute = await page.$eval(
            toggleButtonSelector,
            (el) => el.hasAttribute('hidden')
          )

          expect(buttonHiddenAttribute).toBeFalsy()
        })
      })
    })
  })
})
