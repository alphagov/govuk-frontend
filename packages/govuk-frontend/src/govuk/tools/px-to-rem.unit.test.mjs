import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('tools/px-to-rem', () => {
  it.each([
    ['16px', '1rem'],
    ['16', '1rem'],
    ['0', '0rem'],
    ['-8px', '-0.5rem'],
    ['2.4px', '0.15rem']
  ])('converts %s to %s', async (value, expected) => {
    const sass = `
      @use "tools/px-to-rem";

      :root {
        --result: #{px-to-rem.govuk-px-to-rem(${value})};
      }
    `

    const { css } = await compileSassString(sass)

    expect(css).toContain(`--result: ${expected};`)
  })
})
