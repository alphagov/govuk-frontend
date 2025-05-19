const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

const sassBootstrap = `
  $spacing-point: 2;

  @use "helpers/spacing" as * with (
    $govuk-breakpoints: (
      my_breakpoint: 30em
    ),
    $govuk-spacing-points: (
      0: 0,
      2: 15px
    ),
    $govuk-spacing-responsive-scale: (
      2: (
        null: 15px,
        my_breakpoint: 25px
      )
    )
  );
`

describe('@function govuk-spacing', () => {
  it('returns CSS for a property based on the given spacing point', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        top: govuk-spacing($spacing-point)
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          top: 15px;
        }
      `
    })
  })

  it('returns CSS for a property based on a negative spacing point', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        top: govuk-spacing(-2)
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          top: -15px;
        }
      `
    })
  })

  it('throws an error when passed anything other than a number', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        top: govuk-spacing('margin')
      }
    `

    await expect(compileSassString(sass)).rejects.toThrow(
      'Expected a number (integer), but got a string.'
    )
  })

  it('throws an error when passed a non-existent point', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        top: govuk-spacing(999)
      }
    `

    await expect(compileSassString(sass)).rejects.toThrow(
      'Unknown spacing variable `999`. Make sure you are using a point from the spacing scale in `_settings/spacing.scss`.'
    )
  })

  it('throws an error when passed a non-existent negative point', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        top: govuk-spacing(-999)
      }
    `

    await expect(compileSassString(sass)).rejects.toThrow(
      'Unknown spacing variable `999`. Make sure you are using a point from the spacing scale in `_settings/spacing.scss`.'
    )
  })

  it('handles negative zero', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        top: govuk-spacing(-0)
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          top: 0;
        }
      `
    })
  })
})

describe('@mixin govuk-responsive-spacing', () => {
  it('outputs CSS for a property based on the given spacing map', async () => {
    const sass = `
      ${sassBootstrap}

      // Use legacy import for private members
      @import "helpers/spacing";

      .foo {
        @include govuk-responsive-spacing($spacing-point, 'margin')
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          margin: 15px;
        }
        @media (min-width: 30em) {
          .foo {
            margin: 25px;
          }
        }
      `
    })
  })

  it('outputs CSS for a property and direction based on the spacing map', async () => {
    const sass = `
      ${sassBootstrap}

      // Use legacy import for private members
      @import "helpers/spacing";

      .foo {
        @include govuk-responsive-spacing($spacing-point, 'padding', 'top');
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          padding-top: 15px;
        }
        @media (min-width: 30em) {
          .foo {
            padding-top: 25px;
          }
        }
      `
    })
  })

  it('throws an exception when passed a non-existent point', async () => {
    const sass = `
      ${sassBootstrap}

      // Use legacy import for private members
      @import "helpers/spacing";

      .foo {
        @include govuk-responsive-spacing(14px, 'margin')
      }
    `

    await expect(compileSassString(sass)).rejects.toThrow(
      'Unknown spacing point `14px`. Make sure you are using a point from the responsive spacing scale in `_settings/spacing.scss`.'
    )
  })

  describe('when $important is set to true', () => {
    it('marks the rule as important for the property', async () => {
      const sass = `
        ${sassBootstrap}

        // Use legacy import for private members
        @import "helpers/spacing";

        .foo {
          @include govuk-responsive-spacing(
            $spacing-point,
            'margin',
            $important: true
          )
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .foo {
            margin: 15px !important;
          }
          @media (min-width: 30em) {
            .foo {
              margin: 25px !important;
            }
          }
        `
      })
    })

    it('marks the rule as important for the property and direction', async () => {
      const sass = `
        ${sassBootstrap}

        // Use legacy import for private members
        @import "helpers/spacing";

        .foo {
          @include govuk-responsive-spacing(
            $spacing-point,
            'margin',
            'top',
            $important: true
          )
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .foo {
            margin-top: 15px !important;
          }
          @media (min-width: 30em) {
            .foo {
              margin-top: 25px !important;
            }
          }
        `
      })
    })
  })

  describe('when an adjustment is provided', () => {
    it('adjusts the value for the property', async () => {
      const sass = `
        ${sassBootstrap}

        // Use legacy import for private members
        @import "helpers/spacing";

        .foo {
          @include govuk-responsive-spacing(
            $spacing-point,
            'margin',
            $adjustment: 2px
          )
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .foo {
            margin: 17px;
          }
          @media (min-width: 30em) {
            .foo {
              margin: 27px;
            }
          }
        `
      })
    })

    it('adjusts the value for the property and direction', async () => {
      const sass = `
        ${sassBootstrap}

        // Use legacy import for private members
        @import "helpers/spacing";

        .foo {
          @include govuk-responsive-spacing(
            $spacing-point,
            'margin',
            'top',
            $adjustment: 2px
          )
        }
      `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
          .foo {
            margin-top: 17px;
          }
          @media (min-width: 30em) {
            .foo {
              margin-top: 27px;
            }
          }
        `
      })
    })
  })
})

describe('@mixin govuk-responsive-margin', () => {
  it('outputs simple responsive margins', async () => {
    const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-margin($spacing-point)
        }
      `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          margin: 15px;
        }
        @media (min-width: 30em) {
          .foo {
            margin: 25px;
          }
        }
      `
    })
  })

  it('outputs extreme responsive margins', async () => {
    const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-margin(
            $spacing-point,
            'top',
            $important: true,
            $adjustment: 2px
          )
        }
      `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          margin-top: 17px !important;
        }
        @media (min-width: 30em) {
          .foo {
            margin-top: 27px !important;
          }
        }
      `
    })
  })
})

describe('@mixin govuk-responsive-padding', () => {
  it('outputs simple responsive padding', async () => {
    const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-padding($spacing-point)
        }
      `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          padding: 15px;
        }
        @media (min-width: 30em) {
          .foo {
            padding: 25px;
          }
        }
      `
    })
  })

  it('outputs extreme responsive padding', async () => {
    const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-padding(
            $spacing-point,
            'top',
            $important: true,
            $adjustment: 2px
          )
        }
      `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          padding-top: 17px !important;
        }
        @media (min-width: 30em) {
          .foo {
            padding-top: 27px !important;
          }
        }
      `
    })
  })
})
