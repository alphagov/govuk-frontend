import {
  compileSassString,
  configureGOVUKFrontend
} from '@govuk-frontend/helpers/tests'

describe('core/typography', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "core/typography";
    `
    ],
    ['use', `@use "core/typography";`]
  ])('with `@%s`', (type, sass) => {
    it('can be configured', async () => {
      const { css } = await compileSassString(`
        ${configureGOVUKFrontend(type, {
          '$govuk-functional-colours': '(text: rebeccapurple)'
        })}
        ${sass}
      `)

      expect(css).toContain('var(--govuk-text-colour, rebeccapurple)')
    })

    it.each([
      'govuk-heading-xl',
      'govuk-heading-l',
      'govuk-heading-m',
      'govuk-heading-s',
      'govuk-body-l',
      'govuk-body-m',
      'govuk-body-s'
    ])('provides a %s placeholder', async (placeholderName) => {
      const { css } = await compileSassString(`
        ${sass};

        .selector {
          @extend %${placeholderName};
        }
      `)

      // Use a RegExp as the `--spaced` placeholder only generates `<SELECTOR> > li` selectors
      expect(css).toMatch(new RegExp(`\\.selector.*, \\.${placeholderName}`))
    })
  })
})
