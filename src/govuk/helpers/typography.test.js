/* eslint-env jest */

const outdent = require('outdent')

const { renderSass } = require('../../../lib/jest-helpers')

const sassConfig = {
  outputStyle: 'nested'
}

const sassBootstrap = `
  $govuk-breakpoints: (
    desktop: 30em
  );

  $govuk-typography-scale: (
    12: (
      null: (
        font-size: 12px,
        line-height: 15px
      ),
      print: (
        font-size: 14pt,
        line-height: 1.5
      )
    ),
    14: (
      null: (
        font-size: 12px,
        line-height: 15px
      ),
      desktop: (
        font-size: 14px,
        line-height: 20px
      )
    )
  );

  @import "base";`

describe('@mixin govuk-typography-common', () => {
  it('should output a @font-face declaration by default', async () => {
    const sass = `
    @import "settings/all";
    @import "helpers/all";
    @import "tools/ie8";

    :root {
      @include govuk-typography-common;
    }
    :root {
      @include govuk-typography-common($font-family: $govuk-font-family-tabular);
    }
    `

    const results = await renderSass({ data: sass, ...sassConfig })
    const resultsString = results.css.toString()

    expect(resultsString).toContain('@font-face')
    expect(resultsString).toContain('font-family: "GDS Transport"')
    expect(resultsString).toContain('font-family: "GDS Transport"')
  })

  it('should not output a @font-face declaration when the user has changed their font', async () => {
    const sass = `
    $govuk-font-family: Helvetica, Arial, sans-serif;
    $govuk-font-family-tabular: monospace;
    @import "settings/all";
    @import "helpers/all";

    :root {
      @include govuk-typography-common;
    }
    :root {
      @include govuk-typography-common($font-family: $govuk-font-family-tabular);
    }
    `

    const results = await renderSass({ data: sass, ...sassConfig })
    const resultsString = results.css.toString()

    expect(resultsString).not.toContain('@font-face')
    expect(resultsString).not.toContain('font-family: "GDS Transport"')
    expect(resultsString).not.toContain('font-family: "ntatabularnumbers"')
  })

  it('should not output a @font-face declaration when the user wants compatibility with GOV.UK Template', async () => {
    const sass = `
    $govuk-compatibility-govuktemplate: true;
    @import "settings/all";
    @import "helpers/all";

    :root {
      @include govuk-typography-common;
    }
    :root {
      @include govuk-typography-common($font-family: $govuk-font-family-tabular);
    }
    `

    const results = await renderSass({ data: sass, ...sassConfig })
    const resultsString = results.css.toString()

    expect(resultsString).not.toContain('@font-face')
    expect(resultsString).toContain('font-family: "nta"')
    expect(resultsString).toContain('font-family: "ntatabularnumbers"')
  })

  it('should not output a @font-face declaration when the user has turned off this feature', async () => {
    const sass = `
    $govuk-include-default-font-face: false;
    @import "settings/all";
    @import "helpers/all";

    :root {
      @include govuk-typography-common;
    }
    :root {
      @include govuk-typography-common($font-family: $govuk-font-family-tabular);
    }
    `

    const results = await renderSass({ data: sass, ...sassConfig })
    const resultsString = results.css.toString()

    expect(resultsString).not.toContain('@font-face')
    expect(resultsString).toContain('font-family: "GDS Transport"')
    expect(resultsString).toContain('font-family: "GDS Transport"')
  })

  it('should not output a @font-face declaration when the browser is IE8', async () => {
    const sass = `
    $govuk-is-ie8: true;

    @import "settings/all";
    @import "helpers/all";
    @import "tools/ie8";

    :root {
      @include govuk-typography-common;
    }
    :root {
      @include govuk-typography-common($font-family: $govuk-font-family-tabular);
    }
    `

    const results = await renderSass({ data: sass, ...sassConfig })
    const resultsString = results.css.toString()

    expect(resultsString).not.toContain('@font-face')
    expect(resultsString).toContain('font-family: "GDS Transport"')
  })
})

