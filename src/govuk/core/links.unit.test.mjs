import {
  compileSassString,
  configureGOVUKFrontend
} from '@govuk-frontend/helpers/tests'

describe('core/links', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "core/links";
    `
    ],
    ['use', `@use "core/links";`]
  ])('with `@%s`', (type, sass) => {
    it('can be configured', async () => {
      const { css } = await compileSassString(`
        ${configureGOVUKFrontend(type, {
          '$govuk-functional-colours': '(link: rebeccapurple)'
        })}
        ${sass}
      `)

      expect(css).toContain('var(--govuk-link-colour, rebeccapurple)')
    })

    it('provides a `%govuk-link` placeholder', async () => {
      const { css } = await compileSassString(`
        ${sass};

        .selector {
          @extend %govuk-link;
        }
      `)

      // Use a RegExp as the `--spaced` placeholder only generates `<SELECTOR> > li` selectors
      expect(css).toContain('.selector, .govuk-link')
    })
  })
})
