import { compileSassString } from '@govuk-frontend/helpers/tests'

describe('tools/px-to-em', () => {
  it.each([
    ['16px', undefined, '1em'],
    ['16', undefined, '1em'],
    ['0', undefined, '0em'],
    ['-8px', undefined, '-0.5em'],
    ['2.4px', undefined, '0.15em'],
    ['24px', '12px', '2em'],
    ['24px', '12', '2em']
  ])('converts %s with context %s to %s', async (value, context, expected) => {
    const args = context ? `${value}, ${context}` : value
    const sass = `
      @use "tools/px-to-em";

      :root {
        --result: #{px-to-em.govuk-em(${args})};
      }
    `

    const { css } = await compileSassString(sass)

    expect(css).toContain(`--result: ${expected};`)
  })
})
