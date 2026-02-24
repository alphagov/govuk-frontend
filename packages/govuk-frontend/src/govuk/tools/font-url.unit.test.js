const { deprecationOptions } = require('@govuk-frontend/config/sass')
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

  describe('$govuk-font-url-function', () => {
    describe('as a string', () => {
      it('executes a native Sass function', async () => {
        const sass = `
          @import "tools/font-url";

          $govuk-fonts-path: '/path/to/fonts/';
          $govuk-font-url-function: 'to-upper-case';

          @font-face {
            font-family: "whatever";
            src: govuk-font-url("whatever.woff2");
          }
        `

        // Until we only support Sass modules, users can pass the name of a native Sass function
        // so we'll remove `global-builtin` from the fatalDeprecations temprarily
        const fatalDeprecations = deprecationOptions.fatalDeprecations.filter(
          (deprecationId) => deprecationId !== 'global-builtin'
        )

        await expect(
          compileSassString(sass, { fatalDeprecations })
        ).resolves.toMatchObject({
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

      it('uses the default if the function does not exist', async () => {
        const sass = `
          @import "tools/font-url";

          $govuk-fonts-path: '/path/to/fonts/';
          $govuk-font-url-function: unknown-function;

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
    })

    describe('as a function', () => {
      it('executes a native Sass function', async () => {
        const sass = `
          @use "sass:meta";
          @use "sass:string";
          @import "tools/font-url";

          $govuk-fonts-path: '/path/to/fonts/';
          $govuk-font-url-function: meta.get-function(to-upper-case, $module: string);

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
          @use "sass:meta";
          @import "tools/font-url";

          @function custom-url-handler($filename) {
            @return url("/custom/#{$filename}");
          }

          $govuk-fonts-path: '/assets/fonts/';
          $govuk-font-url-function: meta.get-function('custom-url-handler');

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
  })
})
