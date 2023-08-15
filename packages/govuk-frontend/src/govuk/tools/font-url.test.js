const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('@function font-url', () => {
  it('by default concatenates the font path and the filename', async () => {
    const sass = `
      @import "tools/font-url";

      $govuk-fonts-path: '/path/to/fonts/';

      @font-face {
        font-family: "whatever";
        src: govuk-font-url("whatever.woff2");
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @font-face {
          font-family: "whatever";
          src: url("/path/to/fonts/whatever.woff2");
        }
      `
    })
  })

  it('can be overridden to use a defined Sass function', async () => {
    const sass = `
      @import "tools/font-url";

      $govuk-fonts-path: '/path/to/fonts/';
      $govuk-font-url-function: 'to-upper-case';

      @font-face {
        font-family: "whatever";
        src: govuk-font-url("whatever.woff2");
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @font-face {
          font-family: "whatever";
          src: "WHATEVER.WOFF2";
        }
      `
    })
  })

  it('can be overridden to use a custom function', async () => {
    const sass = `
      @import "tools/font-url";

      @function custom-url-handler($filename) {
        @return url("/custom/#{$filename}");
      }

      $govuk-fonts-path: '/assets/fonts/';
      $govuk-font-url-function: 'custom-url-handler';

      @font-face {
        font-family: "whatever";
        src: govuk-font-url("whatever.woff2");
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @font-face {
          font-family: "whatever";
          src: url("/custom/whatever.woff2");
        }
      `
    })
  })
})
