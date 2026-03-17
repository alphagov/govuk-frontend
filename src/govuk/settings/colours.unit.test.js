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

const allVariants = [
  'primary',
  'tint-25',
  'tint-50',
  'tint-80',
  'tint-95',
  'shade-25',
  'shade-50'
]

describe('Colour palette', () => {
  it.each([
    ['blue', [...allVariants, 'shade-10']],
    ['green', allVariants],
    ['teal', [...allVariants, 'accent']],
    ['purple', allVariants],
    ['magenta', allVariants],
    ['red', allVariants],
    ['orange', allVariants],
    ['yellow', allVariants],
    ['brown', ['primary', 'tint-25', 'tint-50', 'tint-95']],
    ['black', ['primary', 'tint-25', 'tint-50', 'tint-80', 'tint-95']]
  ])('Provides expected variants for `%s`', async (colour, variants) => {
    const sass = `
      @use "sass:map";
      @use "settings/colours-palette--internal" as *;

      $variants: map.keys(map.get($govuk-palette, "#{${colour}}"));

      :root {
        variants: $variants;
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        :root {
          variants: ${variants.map((v) => `"${v}"`).join(', ')};
        }
      `
    })
  })

  it.each(['white'])('Provides a colour for `%s`', async (colour) => {
    const sass = `
      @use "sass:map";
      @use "sass:meta";
      @use "settings/colours-palette--internal" as *;

      :root {
        type: meta.type-of(map.get($govuk-palette, "#{${colour}}"));
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        :root {
          type: color;
        }
      `
    })
  })
})

describe('Functional colours', () => {
  describe('colours-applied', () => {
    it('outputs a warning the old applied colours file is imported', async () => {
      const sass = `
        @import "settings/colours-applied";
      `

      await compileSassString(sass, sassConfig)

      // Expect our mocked @warn function to have been called once with a single
      // argument, which should be the deprecation notice
      expect(mockWarnFunction).toHaveBeenCalledWith(
        "The '_colours-applied' file is deprecated. Please import '_colours-functional' instead." +
          ' See https://github.com/alphagov/govuk-frontend/releases/tag/v6.0.0 for more details.' +
          ' To silence this warning, update $govuk-suppressed-warnings with key: "colours-applied"',
        expect.anything()
      )
    })

    it('is not available for `@use`', async () => {
      const sass = `
        @use "settings/colours-applied";
      `

      expect(compileSassString(sass, sassConfig)).rejects.toThrow(
        "Error: Can't find stylesheet to import."
      )
    })
  })

  it('should allow people to define custom colours before `@import`', async () => {
    const sass = `
      @use "sass:map";
      $govuk-functional-colours: (text: rebeccapurple);
      @import "settings/colours-functional";

      :root {
        value: map.get($govuk-functional-colours, text);
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        :root {
          value: rebeccapurple;
        }
      `
    })
  })
  it('should allow people to define custom colours with `@use`', async () => {
    const sass = `
      @use "sass:map";
      @use "settings/colours-functional" with (
        $govuk-functional-colours: (text: rebeccapurple)
      );

      :root {
        value: map.get(colours-functional.$govuk-functional-colours, text);
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        :root {
          value: rebeccapurple;
        }
      `
    })
  })

  it('prevents people from adding new colours to the functional colours', async () => {
    const sass = `
      @use "settings/colours-functional" with (
        $govuk-functional-colours: (non-existing-colour: rebeccapurple)
      );
    `

    await expect(compileSassString(sass)).rejects.toThrow(
      'Unknown colour `non-existing-colour`' // partial string match
    )
  })

  describe('legacy variables', () => {
    describe.each([
      'brand',
      'text',
      'template-background',
      'body-background',
      'print-text',
      'secondary-text',
      'focus',
      'focus-text',
      'error',
      'success',
      'border',
      'input-border',
      'link',
      'link-visited',
      'link-hover',
      'link-active'
    ])('$govuk-%s-colour', (functionalColourName) => {
      it('sets a Sass variable with the functional colour value', async () => {
        const sass = `
          @import "settings/colours-functional";

          :root {
            result: $govuk-${functionalColourName}-colour == govuk-functional-colour(${functionalColourName});
          }
        `

        const { css } = await compileSassString(sass, sassConfig)

        expect(css).toContain(`result: true;`)
      })
    })
  })
})

describe('Organisation colours', () => {
  it('should define contrast-safe colours that meet contrast requirements', async () => {
    const sass = `
      @use "sass:map";
      @use "settings/colours-palette--internal" as *;
      @use "settings/colours-organisations" as *;
      @use "settings/colours-functional" as *;
      @import "helpers/colour";

      @import "sass-color-helpers/stylesheets/color-helpers";

      $minimum-contrast: 4.5;
      $body-background-colour: _govuk-resolve-colour(map.get($govuk-functional-colours, body-background));

      @each $organisation in map.keys($govuk-colours-organisations) {

        $colour: govuk-organisation-colour($organisation);
        $contrast: ch-color-contrast($body-background-colour, $colour);

        @if ($contrast < $minimum-contrast) {
          @error "Contrast ratio for #{$organisation} too low."
          + " #{$colour} on #{$body-background-colour} has a contrast of: #{$contrast}."
          + " Must be higher than #{$minimum-contrast} for WCAG AA support.";
        }
      }
    `

    // sass-color-helpers relies on global builtins which would trigger a
    // deprecation that breaks the compilation. As the settings are thoroughly
    // tested by other of our tests, we'll silence the deprecations here
    // waiting for us to replace the function
    await expect(compileSassString(sass, { quietDeps: true })).resolves
  })
})
