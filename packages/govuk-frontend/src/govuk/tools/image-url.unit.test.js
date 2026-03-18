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

describe('@function image-url', () => {
  it('by default concatenates the image path and the filename', async () => {
    const sass = `
      @use "settings/assets" with (
        $govuk-images-path: '/path/to/images/'
      );
      @use "tools/image-url";

      .foo {
        background-image: image-url.govuk-image-url("baz.png");
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          background-image: url("/path/to/images/baz.png");
        }
      `
    })
  })

  describe('$govuk-image-url-function', () => {
    describe('as a string (@import only)', () => {
      it('executes a native Sass function', async () => {
        const sass = `
          @import "tools/image-url";

          $govuk-image-url-function: 'to-upper-case';

          .foo {
            background-image: govuk-image-url("baz.png");
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
            .foo {
              background-image: "BAZ.PNG";
            }
          `
        })
      })

      it('executes a custom function', async () => {
        const sass = `
          @import "tools/image-url";

          @function custom-url-handler($filename) {
            @return url("/custom/#{$filename}");
          }

          $govuk-images-path: '/assets/fonts/';
          $govuk-image-url-function: 'custom-url-handler';

          .foo {
            background-image: govuk-image-url("baz.png");
          }
        `

        await expect(compileSassString(sass)).resolves.toMatchObject({
          css: outdent`
            .foo {
              background-image: url("/custom/baz.png");
            }
          `
        })
      })

      it('uses the default if the function does not exist', async () => {
        const sass = `
        @import "tools/image-url";

        $govuk-images-path: '/path/to/images/';
        $govuk-image-url-function: unknown-function;

        .foo {
          background-image: govuk-image-url("baz.png");
        }
      `

        await expect(compileSassString(sass)).resolves.toMatchObject({
          css: outdent`
          .foo {
            background-image: url("/path/to/images/baz.png");
          }
        `
        })
      })

      it('emits deprecation message when using `@import`', async () => {
        const sass = `
          @import "settings/assets";
          @import "tools/image-url";

          @function custom-url-handler($filename) {
            @return url("/custom/#{$filename}");
          }

          $govuk-images-path: '/assets/images/';
          $govuk-image-url-function: 'custom-url-handler';

          .foo {
            background-image: govuk-image-url("baz.png");
          }
        `

        await compileSassString(sass, sassConfig)

        expect(mockWarnFunction).toHaveBeenCalledWith(
          'Passing a string to $govuk-image-url-function is deprecated. ' +
            'Pass a function using meta.get-function(...) instead. ' +
            'To silence this warning, update $govuk-suppressed-warnings ' +
            'with key: "image-url-string"',
          expect.anything()
        )
      })
    })

    it('emits deprecation message when using @use', async () => {
      const sass = `
        @use "settings/assets" with (
          $govuk-images-path: '/path/to/images/',
          $govuk-image-url-function: 'some-string'
        );
        @use "tools/image-url";

        .foo {
          background-image: image-url.govuk-image-url("baz.png");
        }
      `

      await compileSassString(sass, sassConfig)

      expect(mockWarnFunction).toHaveBeenCalledWith(
        'Passing a string to $govuk-image-url-function is deprecated. ' +
          'Pass a function using meta.get-function(...) instead. ' +
          'To silence this warning, update $govuk-suppressed-warnings ' +
          'with key: "image-url-string"',
        expect.anything()
      )
    })
  })
})
