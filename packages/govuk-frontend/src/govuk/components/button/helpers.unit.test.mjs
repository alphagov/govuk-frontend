import { compileSassString } from '@govuk-frontend/helpers/tests'
import { outdent } from 'outdent'

describe('button/_helpers', () => {
  describe('@mixin govuk-button-style', () => {
    it('Applies the appropriate variant custom properties to the button custom properties', async () => {
      const sass = `
        @use "components/button/helpers" as *;

        .app-component {
          @include govuk-button-style(warning);
        }
      `

      const { css } = await compileSassString(sass)

      expect(css).toEqual(outdent`
        .app-component {
          --_govuk-button-background-colour: var(--_govuk-warning-button-background-colour);
          --_govuk-button-shadow-colour: var(--_govuk-warning-button-shadow-colour);
          --_govuk-button-text-colour: var(--_govuk-warning-button-text-colour);
          --_govuk-button-hover-background-colour: var(--_govuk-warning-button-hover-background-colour);
        }
      `)
    })

    it('Throws an error if the variant does not exist', () => {
      const sass = `
        @use "components/button/helpers" as *;

        .app-component {
          @include govuk-button-style(unknown-button-variant);
        }
      `

      expect(compileSassString(sass)).rejects.toThrow(
        'Unknown button variant `unknown-button-variant` (available variants: secondary, warning, inverse)'
      )
    })
  })
})
