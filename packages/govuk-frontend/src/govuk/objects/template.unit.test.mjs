import { compileSassString } from '@govuk-frontend/helpers/tests'
import { outdent } from 'outdent'

describe('.govuk-template', () => {
  describe('background colour', () => {
    it('Uses the value of the `template-background` functional colour', async () => {
      const sass = `
        $govuk-functional-colours: (
          template-background: rebeccapurple
        );
        @import "objects/template";
      `

      const { css } = await compileSassString(sass)

      expect(css).toContain(outdent`
      .govuk-template {
        background-color: var(--_govuk-template-background-colour, rebeccapurple);
      `)
    })
  })
})

describe('.govuk-template--rebranded', () => {
  describe('background colour', () => {
    it('Uses the value of the `template-background` functional colour', async () => {
      const sass = `
        $govuk-functional-colours: (
          template-background: rebeccapurple
        );
        @import "objects/template";
      `

      const { css } = await compileSassString(sass)

      expect(css).toContain(outdent`
      .govuk-template--rebranded {
        background-color: var(--_govuk-template-background-colour, rebeccapurple);
      `)
    })
  })
})
