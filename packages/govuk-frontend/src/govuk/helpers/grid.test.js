const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('grid system', () => {
  const sassImports = `
    @import "settings/media-queries";
    @import "settings/spacing";
    @import "settings/measurements";

    @import "helpers/grid";
    @import "helpers/media-queries";

    @import "tools/exports";
  `

  describe('govuk-grid-width function', () => {
    it('outputs the specified key value from the map of widths', async () => {
      const sass = `
        ${sassImports}

        .foo {
          content: govuk-grid-width(one-quarter);
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .foo {
            content: 25%;
          }
        `
      })
    })

    it('throws an error that the specified key does not exist in the map of widths', async () => {
      const sass = `
        ${sassImports}

        $value: govuk-grid-width(seven-fifths);
        `

      await expect(compileSassString(sass)).rejects.toThrow(
        'Unknown grid width `seven-fifths`'
      )
    })
  })

  describe('@govuk-grid-column mixin', () => {
    it('outputs the CSS required for a column in the grid', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-full {
          @include govuk-grid-column();
        }
        `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .govuk-grid-column-full {
            box-sizing: border-box;
            width: 100%;
            padding: 0 15px;
          }
          @media (min-width: 40.0625em) {
            .govuk-grid-column-full {
              width: 100%;
              float: left;
            }
          }
        `
      })
    })

    it('allows different widths to be specified using $width', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-two-thirds {
          @include govuk-grid-column(two-thirds);
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .govuk-grid-column-two-thirds {
            box-sizing: border-box;
            width: 100%;
            padding: 0 15px;
          }
          @media (min-width: 40.0625em) {
            .govuk-grid-column-two-thirds {
              width: 66.6666666667%;
              float: left;
            }
          }
        `
      })
    })

    it('allows predefined breakpoints to be specified using $at', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-one-quarter-at-desktop {
          @include govuk-grid-column(one-quarter, $at: desktop);
        }
      `
      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .govuk-grid-column-one-quarter-at-desktop {
            box-sizing: border-box;
            padding: 0 15px;
          }
          @media (min-width: 48.0625em) {
            .govuk-grid-column-one-quarter-at-desktop {
              width: 25%;
              float: left;
            }
          }
        `
      })
    })

    it('allows custom breakpoints to be specified using $at', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-one-quarter-at-500px {
          @include govuk-grid-column(one-quarter, $at: 500px);
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .govuk-grid-column-one-quarter-at-500px {
            box-sizing: border-box;
            width: 100%;
            padding: 0 15px;
          }
          @media (min-width: 31.25em) {
            .govuk-grid-column-one-quarter-at-500px {
              width: 25%;
              float: left;
            }
          }
        `
      })
    })

    it('allows columns to float right using $float: right', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-one-half-right {
          @include govuk-grid-column(one-half, $float: right);
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .govuk-grid-column-one-half-right {
            box-sizing: border-box;
            width: 100%;
            padding: 0 15px;
          }
          @media (min-width: 40.0625em) {
            .govuk-grid-column-one-half-right {
              width: 50%;
              float: right;
            }
          }
        `
      })
    })
  })
})
