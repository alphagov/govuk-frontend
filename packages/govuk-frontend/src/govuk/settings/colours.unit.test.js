const { compileSassString } = require('@govuk-frontend/helpers/tests')

describe('Organisation colours', () => {
  it('should define contrast-safe colours that meet contrast requirements', async () => {
    const sass = `
      @use "sass-color-helpers/stylesheets/color-helpers" as *;

      @use "settings/colours-applied" as * with (
        $govuk-new-organisation-colours: true,
        $govuk-suppressed-warnings: ("organisation-colours")
      );

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
      @use "sass-color-helpers/stylesheets/color-helpers" as *;

      @use "settings/colours-applied" as * with (
        $govuk-suppressed-warnings: ("legacy-organisation-colours")
      );

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
})
