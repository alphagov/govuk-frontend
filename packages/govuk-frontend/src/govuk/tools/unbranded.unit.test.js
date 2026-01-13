const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('@mixin _govuk-unbranded', () => {
  it('wraps arbitrary properties in a class', async () => {
    const sass = `
      @import "base";

      .foo {
        border-width: 1px;
        border-colour: #fff;

        @include _govuk-unbranded() {
          border-width: 10px;
          border-colour: #000;
        }
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          border-width: 1px;
          border-colour: #fff;
        }
        .govuk-template--unbranded .foo {
          border-width: 10px;
          border-colour: #000;
        }
      `
    })
  })

  describe('when used in `.govuk-template` it outputs a `.govuk-template--unbranded` class at root', () => {
    it('when styling a block', async () => {
      const sass = `
        @import "base";

        .govuk-template {
          border-width: 1px;
          border-colour: #fff;

          @include _govuk-unbranded {
            border-width: 10px;
            border-colour: #000;
          }
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .govuk-template {
            border-width: 1px;
            border-colour: #fff;
          }
          .govuk-template--unbranded {
            border-width: 10px;
            border-colour: #000;
          }
        `
      })
    })
  })
})
