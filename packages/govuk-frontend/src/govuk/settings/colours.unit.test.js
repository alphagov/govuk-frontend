const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { sassNull } = require('sass-embedded')

// Create a mock warn function that we can use to override the native @warn
// function, that we can make assertions about post-render.
const mockWarnFunction = jest.fn().mockReturnValue(sassNull)

const sassConfig = {
  logger: {
    warn: mockWarnFunction
  }
}

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

  it('should define websafe colours that meet contrast requirements (legacy colours)', async () => {
    const sass = `
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

    await expect(compileSassString(sass)).resolves.not.toThrow()
  })

  describe('legacy deprecation message', () => {
    it('throws a deprecation warning if the legacy palette is being used', async () => {
      const sass = `
      @import "settings/colours-organisations";
    `

      await compileSassString(sass, sassConfig)

      // Expect our mocked @warn function to have been called once with a single
      // argument, which should be the deprecation notice
      expect(mockWarnFunction).toHaveBeenCalledWith(
        'We\'ve updated the organisation colour palette. Opt in to the new colours using `$govuk-new-organisation-colours: true`. The old palette is deprecated and we\'ll remove it in the next major version. To silence this warning, update $govuk-suppressed-warnings with key: "legacy-organisation-colours"',
        expect.anything()
      )
    })

    it('does not throw a deprecation warning if the new palette is being used', async () => {
      const sass = `
      $govuk-new-organisation-colours: true;
      @import "settings/colours-organisations";
    `

      await compileSassString(sass, sassConfig)

      // Expect our mocked @warn function to have not been called
      expect(mockWarnFunction).not.toHaveBeenCalled()
    })

    it('does not throw a deprecation warning if the palette has been customised', async () => {
      const sass = `
      $govuk-colours-organisations: (
        "department-of-administrative-affairs": (
          colour: "#226623"
        )
      );
      @import "settings/colours-organisations";
    `

      await compileSassString(sass, sassConfig)

      // Expect our mocked @warn function to have not been called
      expect(mockWarnFunction).not.toHaveBeenCalled()
    })
  })
})
