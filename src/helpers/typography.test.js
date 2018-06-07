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
        line-height: 20pt
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

describe('@mixin govuk-typography-responsive', () => {
  it('outputs CSS with suitable media queries', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-typography-responsive(map-get($govuk-typography-scale, 14))
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        font-size: 12px;
        line-height: 15px; }
        @media (min-width: 30em) {
          .foo {
            font-size: 14px;
            line-height: 20px; } }`)
  })

  it('outputs CSS with suitable media queries for print', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-typography-responsive(12)
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        font-size: 12px;
        line-height: 15px; }
        @media print {
          .foo {
            font-size: 14pt;
            line-height: 20pt; } }`)
  })

  it('throws an exception when passed anything other than a font map', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-typography-responsive(14px)
      }`

    await expect(sassRender({ data: sass, ...sassConfig }))
      .rejects
      .toThrow(
        'Expected a map of breakpoints and font sizes, but got a null. ' +
        'Make sure you are passing a font map.'
      )
  })

  describe('when $important is set to true', () => {
    it('marks font size and line height as important', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive(14, $important: true);
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-size: 12px !important;
          line-height: 15px !important; }
          @media (min-width: 30em) {
            .foo {
              font-size: 14px !important;
              line-height: 20px !important; } }`)
    })

    it('marks font-size and line-height as important for print media', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive(12, $important: true);
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-size: 12px !important;
          line-height: 15px !important; }
          @media print {
            .foo {
              font-size: 14pt !important;
              line-height: 20pt !important; } }`)
    })
  })

  describe('when $override-line-height is set', () => {
    it('overrides the line height', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive(14, $override-line-height: 30px);
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          font-size: 12px;
          line-height: 30px; }
          @media (min-width: 30em) {
            .foo {
              font-size: 14px;
              line-height: 30px; } }`)
    })
  })
})
