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
    my_breakpoint: 30em
  );

  $font-map: (
    null: (
      font-size: 12px,
      line-height: 15px
    ),
    my_breakpoint: (
      font-size: 14px,
      line-height: 20px
    )
  );

  $font-map-print: (
    null: (
      font-size: 12px,
      line-height: 15px
    ),
    print: (
      font-size: 14pt,
      line-height: 20pt
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
        @include govuk-typography-responsive($font-map)
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
        @include govuk-typography-responsive($font-map-print)
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
        'Expected a map of breakpoints and font sizes, but got a number. ' +
        'Make sure you are passing a font map.'
      )
  })

  describe('when $important is set to true', () => {
    it('marks font size and line height as important', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-typography-responsive($font-map, $important: true)
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
          @include govuk-typography-responsive(
            $font-map-print,
            $important: true
          )
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
          @include govuk-typography-responsive(
            $font-map,
            $override-line-height: 30px
          )
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
