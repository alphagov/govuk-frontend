/**
 * @jest-environment puppeteer
 */

const { goToComponent, goToExample } = require('govuk-frontend-helpers/puppeteer')

const buttonClass = '.govuk-js-exit-this-page-button'
const skiplinkClass = '.govuk-js-exit-this-page-skiplink'
const overlayClass = '.govuk-exit-this-page-overlay'

describe('/components/exit-this-page', () => {
  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      await page.setJavaScriptEnabled(false)
    })

    afterAll(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('navigates to the href of the button', async () => {
      await goToComponent(page, 'exit-this-page')

      const href = await page.evaluate((buttonClass) => document.querySelector(buttonClass).href, buttonClass)

      await Promise.all([
        page.waitForNavigation(),
        page.click(buttonClass)
      ])

      const url = await page.url()
      expect(url).toBe(href)
    })

    it('navigates to the href of the skiplink', async () => {
      await goToExample(page, 'exit-this-page-with-skiplink')

      const href = await page.evaluate((skiplinkClass) => document.querySelector(skiplinkClass).href, skiplinkClass)

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
      await goToComponent(page, 'exit-this-page')

      const href = await page.evaluate((buttonClass) => document.querySelector(buttonClass).href, buttonClass)

      await Promise.all([
        page.waitForNavigation(),
        page.click(buttonClass)
      ])

      const url = await page.url()
      expect(url).toBe(href)
    })

    it('navigates to the href of the skiplink', async () => {
      await goToExample(page, 'exit-this-page-with-skiplink')

      const href = await page.evaluate((skiplinkClass) => document.querySelector(skiplinkClass).href, skiplinkClass)

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
      await page.evaluate((buttonClass) => document.body.querySelector(buttonClass).setAttribute('href', '#'), buttonClass)
      await page.click(buttonClass)

      const ghostOverlay = await page.evaluate((overlayClass) => document.body.querySelector(overlayClass), overlayClass)
      expect(ghostOverlay).not.toBeNull()
    })

    it('shows the ghost page when the skiplink is clicked', async () => {
      await goToExample(page, 'exit-this-page-with-skiplink')

      // Stop the button from navigating away from the current page as a workaround
      // to puppeteer struggling to return to previous pages after navigation reliably
      await page.evaluate((skiplinkClass) => document.body.querySelector(skiplinkClass).setAttribute('href', '#'), skiplinkClass)
      await page.focus(skiplinkClass)
      await page.click(skiplinkClass)

      const ghostOverlay = await page.evaluate((overlayClass) => document.body.querySelector(overlayClass), overlayClass)
      expect(ghostOverlay).not.toBeNull()
    })

    describe('keyboard shortcut activation', () => {
      it('activates the button functionality when the Shift key is pressed 3 times', async () => {
        await goToComponent(page, 'exit-this-page')

        const href = await page.evaluate((buttonClass) => document.querySelector(buttonClass).href, buttonClass)

        await Promise.all([
          page.keyboard.press('Shift'),
          page.keyboard.press('Shift'),
          page.keyboard.press('Shift'),
          page.waitForNavigation()
        ])

        const url = await page.url()
        expect(url).toBe(href)
      })

      it('announces when the Shift key has been pressed once', async () => {
        await goToComponent(page, 'exit-this-page')

        await page.keyboard.press('Shift')

        const message = await page.evaluate((buttonClass) => document.querySelector(buttonClass).nextElementSibling.innerText, buttonClass)
        expect(message).toBe('Shift, press 2 more times to exit.')
      })

      it('announces when the Shift key has been pressed twice', async () => {
        await goToComponent(page, 'exit-this-page')

        await page.keyboard.press('Shift')
        await page.keyboard.press('Shift')

        const message = await page.evaluate((buttonClass) => document.querySelector(buttonClass).nextElementSibling.innerText, buttonClass)
        expect(message).toBe('Shift, press 1 more time to exit.')
      })

      it('announces when the keyboard shortcut has been successfully activated', async () => {
        await goToComponent(page, 'exit-this-page')

        // Make the button not navigate away from the current page
        await page.evaluate((buttonClass) => document.body.querySelector(buttonClass).setAttribute('href', '#'), buttonClass)

        await page.keyboard.press('Shift')
        await page.keyboard.press('Shift')
        await page.keyboard.press('Shift')

        const message = await page.evaluate((overlayClass) => document.querySelector(overlayClass).innerText, overlayClass)
        expect(message).toBe('Loading.')
      })

      it('announces when the keyboard shortcut has timed out', async () => {
        await goToComponent(page, 'exit-this-page')

        await page.keyboard.press('Shift')

        // Wait for 6 seconds (one full second over the 5 second limit)
        await new Promise((resolve) => setTimeout(resolve, 6000))

        const message = await page.evaluate((buttonClass) => document.querySelector(buttonClass).nextElementSibling.innerText, buttonClass)
        expect(message).toBe('Exit this page expired.')
      })
    })
  })
})
