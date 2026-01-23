const { compileSassString } = require('@govuk-frontend/helpers/tests')

describe('$govuk-output-custom-properties', () => {
  it('outputs core custom properties if true', async () => {
    const sass = `
      $govuk-output-custom-properties: true;
      @import "base";
    `

    const { css } = await compileSassString(sass)

    await expect(css).toContain('--govuk-')
    await expect(css).toContain('--_govuk-')
  })

  it('does not output core custom properties if false', async () => {
    const sass = `
      $govuk-output-custom-properties: false;
      @import "base";
    `

    const { css } = await compileSassString(sass)

    await expect(css).not.toContain('--govuk-breakpoint-')
    await expect(css).not.toContain('--_govuk-')
  })

  it.each(['true', 'false'])(
    'always outputs --govuk-frontend-version if setting is `%s`',
    async (state) => {
      const sass = `
      $govuk-output-custom-properties: ${state};
      @import "base";
    `

      const { css } = await compileSassString(sass)

      await expect(css).toContain('--govuk-frontend-version')
    }
  )
})
