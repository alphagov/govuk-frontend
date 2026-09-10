const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('focus styles', () => {
  describe('@mixin govuk-focus-outline', () => {
    it('defaults to the `focus` functional colour', async () => {
      const sass = `
        @use 'helpers/focused' as *;

        .app-component:focus {
          @include govuk-focus-outline;
        }
      `

      const { css } = await compileSassString(sass);

      expect(css).toContain(outdent`
        .app-component:focus {
          outline: 3px solid;
          outline-color: var(--govuk-focus-colour, #ffdd00);
        }
      `)
    })
    it('uses a custom property to set the transparent style', async () =>{
      const sass = `
        @use 'helpers/focused' as *;

        .app-component:focus {
          @include govuk-focus-outline(transparent);
        }
      `

      const { css } = await compileSassString(sass);

      expect(css).toContain(outdent`
        .app-component:focus {
          outline: 3px solid;
          --_govuk-outline-colour: transparent;
          outline-color: var(--_govuk-outline-colour);
        }
      `)
    })
  })
})
