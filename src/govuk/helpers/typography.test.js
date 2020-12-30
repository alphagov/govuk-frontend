/* eslint-env jest */

const outdent = require('outdent')

const { renderSass } = require('../../../lib/jest-helpers')

const sassConfig = {
  outputStyle: 'nested'
}

const sassBootstrap = `
  @import "settings/compatibility";
  @import "settings/media-queries";
  @import "settings/ie8";
  @import "settings/typography-responsive";

  $moaland-breakpoints: (
    desktop: 30em
  );

  $moaland-typography-scale: (
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

  @import "helpers/media-queries";
  @import "tools/iff";
  @import "helpers/typography";`

describe('@mixin moaland-typography-common', () => {
  it('should output a @font-face declaration by default', async () => {
    const sass = `
    @import "settings/all";
    @import "helpers/all";
    @import "tools/ie8";

    :root {
      @include moaland-typography-common;
    }
    :root {
      @include moaland-typography-common($font-family: $moaland-font-family-tabular);
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
    $moaland-font-family: Helvetica, Arial, sans-serif;
    $moaland-font-family-tabular: monospace;
    @import "settings/all";
    @import "helpers/all";

    :root {
      @include moaland-typography-common;
    }
    :root {
      @include moaland-typography-common($font-family: $moaland-font-family-tabular);
    }
    `

    const results = await renderSass({ data: sass, ...sassConfig })
    const resultsString = results.css.toString()

    expect(resultsString).not.toContain('@font-face')
    expect(resultsString).not.toContain('font-family: "GDS Transport"')
    expect(resultsString).not.toContain('font-family: "ntatabularnumbers"')
  })
  it('should not output a @font-face declaration when the user wants compatibility with GOV.MOA Template', async () => {
    const sass = `
    $moaland-compatibility-govuktemplate: true;
    @import "settings/all";
    @import "helpers/all";

    :root {
      @include moaland-typography-common;
    }
    :root {
      @include moaland-typography-common($font-family: $moaland-font-family-tabular);
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
    $moaland-include-default-font-face: false;
    @import "settings/all";
    @import "helpers/all";

    :root {
      @include moaland-typography-common;
    }
    :root {
      @include moaland-typography-common($font-family: $moaland-font-family-tabular);
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
    $moaland-is-ie8: true;

    @import "settings/all";
    @import "helpers/all";
    @import "tools/ie8";

    :root {
      @include moaland-typography-common;
    }
    :root {
      @include moaland-typography-common($font-family: $moaland-font-family-tabular);
    }
    `

    const results = await renderSass({ data: sass, ...sassConfig })
    const resultsString = results.css.toString()

    expect(resultsString).not.toContain('@font-face')
    expect(resultsString).toContain('font-family: "GDS Transport"')
  })
})

describe('@function _moaland-line-height', () => {
  it('preserves line-height if already unitless', async () => {
    const sass = `
      @import "helpers/typography";

      .foo {
        line-height: _moaland-line-height($line-height: 3.141, $font-size: 20px);
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
        line-height: _moaland-line-height($line-height: 2em, $font-size: 20px);
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
        line-height: _moaland-line-height($line-height: 30px, $font-size: 20px);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        line-height: 1.5; }`)
  })
})

describe('@mixin moaland-typography-responsive', () => {
  it('outputs CSS with suitable media queries', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include moaland-typography-responsive($size: 14)
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
        @include moaland-typography-responsive($size: 12)
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
        @include moaland-typography-responsive(3.14159265359)
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
          @include moaland-typography-responsive($size: 14, $important: true);
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
          @include moaland-typography-responsive($size: 12, $important: true);
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
          @include moaland-typography-responsive($size: 14, $override-line-height: 21px);
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

  describe('when $moaland-typography-use-rem is disabled', () => {
    it('outputs CSS with suitable media queries', async () => {
      const sass = `
        $moaland-typography-use-rem: false;
        ${sassBootstrap}

        .foo {
          @include moaland-typography-responsive($size: 14)
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
        $moaland-typography-use-rem: false;
        $moaland-root-font-size: 10px;
        ${sassBootstrap}

        .foo {
          @include moaland-typography-responsive($size: 14)
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
          $moaland-typography-use-rem: false;
          ${sassBootstrap}

          .foo {
            @include moaland-typography-responsive($size: 14, $important: true);
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
    it('$moaland-typography-use-rem is disabled by default', async () => {
      const sass = `
        $moaland-compatibility-govuktemplate: true;
        ${sassBootstrap}

        .foo {
          @include moaland-typography-responsive($size: 14)
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
})
