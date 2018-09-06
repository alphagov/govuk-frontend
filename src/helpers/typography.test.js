/* eslint-env jest */

const util = require('util')

const configPaths = require('../../config/paths.json')

const outdent = require('outdent')
const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const sassConfig = {
  includePaths: [ configPaths.src ],
  outputStyle: 'nested'
}

const sassBootstrap = `
  @import "settings/media-queries";
  @import "settings/ie8";

  $govuk-root-font-size: 16px;
  $govuk-typography-use-rem: true;

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

  @import "helpers/media-queries";
  @import "tools/iff";
  @import "helpers/typography";`

describe('@function _govuk-line-height', () => {
  it('preserves line-height if already unitless', async () => {
    const sass = `
      @import "helpers/typography";

      .foo {
        line-height: _govuk-line-height($line-height: 3.141, $font-size: 20px);
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

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

    const results = await sassRender({ data: sass, ...sassConfig })

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

    const results = await sassRender({ data: sass, ...sassConfig })

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

    const results = await sassRender({ data: sass, ...sassConfig })

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

    const results = await sassRender({ data: sass, ...sassConfig })

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

    await expect(sassRender({ data: sass, ...sassConfig }))
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

      const results = await sassRender({ data: sass, ...sassConfig })

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

      const results = await sassRender({ data: sass, ...sassConfig })

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

      const results = await sassRender({ data: sass, ...sassConfig })

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
        ${sassBootstrap}
        $govuk-typography-use-rem: false;

        .foo {
          @include govuk-typography-responsive($size: 14)
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

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
        ${sassBootstrap}
        $govuk-typography-use-rem: false;
        $govuk-root-font-size: 10px;

        .foo {
          @include govuk-typography-responsive($size: 14)
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

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
          ${sassBootstrap}
          $govuk-typography-use-rem: false;

          .foo {
            @include govuk-typography-responsive($size: 14, $important: true);
          }`

        const results = await sassRender({ data: sass, ...sassConfig })

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
})
