import { nunjucksEnv, renderMacro } from '@govuk-frontend/lib/components'

describe('rebrand.njk', () => {
  describe('govukSetRebrand', () => {
    describe('from params', () => {
      it('passes `true` to the caller if `params.rebrand` is `true`', () => {
        const render = renderMacro(
          'govukSetRebrand',
          'govuk/macros/rebrand.njk',
          {
            context: {
              rebrand: true
            },
            callBlock: '{{received}}',
            callArgs: ['received']
          }
        )

        // Note the starting space so we ensure it doesn't stick to possible other previous attributes
        expect(render.trim()).toBe('true')
      })

      it('passes `false` to the caller if `params.rebrand` is `false`', () => {
        const render = renderMacro(
          'govukSetRebrand',
          'govuk/macros/rebrand.njk',
          {
            callBlock: '{{received}}',
            callArgs: ['received']
          }
        )

        // Note the starting space so we ensure it doesn't stick to possible other previous attributes
        expect(render.trim()).toBe('false')
      })
    })
    describe('from globals', () => {
      it('passes `true` to the caller if `govukRebrandGlobal returns true`', () => {
        const env = nunjucksEnv()
        env.addGlobal('govukRebrandGlobal', () => true)

        const render = renderMacro(
          'govukSetRebrand',
          'govuk/macros/rebrand.njk',
          {
            callBlock: '{{received}}',
            callArgs: ['received'],
            env
          }
        )

        // Note the starting space so we ensure it doesn't stick to possible other previous attributes
        expect(render.trim()).toBe('true')
      })
      it('passes `false` to the caller if `govukRebrandGlobal returns false`', () => {
        const env = nunjucksEnv()
        env.addGlobal('govukRebrandGlobal', () => false)

        const render = renderMacro(
          'govukSetRebrand',
          'govuk/macros/rebrand.njk',
          {
            callBlock: '{{received}}',
            callArgs: ['received'],
            env
          }
        )

        // Note the starting space so we ensure it doesn't stick to possible other previous attributes
        expect(render.trim()).toBe('false')
      })
    })
  })
})
