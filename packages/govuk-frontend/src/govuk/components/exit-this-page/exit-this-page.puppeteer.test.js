const { setTimeout } = require('timers/promises')

const { goToExample, render } = require('@govuk-frontend/helpers/puppeteer')
const { getExamples } = require('@govuk-frontend/lib/components')

const buttonClass = '.govuk-js-exit-this-page-button'
const skiplinkClass = '.govuk-js-exit-this-page-skiplink'
const overlayClass = '.govuk-exit-this-page-overlay'

describe('/components/exit-this-page', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('exit-this-page')
  })

  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('navigates to the href of the button', async () => {
      await render(page, 'exit-this-page', examples.default)

      const pathname = await page.$eval(buttonClass, (el) =>
        el.getAttribute('href')
      )

      await Promise.all([page.waitForNavigation(), page.click(buttonClass)])

      const url = new URL(await page.url())

      expect(url.pathname).toBe(pathname)
    })

    it('navigates to the href of the skiplink', async () => {
      await goToExample(page, 'exit-this-page-with-skiplink')

      const href = await page.$eval(skiplinkClass, (el) =>
        el.getAttribute('href')
      )

      await Promise.all([
        page.waitForNavigation(),
        page.focus(skiplinkClass),
        page.click(skiplinkClass)
      ])

      const url = await page.url()
      expect(url).toBe(href)
    })
  })

  describe('when JavaScript is available', () => {
    it('navigates to the href of the button', async () => {
      await render(page, 'exit-this-page', examples.default)

      const pathname = await page.$eval(buttonClass, (el) =>
        el.getAttribute('href')
      )

      await Promise.all([page.waitForNavigation(), page.click(buttonClass)])

      const url = new URL(await page.url())
      expect(url.pathname).toBe(pathname)
    })

    it('navigates to the href of the skiplink', async () => {
      await goToExample(page, 'exit-this-page-with-skiplink')

      const href = await page.$eval(skiplinkClass, (el) =>
        el.getAttribute('href')
      )

      await Promise.all([
        page.waitForNavigation(),
        page.focus(skiplinkClass),
        page.click(skiplinkClass)
      ])

      const url = await page.url()
      expect(url).toBe(href)
    })

    it('shows the ghost page when the EtP button is clicked', async () => {
      await goToExample(page, 'exit-this-page-with-skiplink')

      // Stop the button from navigating away from the current page as a workaround
      // to puppeteer struggling to return to previous pages after navigation reliably
      await page.$eval(buttonClass, (el) => el.setAttribute('href', '#'))
      await page.click(buttonClass)

      const ghostOverlay = await page.evaluate(
        (overlayClass) => document.body.querySelector(overlayClass),
        overlayClass
      )
      expect(ghostOverlay).not.toBeNull()
    })

    it('shows the ghost page when the skiplink is clicked', async () => {
      await goToExample(page, 'exit-this-page-with-skiplink')

      // Stop the button from navigating away from the current page as a workaround
      // to puppeteer struggling to return to previous pages after navigation reliably
      //
      // We apply this to the button and not the skiplink because we pull the href
      // from the button rather than the skiplink
      await page.$eval(buttonClass, (el) => el.setAttribute('href', '#'))
      await page.focus(skiplinkClass)
      await page.click(skiplinkClass)

      const ghostOverlay = await page.evaluate(
        (overlayClass) => document.body.querySelector(overlayClass),
        overlayClass
      )
      expect(ghostOverlay).not.toBeNull()
    })

    describe('keyboard shortcut activation', () => {
      it('activates the button functionality when the Shift key is pressed 3 times', async () => {
        await render(page, 'exit-this-page', examples.default)

        const pathname = await page.$eval(buttonClass, (el) =>
          el.getAttribute('href')
        )

        await Promise.all([
          page.keyboard.press('Shift'),
          page.keyboard.press('Shift'),
          page.keyboard.press('Shift'),
          page.waitForNavigation()
        ])

        const url = new URL(await page.url())
        expect(url.pathname).toBe(pathname)
      })

      it('announces when the Shift key has been pressed once', async () => {
        await render(page, 'exit-this-page', examples.default)

        await page.keyboard.press('Shift')

        const message = await page.$eval(buttonClass, (el) =>
          el.nextElementSibling.innerHTML.trim()
        )
        expect(message).toBe('Shift, press 2 more times to exit.')
      })

      it('announces when the Shift key has been pressed twice', async () => {
        await render(page, 'exit-this-page', examples.default)

        await page.keyboard.press('Shift')
        await page.keyboard.press('Shift')

        const message = await page.$eval(buttonClass, (el) =>
          el.nextElementSibling.innerHTML.trim()
        )
        expect(message).toBe('Shift, press 1 more time to exit.')
      })

      it('announces when the keyboard shortcut has been successfully activated', async () => {
        await render(page, 'exit-this-page', examples.default)

        // Make the button not navigate away from the current page
        await page.$eval(buttonClass, (el) => el.setAttribute('href', '#'))

        await page.keyboard.press('Shift')
        await page.keyboard.press('Shift')
        await page.keyboard.press('Shift')

        const message = await page.$eval(overlayClass, (el) =>
          el.innerHTML.trim()
        )
        expect(message).toBe('Loading.')
      })

      it('announces when the keyboard shortcut has timed out', async () => {
        await render(page, 'exit-this-page', examples.default)

        await page.keyboard.press('Shift')

        // Wait for 6 seconds (one full second over the 5 second limit)
        await setTimeout(6000)

        const message = await page.$eval(buttonClass, (el) =>
          el.nextElementSibling.innerHTML.trim()
        )
        expect(message).toBe('Exit this page expired.')
      })
    })

    describe('errors at instantiation', () => {
      it('throws when GOV.UK Frontend is not supported', async () => {
        await expect(
          render(page, 'exit-this-page', examples.default, {
            beforeInitialisation() {
              document.body.classList.remove('govuk-frontend-supported')
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'SupportError',
            message: 'GOV.UK Frontend is not supported in this browser'
          }
        })
      })

      it('throws when $module is not set', async () => {
        await expect(
          render(page, 'exit-this-page', examples.default, {
            beforeInitialisation($module) {
              $module.remove()
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message: 'Exit this page: Root element (`$module`) not found'
          }
        })
      })

      it('throws when receiving the wrong type for $module', async () => {
        await expect(
          render(page, 'exit-this-page', examples.default, {
            beforeInitialisation($module) {
              // Replace with an `<svg>` element which is not an `HTMLElement` in the DOM (but an `SVGElement`)
              $module.outerHTML = `<svg data-module="govuk-exit-this-page"></svg>`
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Exit this page: Root element (`$module`) is not of type HTMLElement'
          }
        })
      })

      it('throws when the button is missing', async () => {
        await expect(
          render(page, 'exit-this-page', examples.default, {
            beforeInitialisation($module, { selector }) {
              $module.querySelector(selector).remove()
            },
            context: {
              selector: '.govuk-exit-this-page__button'
            }
          })
        ).rejects.toMatchObject({
          cause: {
            name: 'ElementError',
            message:
              'Exit this page: Button (`.govuk-exit-this-page__button`) not found'
          }
        })
      })
    })
  })
})
