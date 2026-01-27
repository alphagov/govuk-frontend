import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('custom-properties/functional-colours', () => {
  it('outputs one custom property for each functional colour', async () => {
    const sass = `
      @import "custom-properties/functional-colours";
    `

    const { css } = await compileSassString(sass)

    await expect(css).toContain('--_govuk-brand-colour: #1d70b8;')
    await expect(css).toContain('--_govuk-text-colour: #0b0c0c;')
  })

  it('outputs the properties only once when included multiple times', async () => {
    const sass = `
      @import "custom-properties/functional-colours";
      @import "custom-properties/functional-colours";
    `

    const { css } = await compileSassString(sass)

    const occurrences = css.matchAll(/--_govuk-brand-colour/g)

    expect(Array.from(occurrences)).toHaveLength(1)
  })

  describe('$govuk-output-custom-properties', () => {
    it('outputs the properties properties if `true`', async () => {
      const sass = `
        $govuk-output-custom-properties: true;
        @import "custom-properties/functional-colours";
      `

      const { css } = await compileSassString(sass)

      await expect(css).toContain('--_govuk-brand-colour')
    })

    it('does not output core custom properties if `false`', async () => {
      const sass = `
        $govuk-output-custom-properties: false;
        @import "custom-properties/functional-colours";
      `

      const { css } = await compileSassString(sass)

      await expect(css).not.toContain('--_govuk-brand-colour')
    })
  })
})
