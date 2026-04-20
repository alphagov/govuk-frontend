const { compileSassString } = require('@govuk-frontend/helpers/tests')
const stylelint = require('stylelint')

describe('The overrides layer', () => {
  describe.each([
    [
      'import',
      `
      @import "base";
      @import "overrides";
    `
    ],
    ['use', `@use "overrides";`]
  ])('with `@%s`', (type, sass) => {
    let css

    beforeAll(async () => {
      css = (await compileSassString(sass)).css
    })

    it('does not reference any undefined custom properties', async () => {
      const linter = await stylelint.lint({
        config: { rules: { 'no-unknown-custom-properties': true } },
        code: css
      })

      // Output stylelint warnings to make debugging easier
      if (linter.results[0].warnings.length) {
        console.log(
          'Warnings were present when testing the utilities layer for unknown custom properties:'
        )
        console.log(linter.results[0].warnings)
      }

      return expect(linter.results[0].warnings).toHaveLength(0)
    })
  })
})
