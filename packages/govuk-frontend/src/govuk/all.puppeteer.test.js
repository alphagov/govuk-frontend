const { render } = require('@govuk-frontend/helpers/puppeteer')
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

      expect(typeofInitAll).toBe('function')
    })

    it('exports `createAll` function', async () => {
      const typeofCreateAll = await page.evaluate(
        async (importPath, exportName) => {
          const namespace = await import(importPath)
          return typeof namespace[exportName]
        },
        scriptsPath.href,
        'createAll'
      )

      expect(typeofCreateAll).toBe('function')
    })

    it('exports Components', async () => {
      const components = exported
        .filter(
          (method) => !['initAll', 'createAll', 'version'].includes(method)
        )
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
        'PasswordInput',
        'Radios',
        'SkipLink',
        'Tabs'
      ])
    })
  })
})
