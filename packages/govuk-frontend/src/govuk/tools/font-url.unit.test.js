const { deprecationOptions } = require('@govuk-frontend/config/sass')
const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')
const { sassNull } = require('sass-embedded')

// Create a mock warn function that we can use to override the native @warn
// function, that we can make assertions about post-render.
const mockWarnFunction = jest.fn().mockReturnValue(sassNull)

const sassConfig = {
  logger: {
    warn: mockWarnFunction
  }
}

describe('@function font-url', () => {
  beforeEach(() => {
    mockWarnFunction.mockClear()
  })

  it('by default concatenates the font path and the filename', async () => {
    const sass = `
      @use "settings/assets" with (
        $govuk-fonts-path: '/path/to/fonts/'
      );
      @use "tools/font-url";

      @font-face {
        font-family: "whatever";
        src: font-url.govuk-font-url("whatever.woff2");
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
    describe('as a string (@import only)', () => {
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

      it('emits deprecation message when using `@import`', async () => {
        const sass = `
          @import "settings/assets";
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

        await compileSassString(sass, sassConfig)

        expect(mockWarnFunction).toHaveBeenCalledWith(
          'Passing a string to $govuk-font-url-function is deprecated. ' +
            'Pass a function using meta.get-function(...) instead. ' +
            'To silence this warning, update $govuk-suppressed-warnings ' +
            'with key: "font-url-string"',
          expect.anything()
        )
      })
    })

    it('emits deprecation message when using @use', async () => {
      const sass = `
        @use "settings/assets" with (
          $govuk-fonts-path: '/path/to/fonts/',
          $govuk-font-url-function: 'some-string'
        );
        @use "tools/font-url";

        @font-face {
          font-family: "whatever";
          src: font-url.govuk-font-url("whatever.woff2");
        }
      `

      await compileSassString(sass, sassConfig)

      expect(mockWarnFunction).toHaveBeenCalledWith(
        'Passing a string to $govuk-font-url-function is deprecated. ' +
          'Pass a function using meta.get-function(...) instead. ' +
          'To silence this warning, update $govuk-suppressed-warnings ' +
          'with key: "font-url-string"',
        expect.anything()
      )
    })

    describe('as a function', () => {
      it('executes a native Sass function', async () => {
        const sass = `
          @use "sass:meta";
          @use "sass:string";
          @use "settings/assets" with (
            $govuk-fonts-path: '/path/to/fonts/',
            $govuk-font-url-function: meta.get-function('to-upper-case', $module: 'string')
          );
          @use "tools/font-url" as font-url;;

          @font-face {
            font-family: "whatever";
            src: font-url.govuk-font-url("whatever.woff2");
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
          @use "settings/assets";
          @use "tools/font-url";

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
