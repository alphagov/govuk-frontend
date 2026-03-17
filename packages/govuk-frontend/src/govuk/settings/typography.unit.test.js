const { compileSassString } = require('@govuk-frontend/helpers/tests')

describe('$govuk-include-default-font-face', () => {
  it('is true if $govuk-font-family is default', async () => {
    const sass = `
      @use "settings/typography-font" as *;
      :root {
        --result: #{$govuk-include-default-font-face}
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: expect.stringContaining('--result: true')
    })
  })

  it('is true if $govuk-font-family includes GDS Transport', async () => {
    const sass = `
      @use "settings/typography-font" as * with (
        $govuk-font-family: ("GDS Transport", "Comic Sans MS", "Comic Sans", cursive)
      );
      :root {
        --result: #{$govuk-include-default-font-face}
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: expect.stringContaining('--result: true')
    })
  })

  it('is false if $govuk-font-family does not include GDS Transport', async () => {
    const sass = `
      @use "settings/typography-font" as * with (
        $govuk-font-family: ("Comic Sans MS", "Comic Sans", cursive)
      );
      :root {
        --result: #{$govuk-include-default-font-face}
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: expect.stringContaining('--result: false')
    })
  })
})
