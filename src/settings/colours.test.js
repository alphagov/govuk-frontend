/* eslint-env jest */

const util = require('util')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const configPaths = require('../../config/paths.json')

const sassConfig = {
  includePaths: [ configPaths.src, 'node_modules/' ],
  outputStyle: 'compressed'
}

describe('Organisation colours', () => {
  it('should define websafe colours that meet contrast requirements', async () => {
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
      }`

    await sassRender({ data: sass, ...sassConfig })
  })
})
