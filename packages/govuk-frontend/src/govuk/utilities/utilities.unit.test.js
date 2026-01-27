const { compileSassString } = require('@govuk-frontend/helpers/tests')
const stylelint = require('stylelint')

describe('The utilities layer', () => {
  it('does not reference any undefined custom properties', async () => {
    // Requires base as this is where the custom properties come from
    const sass = `
      @import "base";
      @import "utilities";
    `

    const { css } = await compileSassString(sass)

    const linter = await stylelint.lint({
      config: { rules: { 'no-unknown-custom-properties': true } },
      code: css
    })

    // Output stylelint warnings to make debugging easier
    if (linter.results[0].warnings.length) {
      console.log(
        'Warnings were present when testing the utilities for unknown custom properties:'
      )
      console.log(linter.results[0].warnings)
    }

    return expect(linter.results[0].warnings).toHaveLength(0)
  })
})
