const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

const sassBootstrap = `
  $app-breakpoints: (
    mobile:  320px,
    tablet:  740px,
    desktop: 980px,
    wide:    1300px
  );
`

describe('@mixin govuk-media-query', () => {
  it('allows you to target min-width using a numeric value', async () => {
    const sass = `
      @use "helpers/media-queries" as *;

      .foo {
        @include govuk-media-query($from: 20em) {
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

  it('allows you to target min-width using a predefined breakpoint', async () => {
    const sass = `
      ${sassBootstrap}

      @use "helpers/media-queries" as * with (
        $govuk-breakpoints: $app-breakpoints
      );

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

  it('allows you to target max-width using a numeric value', async () => {
    const sass = `
      @use "helpers/media-queries" as *;

      .foo {
        @include govuk-media-query($until: 20em) {
          color: red;
        }
      }
    `
    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @media (max-width: 20em) {
          .foo {
            color: red;
          }
        }
      `
    })
  })

  it('allows you to target max-width using a predefined breakpoint', async () => {
    const sass = `
      ${sassBootstrap}

      @use "helpers/media-queries" as * with (
        $govuk-breakpoints: $app-breakpoints
      );

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

  it('allows you to target combined min-width and max-width using numeric values', async () => {
    const sass = `
      @use "helpers/media-queries" as *;

      .foo {
        @include govuk-media-query($from: 20em, $until: 40em) {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: outdent`
        @media (min-width: 20em) and (max-width: 40em) {
          .foo {
            color: red;
          }
        }
      `
    })
  })

  it('allows you to target combined min-width and max-width using predefined breakpoints', async () => {
    const sass = `
      ${sassBootstrap}

      @use "helpers/media-queries" as * with (
        $govuk-breakpoints: $app-breakpoints
      );

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
      @use "helpers/media-queries" as *;

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
      @use "helpers/media-queries" as *;

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
})

describe('Active breakpoint', () => {
  const expectedSass = outdent`
    @charset \"UTF-8\";
    body::before {
      background-color: #FCF8E3;
      border-bottom: 1px solid #FBEED5;
      border-left: 1px solid #FBEED5;
      color: #C09853;
      font: small-caption;
      padding: 3px 6px;
      pointer-events: none;
      position: fixed;
      right: 0;
      top: 0;
      z-index: 100;
    }
    @media (min-width: 20em) {
      body::before {
        content: \"mobile ≥ 320px (20em)\";
      }
    }
    @media (min-width: 46.25em) {
      body::before {
        content: \"tablet ≥ 740px (46.25em)\";
      }
    }
    @media (min-width: 61.25em) {
      body::before {
        content: \"desktop ≥ 980px (61.25em)\";
      }
    }
    @media (min-width: 81.25em) {
      body::before {
        content: \"wide ≥ 1300px (81.25em)\";
      }
    }
  `

  it('hides active breakpoint by default', async () => {
    const sass = `
      @use "helpers/media-queries" as *;
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: ''
    })
  })

  it('hides active breakpoint if $govuk-breakpoints variable is set', async () => {
    const sass = `
      ${sassBootstrap}

      @use "helpers/media-queries" as * with (
        $govuk-breakpoints: $app-breakpoints
      );
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: ''
    })
  })

  it('hides active breakpoint if $govuk-show-breakpoints variable is set to false', async () => {
    const sass = `
      ${sassBootstrap}

      @use "helpers/media-queries" as * with (
        $govuk-breakpoints: $app-breakpoints,
        $govuk-show-breakpoints: false
      );
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: ''
    })
  })

  it('shows active breakpoint if $govuk-show-breakpoints variable is set to true', async () => {
    const sass = `
      ${sassBootstrap}

      @use "helpers/media-queries" as * with (
        $govuk-breakpoints: $app-breakpoints,
        $govuk-show-breakpoints: true
      );
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: expectedSass
    })
  })

  it('adds active breakpoint styles only once using @import', async () => {
    const sass = `
      ${sassBootstrap}

      $govuk-breakpoints: $app-breakpoints;
      $govuk-show-breakpoints: true;

      @import "helpers/media-queries";
      @import "helpers/media-queries";
      @import "helpers/media-queries";
      @import "helpers/media-queries";
    `

    await expect(compileSassString(sass)).resolves.toMatchObject({
      css: expectedSass
    })
  })
})
