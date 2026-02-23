const { deprecationOptions } = require('@govuk-frontend/config/sass')
const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('@function image-url', () => {
  it('by default concatenates the image path and the filename', async () => {
    const sass = `
      @import "tools/image-url";

      $govuk-images-path: '/path/to/images/';

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
    })
  })
})
