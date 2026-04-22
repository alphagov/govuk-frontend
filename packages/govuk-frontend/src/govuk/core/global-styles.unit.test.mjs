import {
  compileSassString,
  configureGOVUKFrontend
} from '@govuk-frontend/helpers/tests'

describe('core/global-styles', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "core/global-styles";
    `
    ],
    ['use', `@use "core/global-styles";`]
  ])('with `@%s`', (type, sass) => {
    describe(`$govuk-global-styles`, () => {
      it('does not output global styles by default', async () => {
        const { css } = await compileSassString(sass)

        expect(css).not.toContain('a, .govuk-link {')
        expect(css).not.toContain('p, .govuk-body, .govuk-body-m {')
      })

      it('outputs global styles if `$global-styles` variable is set to `true`', async () => {
        const { css } = await compileSassString(`
          ${configureGOVUKFrontend(type, { '$govuk-global-styles': 'true' })}
          ${sass}
        `)

        expect(css).toContain('a, .govuk-link {')
        expect(css).toContain('p, .govuk-body, .govuk-body-m {')
      })
    })
  })
})
