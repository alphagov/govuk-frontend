const {
  goToExample,
  renderAndInitialise
} = require('govuk-frontend-helpers/puppeteer')
const { getExamples } = require('govuk-frontend-lib/components')

describe('Skip Link', () => {
  describe('/examples/template-default', () => {
    beforeAll(async () => {
      await goToExample(page, 'template-default')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
    })

    it('focuses the linked element', async () => {
      const activeElement = await page.evaluate(() => document.activeElement.id)

      expect(activeElement).toBe('main-content')
    })

    it('adds the tabindex attribute to the linked element', async () => {
      const tabindex = await page.$eval('.govuk-main-wrapper', (el) =>
        el.getAttribute('tabindex')
      )

      expect(tabindex).toBe('-1')
    })

    it('adds the class for removing the native focus style to the linked element', async () => {
      const cssClass = await page.$eval('.govuk-main-wrapper', (el) =>
        el.classList.contains('govuk-skip-link-focused-element')
      )

      expect(cssClass).toBeTruthy()
    })

    it('removes the tabindex attribute from the linked element on blur', async () => {
      await page.$eval(
        '.govuk-main-wrapper',
        (el) => el instanceof window.HTMLElement && el.blur()
      )

      const tabindex = await page.$eval('.govuk-main-wrapper', (el) =>
        el.getAttribute('tabindex')
      )

      expect(tabindex).toBeNull()
    })

    it('removes the class for removing the native focus style from the linked element on blur', async () => {
      await page.$eval(
        '.govuk-main-wrapper',
        (el) => el instanceof window.HTMLElement && el.blur()
      )

      const cssClass = await page.$eval('.govuk-main-wrapper', (el) =>
        el.getAttribute('class')
      )

      expect(cssClass).not.toContain('govuk-skip-link-focused-element')
    })
  })

  describe('errors at instantiation', () => {
    let examples

    beforeAll(async () => {
      examples = await getExamples('skip-link')
    })

    it('throws when GOV.UK Frontend is not supported', async () => {
      await expect(
        renderAndInitialise(page, 'skip-link', {
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
