/**
 * @jest-environment puppeteer
 */

const { goToComponent, goToExample } = require('../../../../lib/puppeteer-helpers.js')

describe('details', () => {
  it('should not polyfill when details element is available', async () => {
    await goToComponent(page, 'details')

    const summaryAriaExpanded = await page.evaluate(() => {
      return document.querySelector('summary').getAttribute('aria-expanded')
    })
    expect(summaryAriaExpanded).toBe(null)
  })

  describe('/examples/details-polyfill', () => {
    beforeAll(async () => {
      await goToExample(page, 'details-polyfill')
    })

    it('should add to summary the button role', async () => {
      const summaryRole = await page.evaluate(() => {
        return document.getElementById('default').querySelector('summary').getAttribute('role')
      })
      expect(summaryRole).toBe('button')
    })

    it('should set the element controlled by the summary using aria-controls', async () => {
      const summaryAriaControls = await page.evaluate(() => {
        return document.getElementById('default').querySelector('summary').getAttribute('aria-controls')
      })
      const controlledContainerId = await page.evaluate(() => {
        return document.getElementById('default').querySelector('.govuk-details__text').getAttribute('id')
      })
      expect(summaryAriaControls).toBe(controlledContainerId)
    })

    it('should set the expanded state of the summary to false using aria-expanded', async () => {
      const summaryAriaExpanded = await page.evaluate(() => {
        return document.getElementById('default').querySelector('summary').getAttribute('aria-expanded')
      })
      expect(summaryAriaExpanded).toBe('false')
    })

    it('should hide the content using display: none', async () => {
      const containerDisplay = await page.evaluate(() => {
        const container = document.getElementById('default').querySelector('.govuk-details__text')
        return window.getComputedStyle(container).getPropertyValue('display')
      })

      expect(containerDisplay).toBe('none')
    })

    it('should indicate the open state of the content', async () => {
      const detailsOpen = await page.evaluate(() => {
        return document.getElementById('default').getAttribute('open')
      })
      expect(detailsOpen).toBeNull()
    })

    describe('when details is triggered', () => {
      beforeEach(async () => {
        await goToExample(page, 'details-polyfill')
      })

      it('should indicate the expanded state of the summary using aria-expanded', async () => {
        await page.click('#default summary')

        const summaryAriaExpanded = await page.evaluate(() => {
          return document.getElementById('default').querySelector('summary').getAttribute('aria-expanded')
        })
        expect(summaryAriaExpanded).toBe('true')
      })

      it('should make the content visible', async () => {
        await page.click('#default summary')

        const containerDisplay = await page.evaluate(() => {
          const container = document.getElementById('default').querySelector('.govuk-details__text')
          return window.getComputedStyle(container).getPropertyValue('display')
        })

        expect(containerDisplay).toBe('block')
      })

      it('should indicate the open state of the content', async () => {
        await page.click('#default summary')

        const detailsOpen = await page.evaluate(() => {
          return document.getElementById('default').getAttribute('open')
        })
        expect(detailsOpen).not.toBeNull()
      })
    })
  })

  describe('expanded', () => {
    beforeEach(async () => {
      await goToExample(page, 'details-polyfill')
    })

    it('should indicate the expanded state of the summary using aria-expanded', async () => {
      const summaryAriaExpanded = await page.evaluate(() => {
        return document.getElementById('expanded').querySelector('summary').getAttribute('aria-expanded')
      })
      expect(summaryAriaExpanded).toBe('true')
    })

    it('should keep the content visible', async () => {
      const containerDisplay = await page.evaluate(() => {
        const container = document.getElementById('expanded').querySelector('.govuk-details__text')
        return window.getComputedStyle(container).getPropertyValue('display')
      })

      expect(containerDisplay).toBe('block')
    })

    it('should indicate the open state of the content', async () => {
      const detailsOpen = await page.evaluate(() => {
        return document.getElementById('expanded').getAttribute('open')
      })
      expect(detailsOpen).not.toBeNull()
    })

    it('should not be affected when clicking the revealed content', async () => {
      await page.click('#expanded .govuk-details__text')

      const summaryAriaExpanded = await page.evaluate(() => {
        return document.getElementById('expanded').querySelector('summary').getAttribute('aria-expanded')
      })
      expect(summaryAriaExpanded).toBe('true')
    })

    describe('when details is triggered', () => {
      it('should indicate the expanded state of the summary using aria-expanded', async () => {
        await page.click('#expanded summary')

        const summaryAriaExpanded = await page.evaluate(() => {
          return document.getElementById('expanded').querySelector('summary').getAttribute('aria-expanded')
        })
        expect(summaryAriaExpanded).toBe('false')
      })

      it('should hide the content using display: none', async () => {
        await page.click('#expanded summary')

        const containerDisplay = await page.evaluate(() => {
          const container = document.getElementById('expanded').querySelector('.govuk-details__text')
          return window.getComputedStyle(container).getPropertyValue('display')
        })

        expect(containerDisplay).toBe('none')
      })

      it('should indicate the open state of the content', async () => {
        await page.click('#expanded summary')

        const detailsOpen = await page.evaluate(() => {
          return document.getElementById('expanded').getAttribute('open')
        })
        expect(detailsOpen).toBeNull()
      })
    })
  })
})
