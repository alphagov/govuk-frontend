const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

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
    ['blue', allVariants],
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
      @import "settings/colours-palette";

      $variants: map-keys(map-get($_govuk-palette, "#{${colour}}"));

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
      @import "settings/colours-palette";

      :root {
        type: type-of(map-get($_govuk-palette, "#{${colour}}"));
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

describe('Organisation colours', () => {
  it('should define contrast-safe colours that meet contrast requirements', async () => {
    const sass = `
      $govuk-new-organisation-colours: true;
      $govuk-suppressed-warnings: ("organisation-colours");

      @import "settings/colours-palette";
      @import "settings/colours-organisations";
      @import "settings/colours-applied";
      @import "helpers/colour";

      @import "sass-color-helpers/stylesheets/color-helpers";

      $minimum-contrast: 4.5;

      @each $organisation in map-keys($govuk-colours-organisations) {

        $colour: govuk-organisation-colour($organisation);
        $contrast: ch-color-contrast($govuk-body-background-colour, $colour);

        @if ($contrast < $minimum-contrast) {
          @error "Contrast ratio for #{$organisation} too low."
          + " #{$colour} on #{$govuk-body-background-colour} has a contrast of: #{$contrast}."
          + " Must be higher than #{$minimum-contrast} for WCAG AA support.";
        }
      }
    `

    await expect(compileSassString(sass)).resolves
  })
})
