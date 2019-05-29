/* eslint-env jest */

const util = require('util')
const outdent = require('outdent')

const configPaths = require('../../../config/paths.json')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const sassConfig = {
  includePaths: [ configPaths.src ],
  outputStyle: 'nested'
}
describe('grid system', () => {
  const sassImports = `
    @import "settings/ie8";
    @import "settings/media-queries";
    @import "settings/spacing";
    @import "settings/measurements";

    @import "helpers/grid";
    @import "helpers/media-queries";

    @import "tools/exports";
  `
  describe('govuk-grid-width function', () => {
    it('outputs the specified key value from the map of widths', async () => {
      const sass = `
        ${sassImports}

        .foo {
          content: govuk-grid-width(one-quarter);
        }`

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css.toString().trim()).toBe(outdent`
      .foo {
        content: 25%; }`)
    })

    it('throws an error that the specified key does not exist in the map of widths', async () => {
      const sass = `
        ${sassImports}

        $value: govuk-grid-width(seven-fifths);
        `

      await expect(sassRender({ data: sass, ...sassConfig }))
        .rejects
        .toThrow('Unknown grid width `seven-fifths`')
    })
  })

  describe('@govuk-grid-row mixin', () => {
    it('outputs default defined styles for .govuk-grid-row class', async () => {
      const sass = `
        ${sassImports}
        @import "helpers/clearfix";

        @include govuk-grid-row();
        `

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css
        .toString()
        .trim())
        .toBe(outdent`
        .govuk-grid-row {
          margin-right: -15px;
          margin-left: -15px; }
          .govuk-grid-row:after {
            content: \"\";
            display: block;
            clear: both; }`)
    })
    it('outputs styles for the specified class', async () => {
      const sass = `
        ${sassImports}
        @import "helpers/clearfix";

        @include govuk-grid-row('app-grid-row');
        `

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css
        .toString()
        .trim())
        .toBe(outdent`
        .app-grid-row {
          margin-right: -15px;
          margin-left: -15px; }
          .app-grid-row:after {
            content: \"\";
            display: block;
            clear: both; }
        `)
    })
  })

  describe('@govuk-grid-column mixin', () => {
    it('outputs the CSS required for a column in the grid', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-full {
          @include govuk-grid-column($class: false);
        }
        `

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css
        .toString()
        .trim())
        .toBe(outdent`
        .govuk-grid-column-full {
          box-sizing: border-box;
          width: 100%;
          padding: 0 15px; }
          @media (min-width: 40.0625em) {
            .govuk-grid-column-full {
              width: 100%;
              float: left; } }`)
    })

    it('allows different widths to be specified using $width', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-two-thirds {
          @include govuk-grid-column(two-thirds, $class: false);
        }
      `
      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css
        .toString()
        .trim())
        .toBe(outdent`
        .govuk-grid-column-two-thirds {
          box-sizing: border-box;
          width: 100%;
          padding: 0 15px; }
          @media (min-width: 40.0625em) {
            .govuk-grid-column-two-thirds {
              width: 66.6666%;
              float: left; } }
        `)
    })

    it('allows predefined breakpoints to be specified using $at', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-one-quarter-at-desktop {
          @include govuk-grid-column(one-quarter, $at: desktop, $class: false);
        }
      `
      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css
        .toString()
        .trim())
        .toBe(outdent`
        .govuk-grid-column-one-quarter-at-desktop {
          box-sizing: border-box;
          padding: 0 15px; }
          @media (min-width: 48.0625em) {
            .govuk-grid-column-one-quarter-at-desktop {
              width: 25%;
              float: left; } }
        `)
    })
    it('allows custom breakpoints to be specified using $at', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-one-quarter-at-500px {
          @include govuk-grid-column(one-quarter, $at: 500px, $class: false);
        }
      `
      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css
        .toString()
        .trim())
        .toBe(outdent`
        .govuk-grid-column-one-quarter-at-500px {
          box-sizing: border-box;
          width: 100%;
          padding: 0 15px; }
          @media (min-width: 31.25em) {
            .govuk-grid-column-one-quarter-at-500px {
              width: 25%;
              float: left; } }
        `)
    })

    it('allows columns to float right using $float: right', async () => {
      const sass = `
        ${sassImports}

        .govuk-grid-column-one-half-right {
          @include govuk-grid-column(one-half, $float: right, $class: false);
        }
      `
      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css
        .toString()
        .trim())
        .toBe(outdent`
        .govuk-grid-column-one-half-right {
          box-sizing: border-box;
          width: 100%;
          padding: 0 15px; }
          @media (min-width: 40.0625em) {
            .govuk-grid-column-one-half-right {
              width: 50%;
              float: right; } }
        `)
    })

    it('includes the class name by default (deprecated)', async () => {
      const sass = `
        ${sassImports}

        @include govuk-grid-column();
        `

      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css
        .toString()
        .trim())
        .toBe(outdent`
        .govuk-grid-column-full {
          box-sizing: border-box;
          width: 100%;
          padding: 0 15px; }
          @media (min-width: 40.0625em) {
            .govuk-grid-column-full {
              width: 100%;
              float: left; } }`)
    })

    it('allows the class name to be overridden (deprecated)', async () => {
      const sass = `
        ${sassImports}

        @include govuk-grid-column(three-quarters, $class:'large-column');
      `
      const results = await sassRender({ data: sass, ...sassConfig })

      expect(results.css
        .toString()
        .trim())
        .toBe(outdent`
        .large-column-three-quarters {
          box-sizing: border-box;
          width: 100%;
          padding: 0 15px; }
          @media (min-width: 40.0625em) {
            .large-column-three-quarters {
              width: 75%;
              float: left; } }
        `)
    })
  })
})
