const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('@function line-height', () => {
  it('preserves line-height if already unitless', async () => {
    const sass = `
      @use "helpers/typography--internal";

      .foo {
        line-height: typography--internal.line-height($line-height: 3.141, $font-size: 20px);
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          line-height: 3.141;
        }
      `
    })
  })

  it('preserves line-height if using different units', async () => {
    const sass = `
      @use "helpers/typography--internal";

      .foo {
        line-height: typography--internal.line-height($line-height: 2em, $font-size: 20px);
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          line-height: 2em;
        }
      `
    })
  })

  it('converts line-height to a relative number', async () => {
    const sass = `
      @use "helpers/typography--internal";

      .foo {
        line-height: typography--internal.line-height($line-height: 30px, $font-size: 20px);
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          line-height: 1.5;
        }
      `
    })
  })
})
