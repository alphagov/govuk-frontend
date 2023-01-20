const { compileSassString } = require('../../../lib/jest-helpers')

const sassConfig = {
  outputStyle: 'compressed'
}

const sassBootstrap = `
  $govuk-breakpoints: (
    mobile:  320px,
    tablet:  740px,
    desktop: 980px,
    wide:    1300px
  );
`

describe('@mixin govuk-media-query', () => {
  it('allows you to target min-width using a numeric value', async () => {
    const sass = `
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($from: 20em) {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: '@media (min-width: 20em){.foo{color:red}}'
      })
  })

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

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: '@media (min-width: 20em){.foo{color:red}}'
      })
  })

  it('allows you to target max-width using a numeric value', async () => {
    const sass = `
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($until: 20em) {
          color: red;
        }
      }
    `
    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: '@media (max-width: 20em){.foo{color:red}}'
      })
  })

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

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: '@media (max-width: 61.24em){.foo{color:red}}'
      })
  })

  it('allows you to target combined min-width and max-width using numeric values', async () => {
    const sass = `
      @import "helpers/media-queries";

      .foo {
        @include govuk-media-query($from: 20em, $until: 40em) {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: '@media (min-width: 20em) and (max-width: 40em){.foo{color:red}}'
      })
  })

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

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: '@media (min-width: 20em) and (max-width: 46.24em){.foo{color:red}}'
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

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: '@media (max-width: 40em) and (orientation: landscape){.foo{color:red}}'
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

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: '@media aural and (max-width: 40em){.foo{color:red}}'
      })
  })

  describe('when compiling a rasterized stylesheet for IE8', () => {
    it('only outputs static breakpoint styles', async () => {
      const sass = `
        $govuk-is-ie8: true;

        $govuk-breakpoints: (
          mobile:  320px,
          tablet:  740px,
          desktop: 980px,
          wide:    1300px
        );

        @import "helpers/media-queries";

        .foo {
          @include govuk-media-query($until: tablet) {
            color: lawngreen;
          }
          @include govuk-media-query($from: desktop) {
              color: forestgreen;
          }
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .resolves
        .toMatchObject({
          css: '.foo{color:forestgreen}'
        })
    })

    it('does not rasterize print queries', async () => {
      const sass = `
        ${sassBootstrap}
        $govuk-is-ie8: true;

        @import "helpers/media-queries";

        .foo {
          color: blue;
          @include govuk-media-query($media-type: 'print') {
            color: red;
          }
        }
      `

      await expect(compileSassString(sass, sassConfig))
        .resolves
        .toMatchObject({
          css: '.foo{color:blue}'
        })
    })
  })
})
