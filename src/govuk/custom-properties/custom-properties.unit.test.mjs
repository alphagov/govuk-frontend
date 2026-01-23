import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('GOV.UK Frontend custom properties', () => {
  it('imports each set of custom properties', async () => {
    const sass = `
      @import "custom-properties";
    `

    const { css } = await compileSassString(sass)

    await expect(css).toContain('--govuk-frontend-version')
    await expect(css).toContain('--govuk-breakpoint-mobile')
    await expect(css).toContain('--_govuk-brand-colour')
  })
})
