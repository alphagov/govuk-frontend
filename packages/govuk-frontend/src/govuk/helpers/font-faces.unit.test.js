const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('_govuk-font-face-gds-transport', () => {
  it('outputs `@font-face` at-rules for GDS transport', async () => {
    const sass = `
      @import "helpers/font-faces";

      @include _govuk-font-face-gds-transport;
    `

    const { css } = await compileSassString(sass)

    expect(css).toContain(outdent`
    @font-face {
      font-family: "GDS Transport";
      font-style: normal;
      font-weight: normal;
      src: url("/assets/fonts/light-94a07e06a1-v2.woff2") format("woff2"), url("/assets/fonts/light-f591b13f7d-v2.woff") format("woff");
      font-display: fallback;
    }
    @font-face {
      font-family: "GDS Transport";
      font-style: normal;
      font-weight: bold;
      src: url("/assets/fonts/bold-b542beb274-v2.woff2") format("woff2"), url("/assets/fonts/bold-affa96571d-v2.woff") format("woff");
      font-display: fallback;
    }
    `)
  })
  it.todo('outputs the font-face declarations at root')
  it.todo('responds to changes of `$govuk-assets-path`')
  it.todo('responds to changes of `$govuk-font-url-function`')
})
