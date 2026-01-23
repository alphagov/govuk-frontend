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
})
