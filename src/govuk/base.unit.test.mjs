import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('_base.scss', () => {
  it('outputs the custom properties when imported', async () => {
    const sass = `
      @import "base";
    `

    const { css } = await compileSassString(sass)

    expect(css).toContain('--govuk-frontend-version')
    expect(css).toContain('--govuk-breakpoint-mobile')
    expect(css).toContain('--govuk-brand-colour')
  })
})
