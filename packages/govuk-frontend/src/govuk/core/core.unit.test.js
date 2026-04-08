const { compileSassString } = require('@govuk-frontend/helpers/tests')
const stylelint = require('stylelint')

describe('The core layer', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "core";

      h2 {
        @extend %govuk-heading-m;
      }

      ul {
        @extend %govuk-list;
      }
    `
    ],
    [
      'use',
      `
      @use "core";

      h2 {
        @extend %govuk-heading-m;
      }

      ul {
        @extend %govuk-list;
      }
      `
    ]
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

    it('allows extension of placeholders', () => {
      expect(css).toContain('h2, .govuk-heading-m')
    })

    // Based on the `%govuk-list + %govuk-heading-m` placeholder spacing
    // adjustment in _typography.scss, which ul and h2 extend in our test Sass
    it('allows extension of combinatorial placeholders', () => {
      expect(css).toContain('ul + h2')
      expect(css).toContain('.govuk-list + h2')
      expect(css).toContain('ul + .govuk-heading-m')
    })
  })
})
