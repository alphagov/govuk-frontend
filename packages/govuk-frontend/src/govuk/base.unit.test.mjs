import { compileSassString } from '@govuk-frontend/helpers/tests'
import { sassNull } from 'sass-embedded'

let mockWarnFunction, sassConfig

describe('_base.scss', () => {
  describe.each([
    [
      '@import',
      {
        default: '@import "base";',
        configuration: `
          $govuk-suppressed-warnings: ("component-scss-files");
          $govuk-functional-colours: (brand: hotpink);
          $govuk-page-width: 9876px;
          $govuk-global-styles: true;

          @import "pkg:@govuk-frontend/helpers/assets-urls";

          $govuk-font-url-function: 'fonts-url';
          $govuk-image-url-function: 'images-url';

          @import "base";

          :root {
            --page-width: #{$govuk-page-width};
            --global-styles: #{$govuk-global-styles};
            --brand-colour: #{govuk-functional-colour("brand")};
            --font: #{govuk-font-url("font.woff")};
            --image: #{govuk-image-url("image.svg")};
          }
        `,
        outputsCustomProperties: true
      }
    ],
    [
      '@use',
      {
        default: '@use "base";',
        configuration: `
          @use "sass:meta";
          @use "pkg:@govuk-frontend/helpers/assets-urls";

          @use "base" with (
            $govuk-suppressed-warnings: ("component-scss-files"),
            $govuk-functional-colours: (brand: hotpink),
            $govuk-page-width: 9876px,
            $govuk-global-styles: true,
            $govuk-font-url-function: meta.get-function("fonts-url", $module: "assets-urls"),
            $govuk-image-url-function: meta.get-function("images-url", $module: "assets-urls")
          );

          :root {
            --page-width: #{base.$govuk-page-width};
            --global-styles: #{base.$govuk-global-styles};
            --brand-colour: #{base.govuk-functional-colour("brand")};
            --font: #{base.govuk-font-url("font.woff")};
            --image: #{base.govuk-image-url("image.svg")};
          }
        `,
        outputsCustomProperties: false
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

    // Outputs custom props with `@import`, but not with `@use`
    it(`outputs custom properties: ${fixtures.outputsCustomProperties}`, async () => {
      const { css } = await compileSassString(fixtures.default)
      for (const prop of [
        '--govuk-frontend-version',
        '--govuk-breakpoint-mobile',
        '--govuk-brand-colour'
      ]) {
        expect(css.includes(prop)).toBe(fixtures.outputsCustomProperties)
      }
    })

    it('does not output custom properties twice when imported twice', async () => {
      const sass = `
        @import "base";
        @import "base";
      `

      const { css } = await compileSassString(sass)

      const occurrences = css.matchAll(/--govuk-breakpoint-mobile/g)

      expect(Array.from(occurrences)).toHaveLength(1)
    })

    describe('configuration', () => {
      let css

      beforeAll(async () => {
        const result = await compileSassString(fixtures.configuration)
        css = result.css
      })

      it('applies boolean config settings', () => {
        // `$govuk-global-styles: true` flows through base unchanged
        expect(css).toEqual(expect.stringContaining('--global-styles: true'))
      })

      it('applies map config settings', () => {
        // The `brand` functional colour flows through `govuk-functional-colour()`
        expect(css).toEqual(expect.stringContaining('hotpink'))
      })

      it('applies number config settings', () => {
        // `$govuk-page-width` flows through base unchanged
        expect(css).toEqual(expect.stringContaining('--page-width: 9876px'))
      })

      it('applies function config settings', () => {
        // `govuk-font-url` delegates to the configured function
        expect(css).toEqual(
          expect.stringContaining('--font: url("example.woff")') &&
            expect.stringContaining('--image: url("example.svg")')
        )
      })
    })
  })
})
