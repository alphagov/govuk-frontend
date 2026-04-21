import {
  compileSassString,
  configureGOVUKFrontend
} from '@govuk-frontend/helpers/tests'

describe('core/lists', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "core/lists";
    `
    ],
    ['use', `@use "core/lists";`]
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
      'govuk-list',
      'govuk-list--bullet',
      'govuk-list--number',
      'govuk-list--spaced'
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
