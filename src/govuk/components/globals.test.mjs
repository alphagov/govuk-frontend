import { goTo, goToExample } from '../../../lib/puppeteer-helpers.js'

describe('GOV.UK Frontend', () => {
  describe('javascript', () => {
    it('can be accessed via `GOVUKFrontend`', async () => {
      await goTo(page, '/')

      const GOVUKFrontendGlobal = await page.evaluate(() => window.GOVUKFrontend)

      expect(typeof GOVUKFrontendGlobal).toBe('object')
    })

    it('exports `initAll` function', async () => {
      await goTo(page, '/')

      const typeofInitAll = await page.evaluate(() => typeof window.GOVUKFrontend.initAll)

      expect(typeofInitAll).toEqual('function')
    })

    it('exports Components', async () => {
      await goTo(page, '/')

      const GOVUKFrontendGlobal = await page.evaluate(() => window.GOVUKFrontend)

      const components = Object.keys(GOVUKFrontendGlobal)
        .filter(method => !['initAll', 'version'].includes(method))

      // Ensure GOV.UK Frontend exports the expected components
      expect(components).toEqual([
        'Accordion',
        'Button',
        'Details',
        'CharacterCount',
        'Checkboxes',
        'ErrorSummary',
        'Header',
        'NotificationBanner',
        'Radios',
        'SkipLink',
        'Tabs'
      ])
    })

    it('exported Components have an init function', async () => {
      await goTo(page, '/')

      const componentsWithoutInitFunctions = await page.evaluate(() => {
        const components = Object.keys(window.GOVUKFrontend)
          .filter(method => !['initAll', 'version'].includes(method))

        return components.filter(component => {
          const prototype = window.GOVUKFrontend[component].prototype
          return typeof prototype.init !== 'function'
        })
      })

      expect(componentsWithoutInitFunctions).toEqual([])
    })
    it('can be initialised scoped to certain sections of the page', async () => {
      await goToExample(page, 'scoped-initialisation')

      // To test that certain parts of the page are scoped we have two similar components
      // that we can interact with to check if they're interactive.

      // Check that the conditional reveal component has a conditional section that would open if enhanced.
      await page.waitForSelector('#conditional-not-scoped', { hidden: true })

      await page.click('[for="not-scoped"]')

      // Check that when it is clicked that nothing opens, which shows that it has not been enhanced.
      await page.waitForSelector('#conditional-not-scoped', { hidden: true })

      // Check the other conditional reveal which has been enhanced based on it's scope.
      await page.waitForSelector('#conditional-scoped', { hidden: true })

      await page.click('[for="scoped"]')

      // Check that it has opened as expected.
      await page.waitForSelector('#conditional-scoped', { hidden: false })
    })
  })
})
