import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('custom-properties/breakpoints', () => {
  it('outputs one custom property for each breakpoint', async () => {
    const sass = `
      $govuk-breakpoints: (
        mobile: 320px,
        desktop: 760px,
      );
      @import "custom-properties/breakpoints";
    `

    const { css } = await compileSassString(sass)

    await expect(css).toContain('--govuk-breakpoint-mobile: 20rem;')
    await expect(css).toContain('--govuk-breakpoint-desktop: 47.5rem;')
  })

  it('outputs the properties only once when included multiple times', async () => {
    const sass = `
      $govuk-breakpoints: (
        mobile: 320px,
        desktop: 760px,
      );
      @import "custom-properties/breakpoints";
      @import "custom-properties/breakpoints";
    `

    const { css } = await compileSassString(sass)

    const occurrences = css.matchAll(/--govuk-breakpoint-mobile/g)

    expect(Array.from(occurrences)).toHaveLength(1)
  })

  describe('$govuk-output-custom-properties', () => {
    it('outputs the properties properties if `true`', async () => {
      const sass = `
        $govuk-output-custom-properties: true;
        @import "custom-properties/breakpoints";
      `

      const { css } = await compileSassString(sass)

      await expect(css).toContain('--govuk-breakpoint-mobile')
    })

    it('does not output core custom properties if `false`', async () => {
      const sass = `
        $govuk-output-custom-properties: false;
        @import "custom-properties/breakpoints";
      `

      const { css } = await compileSassString(sass)

      await expect(css).not.toContain('--govuk-breakpoint-mobile')
    })
  })
})
