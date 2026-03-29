const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { lint } = require('@lyricalstring/gale')

describe('The core layer', () => {
  it('does not reference any undefined custom properties', async () => {
    // Requires base as this is where the custom properties come from
    const sass = `
      @import "base";
      @import "core";
    `

    const { css } = await compileSassString(sass)

    const linter = await lint({
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
})
