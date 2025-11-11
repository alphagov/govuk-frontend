const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('@mixin _govuk-rebrand', () => {
  it('wraps arbitrary properties in a class', async () => {
    const sass = `
      @import "base";

      .foo {
        border-width: 1px;
        border-colour: #fff;

        @include _govuk-rebrand() {
          border-width: 10px;
          border-colour: #000;
        }
      }
    `

    const { css } = await compileSassString(sass)

    await expect(css).toContain(outdent`
        .foo {
          border-width: 1px;
          border-colour: #fff;
        }
        .govuk-template--rebranded .foo {
          border-width: 10px;
          border-colour: #000;
        }
      `)
  })

  describe('`$property` argument', () => {
    it('renders both original and rebranded version', async () => {
      const sass = `
        @import "base";

        .foo {
          @include _govuk-rebrand("background-color", $from: #fff, $to: #000)
        }
      `

      const { css } = await compileSassString(sass)

      await expect(css).toContain(outdent`
          .foo {
            background-color: #fff;
          }
          .govuk-template--rebranded .foo {
            background-color: #000;
          }
        `)
    })

    it('throws an error if not provided the original value', async () => {
      const sass = `
        @import "base";

        .foo {
          @include _govuk-rebrand("background-color", $to: #000)
        }
      `

      await expect(compileSassString(sass)).rejects.toThrow(
        '`_govuk-rebrand` needs the original value, `$from`'
      )
    })

    it('throws an error if not provided the rebranded value', async () => {
      const sass = `
        @import "base";

        .foo {
          @include _govuk-rebrand("background-color", $from: #fff)
        }
      `

      await expect(compileSassString(sass)).rejects.toThrow(
        '`_govuk-rebrand` needs the rebranded value, `$to`'
      )
    })
  })

  describe('when used in `.govuk-template` it outputs a `.govuk-template--rebranded` class at root', () => {
    it('when styling a block', async () => {
      const sass = `
        @import "base";

        .govuk-template {
          border-width: 1px;
          border-colour: #fff;

          @include _govuk-rebrand {
            border-width: 10px;
            border-colour: #000;
          }
        }
      `

      const { css } = await compileSassString(sass)

      expect(css).toContain(outdent`
          .govuk-template {
            border-width: 1px;
            border-colour: #fff;
          }
          .govuk-template--rebranded {
            border-width: 10px;
            border-colour: #000;
          }
        `)
    })

    it('when styling a specific property', async () => {
      const sass = `
        @import "base";

        .govuk-template {
          @include _govuk-rebrand("background-color",
            $from: #fff,
            $to: #000)
        }
      `

      const { css } = await compileSassString(sass)

      expect(css).toContain(outdent`
          .govuk-template {
            background-color: #fff;
          }
          .govuk-template--rebranded {
            background-color: #000;
          }
        `)
    })
  })
})
