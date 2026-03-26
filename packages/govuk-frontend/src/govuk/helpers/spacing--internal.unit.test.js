const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

const sassBootstrap = `
  $spacing-point: 2;

  @use "settings" with (
    // Emulates data from _settings/media-queries.scss
    $govuk-breakpoints: (
      my_breakpoint: 30em
    ),

    // Emulates data from _settings/spacing.scss
    $govuk-spacing-points: (
      0: 0,
      2: 15px
    ),

    // Emulates data from _settings/spacing.scss
    $govuk-spacing-responsive-scale: (
      2: (
        null: 15px,
        my_breakpoint: 25px
      )
    ),
  );

  @use "helpers/spacing--internal";`

describe('@mixin responsive-spacing', () => {
  it('outputs CSS for a property based on the given spacing map', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include spacing--internal.responsive-spacing($spacing-point, 'margin')
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

      .foo {
        @include spacing--internal.responsive-spacing($spacing-point, 'padding', 'top');
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

      .foo {
        @include spacing--internal.responsive-spacing(14px, 'margin')
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

        .foo {
          @include spacing--internal.responsive-spacing(
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

        .foo {
          @include spacing--internal.responsive-spacing(
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

        .foo {
          @include spacing--internal.responsive-spacing(
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

        .foo {
          @include spacing--internal.responsive-spacing(
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
