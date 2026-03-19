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

  @use "helpers/spacing" as *;`

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
