const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('@mixin govuk-width-container', () => {
  it('allows different widths to be specified using $width', async () => {
    const sass = `
      @import "objects/width-container";

      .app-width-container--wide {
        @include govuk-width-container(1200px);
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: expect.stringContaining(outdent`
        .app-width-container--wide {
          max-width: 1200px;
          margin-right: 15px;
          margin-left: 15px;
        }
        @supports (margin: max(calc(0px))) {
          .app-width-container--wide {
            margin-right: max(15px, calc(15px + env(safe-area-inset-right)));
            margin-left: max(15px, calc(15px + env(safe-area-inset-left)));
          }
        }
        @media (min-width: 40.0625em) {
          .app-width-container--wide {
            margin-right: 30px;
            margin-left: 30px;
          }
          @supports (margin: max(calc(0px))) {
            .app-width-container--wide {
              margin-right: max(30px, calc(15px + env(safe-area-inset-right)));
              margin-left: max(30px, calc(15px + env(safe-area-inset-left)));
            }
          }
        }
        @media (min-width: 1260px) {
          .app-width-container--wide {
            margin-right: auto;
            margin-left: auto;
          }
          @supports (margin: max(calc(0px))) {
            .app-width-container--wide {
              margin-right: auto;
              margin-left: auto;
            }
          }
        }
      `)
    })
  })
})
