import { goToExample } from '@govuk-frontend/helpers/puppeteer'

describe('Example: Exit this page with skip link', () => {
  /** @type {globalThis.page} */
  let page

  const buttonClass = '.govuk-js-exit-this-page-button'
  const skiplinkClass = '.govuk-js-exit-this-page-skiplink'
  const overlayClass = '.govuk-exit-this-page-overlay'

  beforeEach(async () => {
    page = await goToExample(browser, 'exit-this-page-with-skiplink')
  })

  describe('when JavaScript is unavailable or fails', () => {
    beforeEach(async () => {
      await page.setJavaScriptEnabled(false)
      await page.reload()
    })

    afterEach(async () => {
      await page.setJavaScriptEnabled(true)
    })

    it('navigates to the href of the skiplink', async () => {
      const exitPageURL = await page
        .$eval(skiplinkClass, (el) => el.getAttribute('href'))
        .then((path) => new URL(path, 'file://'))

      await Promise.all([
        page.waitForNavigation(),
        page.focus(skiplinkClass),
        page.click(skiplinkClass)
      ])

      expect(page.url()).toBe(exitPageURL.href)
    })
  })

  describe('when JavaScript is available', () => {
    it('navigates to the href of the skiplink', async () => {
      const exitPageURL = await page
        .$eval(skiplinkClass, (el) => el.getAttribute('href'))
        .then((path) => new URL(path, 'file://'))

      await Promise.all([
        page.waitForNavigation(),
        page.focus(skiplinkClass),
        page.click(skiplinkClass)
      ])

      expect(page.url()).toBe(exitPageURL.href)
    })

    it('shows the ghost page when the EtP button is clicked', async () => {
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
  })
})
