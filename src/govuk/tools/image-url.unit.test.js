const { deprecationOptions } = require('@govuk-frontend/config/sass')
const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')
const { NodePackageImporter } = require('sass-embedded')

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
