import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('GOV.UK Frontend custom properties', () => {
  it('outputs a custom property with the package version', async () => {
    const sass = `
      @import "base";
      @import "core/govuk-frontend-properties";
    `

    const { css } = await compileSassString(sass)

    await expect(css).toContain('--govuk-frontend-version: "development";')
  })

  it('does not output custom properties more than once when included multiple times', async () => {
    const sass = `
      @import "base";
      @import "core/govuk-frontend-properties";
      @import "core/govuk-frontend-properties";
    `

    const { css } = await compileSassString(sass)
    const rootOccurrences = css.matchAll(/--govuk-frontend-version/g)

    expect(Array.from(rootOccurrences)).toHaveLength(1)
  })

  describe('breakpoints', () => {
    it('outputs one custom property for each breakpoint', async () => {
      const sass = `
        $govuk-breakpoints: (
          mobile: 320px,
          desktop: 760px,
        );
        @import "base";
        @import "core/govuk-frontend-properties";
      `

      const { css } = await compileSassString(sass)

      await expect(css).toContain('--govuk-breakpoint-mobile: 20rem;')
      await expect(css).toContain('--govuk-breakpoint-desktop: 47.5rem;')
    })
  })

  describe('applied colours', () => {
    it('outputs one custom property for each applied colour', async () => {
      const sass = `
        @import "base";
        $govuk-applied-colours: (
          brand: govuk-colour('blue'),
          text: govuk-colour('black')
        );

        @import "core/govuk-frontend-properties";
      `

      const { css } = await compileSassString(sass)

      await expect(css).toContain('--_govuk-colour-brand: #1d70b8;')
      await expect(css).toContain('--_govuk-colour-text: #0b0c0c;')
    })
  })
})
