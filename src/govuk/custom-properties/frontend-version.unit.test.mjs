import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('custom-properties/frontend-version', () => {
  it('outputs a custom property with the package version', async () => {
    const sass = `
      @import "custom-properties/frontend-version";
    `

    const { css } = await compileSassString(sass)

    await expect(css).toContain('--govuk-frontend-version: "development";')
  })

  it('outputs the properties only once when included multiple times', async () => {
    const sass = `
      @import "custom-properties/frontend-version";
      @import "custom-properties/frontend-version";
    `

    const { css } = await compileSassString(sass)

    const occurrences = css.matchAll(/--govuk-frontend-version/g)

    expect(Array.from(occurrences)).toHaveLength(1)
  })
})
