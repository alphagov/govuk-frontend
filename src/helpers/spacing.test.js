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

  $spacing-map: (
    null: 15px,
    my_breakpoint: 25px
  );

  @import "helpers/media-queries";
  @import "tools/iff";
  @import "helpers/spacing";`

describe('@mixin govuk-responsive-spacing', () => {
  it('outputs CSS for a property based on the given spacing map', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-responsive-spacing($spacing-map, 'margin')
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        margin: 15px; }
        @media (min-width: 30em) {
          .foo {
            margin: 25px; } }`)
  })

  it('outputs CSS for a property and direction based on the spacing map', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-responsive-spacing($spacing-map, 'padding', 'top');
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        padding-top: 15px; }
        @media (min-width: 30em) {
          .foo {
            padding-top: 25px; } }`)
  })

  it('throws an exception when passed anything other than a map', async () => {
    const sass = `
      ${sassBootstrap}

      .foo {
        @include govuk-responsive-spacing(14px, 'margin')
      }`

    await expect(sassRender({ data: sass, ...sassConfig }))
      .rejects
      .toThrow(
        'Expected a map of breakpoints from the responsive scale, but got a ' +
        'number. Make sure you are using a point from the responsive spacing ' +
        'scale.'
      )
  })

  describe('when $important is set to true', () => {
    it('marks the rule as important for the property', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-spacing(
            $spacing-map,
            'margin',
            $important: true
          )
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          margin: 15px !important; }
          @media (min-width: 30em) {
            .foo {
              margin: 25px !important; } }`)
    })

    it('marks the rule as important for the property and direction', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-spacing(
            $spacing-map,
            'margin',
            'top',
            $important: true
          )
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          margin-top: 15px !important; }
          @media (min-width: 30em) {
            .foo {
              margin-top: 25px !important; } }`)
    })
  })

  describe('when an adjustment is provided', () => {
    it('adjusts the value for the property', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-spacing(
            $spacing-map,
            'margin',
            $adjustment: 2px
          )
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          margin: 17px; }
          @media (min-width: 30em) {
            .foo {
              margin: 27px; } }`)
    })

    it('adjusts the value for the property and direction', async () => {
      const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-spacing(
            $spacing-map,
            'margin',
            'top',
            $adjustment: 2px
          )
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          margin-top: 17px; }
          @media (min-width: 30em) {
            .foo {
              margin-top: 27px; } }`)
    })
  })
})

describe('@mixin govuk-responsive-margin', () => {
  it('outputs simple responsive margins', async () => {
    const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-margin($spacing-map)
        }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          margin: 15px; }
          @media (min-width: 30em) {
            .foo {
              margin: 25px; } }`)
  })

  it('outputs extreme responsive margins', async () => {
    const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-margin(
            $spacing-map,
            'top',
            $important: true,
            $adjustment: 2px
          )
        }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          margin-top: 17px !important; }
          @media (min-width: 30em) {
            .foo {
              margin-top: 27px !important; } }`)
  })
})

describe('@mixin govuk-responsive-padding', () => {
  it('outputs simple responsive padding', async () => {
    const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-padding($spacing-map)
        }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          padding: 15px; }
          @media (min-width: 30em) {
            .foo {
              padding: 25px; } }`)
  })

  it('outputs extreme responsive padding', async () => {
    const sass = `
        ${sassBootstrap}

        .foo {
          @include govuk-responsive-padding(
            $spacing-map,
            'top',
            $important: true,
            $adjustment: 2px
          )
        }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(outdent`
        .foo {
          padding-top: 17px !important; }
          @media (min-width: 30em) {
            .foo {
              padding-top: 27px !important; } }`)
  })
})
