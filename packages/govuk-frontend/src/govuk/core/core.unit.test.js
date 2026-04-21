const { compileSassString } = require('@govuk-frontend/helpers/tests')
const stylelint = require('stylelint')

describe('The core layer', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "core";
    `
    ],
    ['use', `@use "core";`]
  ])('with `@%s`', (type, sass) => {
    let css

    beforeAll(async () => {
      css = (await compileSassString(sass)).css
    })

    it('outputs the custom properties only once', () => {
      const occurrences = css.matchAll(/--govuk-breakpoint-mobile/g)

      expect(Array.from(occurrences)).toHaveLength(1)
    })

    it('does not reference any undefined custom properties', async () => {
      const linter = await stylelint.lint({
        config: { rules: { 'no-unknown-custom-properties': true } },
        code: css
      })

      // Output stylelint warnings to make debugging easier
      if (linter.results[0].warnings.length) {
        console.log(
          'Warnings were present when testing the core layer for unknown custom properties:'
        )
        console.log(linter.results[0].warnings)
      }

      return expect(linter.results[0].warnings).toHaveLength(0)
    })

    describe('placeholder selectors', () => {
      it('generates selector combining placeholders from list and typography', () => {
        expect(css).toContain('.govuk-list + .govuk-heading-s')
      })

      it('generates selectors when placeholders for list and typography are extended', async () => {
        const { css } = await compileSassString(`
          ${sass}

          ul {
            @extend %govuk-list;
          }

          h2 {
            @extend %govuk-heading-s;
          }
        `)

        expect(css).toContain('ul + .govuk-heading-s')
        expect(css).toContain('.govuk-list + h2')
        expect(css).toContain('ul + h2')
      })
    })
  })
})
