import { paths } from '@govuk-frontend/config'
import { compileSassString } from '@govuk-frontend/helpers/tests'
import { slash } from '@govuk-frontend/lib/files'
import { sassNull } from 'sass-embedded'
import sassdoc from 'sassdoc'

let mockWarnFunction, sassConfig

describe('GOV.UK Frontend', () => {
  describe.each([
    [
      '@import',
      {
        default: '@import "index";',
        configuration: `
        $govuk-suppressed-warnings: ("component-scss-files");
        $govuk-functional-colours: (brand: hotpink);
        $govuk-page-width: 9876px;
        $govuk-global-styles: true;

        @import "pkg:@govuk-frontend/helpers/assets-urls";

        $govuk-font-url-function: 'fonts-url';

        @import "index";
      `
      }
    ],
    [
      '@use',
      {
        default: '@use "index";',
        configuration: `
        @use "sass:meta";
        @use "pkg:@govuk-frontend/helpers/assets-urls";

        @use "index" with (
          $govuk-suppressed-warnings: ("component-scss-files"),
          $govuk-functional-colours: (brand: hotpink),
          $govuk-page-width: 9876px,
          $govuk-global-styles: true,
          $govuk-font-url-function: meta.get-function("fonts-url", $module: "assets-urls")
        );
      `
      }
    ]
  ])('with %s', (type, fixtures) => {
    it('compiles without deprecation warnings', async () => {
      // Create a mock warn function that we can use to override the native @warn
      // function, that we can make assertions about post-render.
      mockWarnFunction = jest.fn().mockReturnValue(sassNull)

      sassConfig = {
        logger: {
          warn: mockWarnFunction
        }
      }

      await compileSassString(fixtures.default, sassConfig)

      // Expect our mocked @warn function to have not been called
      expect(mockWarnFunction).not.toHaveBeenCalled()
    })

    describe('configuration', () => {
      let css

      beforeAll(async () => {
        const result = await compileSassString(fixtures.configuration)
        css = result.css
      })

      it('applies boolean config settings', () => {
        // `$govuk-global-styles: true` enables global link selectors
        expect(css).toEqual(expect.stringContaining('a, .govuk-link {'))
      })

      it('applies map config settings', () => {
        // The `brand` functional colour flows through `govuk-colour()` calls
        // (e.g. in the link styles)
        expect(css).toEqual(expect.stringContaining('hotpink'))
      })

      it('applies number config settings', () => {
        // `$govuk-page-width` flows through the width container
        expect(css).toEqual(expect.stringContaining('9876px'))
      })

      it('applies function config settings', () => {
        // `@font-face` declarations call `govuk-font-url` which delegates to
        // the configured function
        expect(css).toEqual(expect.stringContaining('url("example.woff")'))
      })
    })
  })

  describe('global styles', () => {
    it('are disabled by default', async () => {
      const sass = `
        @import "index";
      `
      const results = compileSassString(sass)

      await expect(results).resolves.toMatchObject({
        css: expect.not.stringContaining('a, .govuk-link {')
      })

      await expect(results).resolves.toMatchObject({
        css: expect.not.stringContaining('p, .govuk-body, .govuk-body-m {')
      })
    })

    it('are enabled if $global-styles variable is set to true', async () => {
      const sass = `
        $govuk-global-styles: true;
        @import "index";
      `

      const results = compileSassString(sass)

      await expect(results).resolves.toMatchObject({
        css: expect.stringContaining('a, .govuk-link {')
      })

      await expect(results).resolves.toMatchObject({
        css: expect.stringContaining('p, .govuk-body, .govuk-body-m {')
      })
    })
  })

  // Sass functions will be automatically evaluated at compile time and the
  // return value from the function will be used in the compiled CSS.
  //
  // However, CSS has native 'function'-esque syntax as well
  // (e.g. `background-image: url(...)`) and so if you call a non-existent
  // function then Sass will just include it as part of your CSS. This means if
  // you rename a function, or accidentally include a typo in the function name,
  // these function calls can end up in the compiled CSS.
  //
  // Example:
  //
  //   @function govuk-double($number) {
  //     @return $number * 2;
  //   }
  //
  //   .my-class {
  //     height: govuk-double(10px);
  //     width: govuk-duoble(10px);
  //   }
  //
  // Rather than throwing an error, the compiled CSS would look like:
  //
  //   .my-class {
  //     height: 20px;
  //     width: govuk-duoble(10px); // intentional typo
  //   }
  //
  // This test attempts to match anything that looks like a function call within
  // the compiled CSS - if it finds anything, it will result in the test
  // failing.
  it('does not contain any unexpected govuk- function calls', async () => {
    const sass = '@import "index"'

    const { css } = await compileSassString(sass)
    const matches = css.matchAll(/_?govuk-[\w-]+\(.*?\)/g)

    // `matchAll` does not return an actual `Array` so we need
    // a little conversion before we can check its length
    expect(Array.from(matches)).toHaveLength(0)
  })

  describe('Sass documentation', () => {
    it('associates public Sass members with a group', async () => {
      return sassdoc
        .parse([
          `${slash(paths.package)}/src/govuk/**/*.scss`,
          `!${slash(paths.package)}/src/govuk/vendor/*.scss`
        ])
        .then((docs) =>
          docs
            .filter((doc) => doc.access !== 'private')
            .forEach((doc) => {
              return expect(doc).toMatchObject({
                // Include doc.context.name in the expected result when this fails,
                // giving you the context to be able to fix it
                context: {
                  name: doc.context.name
                },
                group: [expect.not.stringMatching('undefined')]
              })
            })
        )
    })
  })
})
