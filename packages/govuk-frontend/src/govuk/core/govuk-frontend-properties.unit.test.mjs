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
    // Use the `--govuk-frontend-version` property rather than `:root`
    // as `:root` may appear multiple times due to media queries in the future
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
})
