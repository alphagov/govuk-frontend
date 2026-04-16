const { deprecationOptions } = require('@govuk-frontend/config/sass')
const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')
const { NodePackageImporter, sassNull } = require('sass-embedded')

// Create a mock warn function that we can use to override the native @warn
// function, that we can make assertions about post-render.
const mockWarnFunction = jest.fn().mockReturnValue(sassNull)

// Until we only support Sass modules, users can pass the name of a native Sass function
// so we need to remove `global-builtin` from the fatalDeprecations in some tests
const fatalDeprecations = deprecationOptions.fatalDeprecations.filter(
  (deprecationId) => deprecationId !== 'global-builtin'
)

const sassConfig = {
  logger: {
    warn: mockWarnFunction
  }
}

describe('@function image-url', () => {
  it('by default concatenates the image path and the filename', async () => {
    const sass = `
      @use "settings" with (
        $govuk-images-path: '/path/to/images/'
      );
      @use "tools/image-url" as *;

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

  describe('$govuk-image-url-function', () => {
    describe('as a string', () => {
      it('executes a native Sass function', async () => {
        const sass = `
          @use "settings" with (
            $govuk-suppressed-warnings: ("image-url-string"),
            $govuk-image-url-function: 'to-upper-case'
          );
          @use "tools/image-url" as *;

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
          compileSassString(sass, {
            fatalDeprecations,
            silenceDeprecations: ['global-builtin']
          })
        ).resolves.toMatchObject({
          css: outdent`
            .foo {
              background-image: "BAZ.PNG";
            }
          `
        })
      })

      it('uses the default for a non-native function', async () => {
        const sass = `
          @use "settings" with (
            $govuk-suppressed-warnings: ("image-url-string"),
            $govuk-images-path: '/path/to/images/',
            $govuk-image-url-function: non-native-function
          );
          @use "tools/image-url" as *;

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

      it('emits deprecation message', async () => {
        const sass = `
          @use "settings" with (
            $govuk-image-url-function: 'a-function'
          );
          @use "tools/image-url" as *;

          .foo {
            background-image: govuk-image-url("baz.png");
          }
        `

        await compileSassString(sass, { ...sassConfig, fatalDeprecations })

        expect(mockWarnFunction).toHaveBeenCalledWith(
          'Passing a string to $govuk-image-url-function is deprecated. ' +
            'Pass a function using meta.get-function(...) instead. ' +
            'To silence this warning, update $govuk-suppressed-warnings ' +
            'with key: "image-url-string"',
          expect.anything()
        )
      })
    })

    describe('with `@import`', () => {
      it('executes a custom function', async () => {
        const sass = `
          $govuk-suppressed-warnings: ("image-url-string");
          $govuk-image-url-function: 'images-url';

          @import "pkg:@govuk-frontend/helpers/assets-urls";
          @import "tools/image-url";

          .foo {
            background-image: govuk-image-url("baz.png");
          }
        `

        await expect(
          compileSassString(sass, { importers: [new NodePackageImporter()] })
        ).resolves.toMatchObject({
          css: outdent`
            .foo {
              background-image: url("example.svg");
            }
          `
        })
      })

      it('uses the default if the function does not exist', async () => {
        const sass = `
        @import "tools/image-url";

        $govuk-suppressed-warnings: ("image-url-string");
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
          $govuk-image-url-function: 'to-upper-case';
          @import "tools/image-url";

          @font-face {
            font-family: "whatever";
            src: govuk-image-url("whatever.woff2");
          }
        `

        await compileSassString(sass, { ...sassConfig, fatalDeprecations })

        expect(mockWarnFunction).toHaveBeenCalledWith(
          'Passing a string to $govuk-image-url-function is deprecated. ' +
            'Pass a function using meta.get-function(...) instead. ' +
            'To silence this warning, update $govuk-suppressed-warnings ' +
            'with key: "image-url-string"',
          expect.anything()
        )
      })
    })

    describe('as a function', () => {
      it('executes a native Sass function', async () => {
        const sass = `
          @use "sass:meta";
          @use "sass:string";
          @use "settings/assets" with (
            $govuk-images-path: '/path/to/images/',
            $govuk-image-url-function: meta.get-function('to-upper-case', $module: 'string')
          );
          @use "tools/image-url" as *;

          .foo {
            background-image: govuk-image-url("baz.png");
          }
        `

        await expect(compileSassString(sass)).resolves.toMatchObject({
          css: outdent`
            .foo {
              background-image: "BAZ.PNG";
            }
          `
        })
      })

      it('can be overridden to use a custom function', async () => {
        const sass = `
          @use "sass:meta";
          @use "pkg:@govuk-frontend/helpers/assets-urls";
          @use "settings/assets" with (
            $govuk-image-url-function: meta.get-function('images-url', $module: 'assets-urls')
          );
          @use "tools/image-url" as *;

          .foo {
            background-image: govuk-image-url("baz.png");
          }
        `

        await expect(
          compileSassString(sass, { importers: [new NodePackageImporter()] })
        ).resolves.toMatchObject({
          css: outdent`
            .foo {
              background-image: url("example.svg");
            }
          `
        })
      })
    })
  })
})
