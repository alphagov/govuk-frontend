/* eslint-env jest */

const util = require('util')

const configPaths = require('../../config/paths.json')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const sassConfig = {
  includePaths: [ configPaths.src ],
  outputStyle: 'compressed'
}

describe('@mixin govuk-exports', () => {
  it('will only output a named section once', async () => {
    const sass = `
      @import "tools/exports";

      @include govuk-exports(foo) {
        .foo {
          color: red;
        }
      }

      @include govuk-exports(foo) {
        .foo {
          color: blue;
        }
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toEqual('.foo{color:red}')
  })

  it('will export differently named sections', async () => {
    const sass = `
      @import "tools/exports";

      @include govuk-exports(foo) {
        .foo {
          color: red;
        }
      }

      @include govuk-exports(bar) {
        .bar {
          color: blue;
        }
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim())
      .toEqual('.foo{color:red}.bar{color:blue}')
  })
})