describe('@function _govuk-line-height', () => {
  it('preserves line-height if already unitless', async () => {
    const sass = `
      @import "helpers/typography";

      .foo {
        line-height: _govuk-line-height($line-height: 3.141, $font-size: 20px);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        line-height: 3.141; }`)
  })

  it('preserves line-height if using different units', async () => {
    const sass = `
      @import "helpers/typography";

      .foo {
        line-height: _govuk-line-height($line-height: 2em, $font-size: 20px);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        line-height: 2em; }`)
  })

  it('converts line-height to a relative number', async () => {
    const sass = `
      @import "helpers/typography";

      .foo {
        line-height: _govuk-line-height($line-height: 30px, $font-size: 20px);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        line-height: 1.5; }`)
  })
})

describe('@mixin govuk-typography-responsive', () => {
  it('outputs CSS with suitable media queries', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-typography-responsive($size: 14)
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        font-size: 12px;
        font-size: 0.75rem;
        line-height: 1.25; }
        @media (min-width: 30em) {
          .foo {
            font-size: 14px;
            font-size: 0.875rem;
            line-height: 1.42857; } }`)
  })

  it('outputs CSS with suitable media queries for print', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-typography-responsive($size: 12)
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        font-size: 12px;
        font-size: 0.75rem;
        line-height: 1.25; }
        @media print {
          .foo {
            font-size: 14pt;
            line-height: 1.5; } }`)
  })

  it('throws an exception when passed a size that is not in the scale', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-typography-responsive(3.14159265359)
      }`

    await expect(renderSass({ data: sass, ...sassConfig }))
      .rejects
      .toThrow(
        'Unknown font size `3.14159` - expected a point from the typography scale.'
      )
  })

  describe('when $important is set to true', () => {
    it('marks font size and line height as important', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive($size: 14, $important: true);
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-size: 12px !important;
          font-size: 0.75rem !important;
          line-height: 1.25 !important; }
          @media (min-width: 30em) {
            .foo {
              font-size: 14px !important;
              font-size: 0.875rem !important;
              line-height: 1.42857 !important; } }`)
    })

    it('marks font-size and line-height as important for print media', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive($size: 12, $important: true);
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-size: 12px !important;
          font-size: 0.75rem !important;
          line-height: 1.25 !important; }
          @media print {
            .foo {
              font-size: 14pt !important;
              line-height: 1.5 !important; } }`)
    })
  })

  describe('when $override-line-height is set', () => {
    it('overrides the line height', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive($size: 14, $override-line-height: 21px);
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-size: 12px;
          font-size: 0.75rem;
          line-height: 1.75; }
          @media (min-width: 30em) {
            .foo {
              font-size: 14px;
              font-size: 0.875rem;
              line-height: 1.5; } }`)
    })
  })

  describe('when $govuk-typography-use-rem is disabled', () => {
    it('outputs CSS with suitable media queries', async () => {
      const sass = `
        $govuk-typography-use-rem: false;
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive($size: 14)
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-size: 12px;
          line-height: 1.25; }
          @media (min-width: 30em) {
            .foo {
              font-size: 14px;
              line-height: 1.42857; } }`)
    })

    it('adjusts rem values based on root font size', async () => {
      const sass = `
        $govuk-typography-use-rem: false;
        $govuk-root-font-size: 10px;
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive($size: 14)
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-size: 12px;
          line-height: 1.25; }
          @media (min-width: 30em) {
            .foo {
              font-size: 14px;
              line-height: 1.42857; } }`)
    })

    describe('and $important is set to true', () => {
      it('marks font size and line height as important', async () => {
        const sass = `
          $govuk-typography-use-rem: false;
          ${sassBootstrap}

          .foo {
            @include govuk-typography-responsive($size: 14, $important: true);
          }`

        const results = await renderSass({ data: sass, ...sassConfig })

        expect(results.css.toString().trim()).toBe(outdent`
          .foo {
            font-size: 12px !important;
            line-height: 1.25 !important; }
            @media (min-width: 30em) {
              .foo {
                font-size: 14px !important;
                line-height: 1.42857 !important; } }`)
      })
    })
  })

  describe('when compatibility mode is set', () => {
    it('$govuk-typography-use-rem is disabled by default', async () => {
      const sass = `
        $govuk-compatibility-govuktemplate: true;
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive($size: 14)
        }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-size: 12px;
          line-height: 1.25; }
          @media (min-width: 30em) {
            .foo {
              font-size: 14px;
              line-height: 1.42857; } }`)
    })
  })

  describe('@mixin govuk-font', () => {
    it('outputs all required typographic CSS properties', async () => {
      const sass = `
      // Avoid font face being output in tests
      $govuk-include-default-font-face: false;
      ${sassBootstrap}

      .foo {
        @include govuk-font($size: 14)
      }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-family: "GDS Transport", arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-weight: 400;
          font-size: 12px;
          font-size: 0.75rem;
          line-height: 1.25; }
          @media print {
            .foo {
              font-family: sans-serif; } }
          @media (min-width: 30em) {
            .foo {
              font-size: 14px;
              font-size: 0.875rem;
              line-height: 1.42857; } }`)
    })

    it('enables tabular numbers opentype feature flags if $tabular: true', async () => {
      const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-font($size: 14, $tabular: true)
      }`

      const results = await renderSass({ data: sass, ...sassConfig })
      const css = results.css.toString()

      expect(css).toContain('font-feature-settings: "tnum" 1;')
      expect(css).toContain(outdent`
      ${outdent}
        @supports (font-variant-numeric: tabular-nums) {
          .foo {
            font-feature-settings: normal;
            font-variant-numeric: tabular-nums; } }`)
    })

    it('uses the tabular font instead if defined and $tabular: true', async () => {
      const sass = `
      $govuk-font-family-tabular: "ntatabularnumbers";
      ${sassBootstrap}

      .foo {
        @include govuk-font($size: 14, $tabular: true)
      }`

      const results = await renderSass({ data: sass, ...sassConfig })
      const css = results.css.toString()

      expect(css).toContain('font-family: "ntatabularnumbers"')
      expect(css).not.toContain('font-feature-settings')
    })

    it('sets font-size based on $size', async () => {
      const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-font($size: 12)
      }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString()).toContain('font-size: 12px')
      expect(results.css.toString()).not.toContain('font-size: 14px')
    })

    it('does not output font-size if $size: false', async () => {
      const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-font($size: false)
      }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString()).not.toContain('font-size')
    })

    it('sets font-weight based on $weight', async () => {
      const sass = `
      // Avoid font face being output in tests
      $govuk-include-default-font-face: false;
      ${sassBootstrap}

      .foo {
        @include govuk-font($size: 14, $weight: bold)
      }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString()).toContain('font-weight: 700')
    })

    it('does not output font-weight if $weight: false', async () => {
      const sass = `
      // Avoid font face being output in tests
      $govuk-include-default-font-face: false;
      ${sassBootstrap}

      .foo {
        @include govuk-font($size: 14, $weight: false)
      }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString()).not.toContain('font-weight')
    })

    it('ignores undefined font-weights', async () => {
      const sass = `
      // Avoid font face being output in tests
      $govuk-include-default-font-face: false;
      ${sassBootstrap}

      .foo {
        @include govuk-font($size: 14, $weight: superdupermegabold)
      }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString()).not.toContain('font-weight')
    })

    it('sets line-height based on $line-height', async () => {
      const sass = `
      // Avoid font face being output in tests
      $govuk-include-default-font-face: false;
      ${sassBootstrap}

      .foo {
        @include govuk-font($size: 14, $line-height: 1.337)
      }`

      const results = await renderSass({ data: sass, ...sassConfig })

      expect(results.css.toString()).toContain('line-height: 1.337;')
    })
  })
})
