import { goToExample } from '@govuk-frontend/helpers/puppeteer'

describe('Example: Translated', () => {
  describe('Accordion', () => {
    /** @type {globalThis.page} */
    let page

    beforeEach(async () => {
      page = await goToExample(browser, 'translated')
    })

    afterEach(async () => {
      // Clear accordion state
      await page.evaluate(() => window.sessionStorage.clear())
    })

    it('should localise "Show all sections" based on JavaScript configuration', async () => {
      const allSectionsToggleText = await page.evaluate(
        () =>
          document.body.querySelector('.govuk-accordion__show-all-text')
            .innerHTML
      )

      expect(allSectionsToggleText).toBe('Dangos adrannau')
    })

    it('should localise "Hide all sections" based on JavaScript configuration', async () => {
      await page.click('.govuk-accordion .govuk-accordion__show-all')

      const allSectionsToggleText = await page.evaluate(
        () =>
          document.body.querySelector('.govuk-accordion__show-all-text')
            .innerHTML
      )

      expect(allSectionsToggleText).toBe('Cuddio adrannau')
    })

    it('should localise "Show section" based on JavaScript configuration', async () => {
      const firstSectionToggleText = await page.evaluate(
        () =>
          document.body.querySelector('.govuk-accordion__section-toggle-text')
            .innerHTML
      )

      expect(firstSectionToggleText).toBe('Dangos')
    })

    it('should localise "Show section" aria-label based on JavaScript configuration', async () => {
      const firstSectionToggleAriaLabel = await page.evaluate(() =>
        document.body
          .querySelector('.govuk-accordion__section-button')
          .getAttribute('aria-label')
      )

      expect(firstSectionToggleAriaLabel.endsWith('Dangos adran')).toBeTruthy()
    })

    it('should localise "Hide section" based on JavaScript configuration', async () => {
      await page.click(
        '.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header'
      )

      const firstSectionToggleText = await page.evaluate(
        () =>
          document.body.querySelector('.govuk-accordion__section-toggle-text')
            .innerHTML
      )

      expect(firstSectionToggleText).toBe('Cuddio')
    })

    it('should localise "Hide section" aria-label based on JavaScript configuration', async () => {
      await page.click(
        '.govuk-accordion .govuk-accordion__section:nth-of-type(2) .govuk-accordion__section-header'
      )

      const firstSectionToggleAriaLabel = await page.evaluate(() =>
        document.body
          .querySelector('.govuk-accordion__section-button')
          .getAttribute('aria-label')
      )

      expect(firstSectionToggleAriaLabel.endsWith('Cuddio adran')).toBeTruthy()
    })
  })
})
