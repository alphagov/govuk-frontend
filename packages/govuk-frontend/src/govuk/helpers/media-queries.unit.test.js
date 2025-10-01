const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

const sassBootstrap = `
  $govuk-breakpoints: (
    mobile:  320px,
    tablet:  740px,
    desktop: 980px,
    wide:    1300px
  );
`

describe('govuk-breakpoint-value', () => {
  it.each([
    ['20em', '20em'],
    ['20px', '20px'],
    ['20', '20px'],
    ['0', '0px'],
    [20, '20px']
  ])('returns value for numeric input: %s', async (value, expected) => {
    const sass = `
      @import "helpers/media-queries";

      .foo {
        width: govuk-breakpoint-value(${value});
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        .foo {
          width: ${expected};
        }
      `
    })
  })

  it.each([
    ['mobile', '320px'],
    ['tablet', '740px'],
    ['desktop', '980px'],
    ['wide', '1300px']
  ])(
    'returns px value for predefined breakpoint: %s',
    async (breakpoint, expected) => {
      const sass = `
      ${sassBootstrap}
      @import "helpers/media-queries";

      .foo {
        width: govuk-breakpoint-value(${breakpoint});
      }
    `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
        .foo {
          width: ${expected};
        }
      `
      })
    }
  )

  it('throws an error if an invalid breakpoint is used', async () => {
    const sass = `
      @import "helpers/media-queries";

      .foo {
        width: govuk-breakpoint-value('');
      }
    `

    await expect(compileSassString(sass)).rejects.toThrow(
      'Error: "Could not find a breakpoint given ``."'
    )
  })
})

describe('@mixin govuk-media-query', () => {
  it.each([
    ['20em', '20em'],
    ['20px', '1.25em'],
    ['20', '1.25em'],
    [20, '1.25em'],
    ['20rem', '20rem']
  ])(
    'allows you to target min-width using a numeric value: %s',
    async (value, expected) => {
      const sass = `
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($from: ${value}) {
          color: red;
        }
      }
    `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
        @media (min-width: ${expected}) {
          .foo {
            color: red;
          }
        }
      `
      })
    }
  )

  it('allows you to target min-width using a predefined breakpoint', async () => {
    const sass = `
      ${sassBootstrap}
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($from: mobile) {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @media (min-width: 20em) {
          .foo {
            color: red;
          }
        }
      `
    })
  })

  it.each([
    ['20em', '20em'],
    ['20px', '1.25em'],
    ['20', '1.25em'],
    [20, '1.25em'],
    ['20rem', '20rem']
  ])(
    'allows you to target max-width using a numeric value: %s',
    async (value, expected) => {
      const sass = `
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($until: ${value}) {
          color: red;
        }
      }
    `
      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
        @media (max-width: ${expected}) {
          .foo {
            color: red;
          }
        }
      `
      })
    }
  )

  it('allows you to target max-width using a predefined breakpoint', async () => {
    const sass = `
      ${sassBootstrap}
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($until: desktop) {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @media (max-width: 61.24em) {
          .foo {
            color: red;
          }
        }
      `
    })
  })

  it.each([
    ['20em', '40em', '20em', '40em'],
    ['20px', '40px', '1.25em', '2.5em'],
    [20, '40px', '1.25em', '2.5em'],
    ['20rem', '30rem', '20rem', '30rem']
  ])(
    'allows you to target combined min-width and max-width using numeric values: (%s, %s)',
    async (min, max, expectedMin, expectedMax) => {
      const sass = `
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($from: ${min}, $until: ${max}) {
          color: red;
        }
      }
    `

      await expect(compileSassString(sass)).resolves.toMatchObject({
        css: outdent`
        @media (min-width: ${expectedMin}) and (max-width: ${expectedMax}) {
          .foo {
            color: red;
          }
        }
      `
      })
    }
  )

  it('allows you to target combined min-width and max-width using predefined breakpoints', async () => {
    const sass = `
      ${sassBootstrap}
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($from: mobile, $until: tablet) {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @media (min-width: 20em) and (max-width: 46.24em) {
          .foo {
            color: red;
          }
        }
      `
    })
  })

  it('allows you to target using custom directives', async () => {
    const sass = `
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($until: 40em, $and: '(orientation: landscape)') {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @media (max-width: 40em) and (orientation: landscape) {
          .foo {
            color: red;
          }
        }
      `
    })
  })

  it('allows you to target particular media types', async () => {
    const sass = `
        @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($until: 40em, $media-type: 'aural') {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @media aural and (max-width: 40em) {
          .foo {
            color: red;
          }
        }
      `
    })
  })

  it('throws an error if an invalid breakpoint is used', async () => {
    const sass = `
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($until: '') {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass)).rejects.toThrow()
  })
})
