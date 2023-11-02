const { goToExample, render } = require('@govuk-frontend/helpers/puppeteer')
const { scriptsPath } = require('@govuk-frontend/lib/components')

describe('GOV.UK Frontend', () => {
  describe('JavaScript', () => {
    let exported

    beforeEach(async () => {
      await render(page)

      // Exports available via browser dynamic import
      exported = await page.evaluate(
        async (importPath) => Object.keys(await import(importPath)),
        scriptsPath.href
      )
    })

    it('exports `initAll` function', async () => {
      const typeofInitAll = await page.evaluate(
        async (importPath, exportName) => {
          const namespace = await import(importPath)
          return typeof namespace[exportName]
        },
        scriptsPath.href,
        'initAll'
      )

      expect(typeofInitAll).toEqual('function')
    })

    it('exports Components', async () => {
      const components = exported
        .filter((method) => !['initAll', 'version'].includes(method))
        .sort()

      // Ensure GOV.UK Frontend exports the expected components
      expect(components).toEqual([
        'Accordion',
        'Button',
        'CharacterCount',
        'Checkboxes',
        'ErrorSummary',
        'ExitThisPage',
        'Header',
        'NotificationBanner',
        'Radios',
        'SkipLink',
        'Tabs'
      ])
    })

    it('can be initialised scoped to certain sections of the page', async () => {
      const page = await goToExample(browser, 'scoped-initialisation')

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
