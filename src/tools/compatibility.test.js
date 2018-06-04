/* eslint-env jest */

const util = require('util')

const configPaths = require('../../config/paths.json')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const sassConfig = {
  includePaths: [ configPaths.src ],
  outputStyle: 'compressed'
}

describe('@mixin govuk-compatibility', () => {
  it('does not output if the app is not marked as included', async () => {
    const sass = `
      $_govuk-compatibility: (existing_app: false);

      @import "tools/compatibility";

      @include govuk-compatibility(existing_app) {
        .foo {
          color: red;
        }
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString()).toEqual('')
  })

  it('outputs if the app is not marked as included', async () => {
    const sass = `
      $_govuk-compatibility: (existing_app: true);

      @import "tools/compatibility";

      @include govuk-compatibility(existing_app) {
        .foo {
          color: red;
        }
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo{color:red}')
  })

  it('throws an exception if the app is not recognised', async () => {
    const sass = `
      $_govuk-compatibility: (existing_app: true);

      @import "tools/compatibility";

      @include govuk-compatibility(non_existent_app) {
        .foo {
          color: red;
        }
      }`

    await expect(sassRender({ data: sass, ...sassConfig }))
      .rejects
      .toThrow('Non existent compatibility product \'non_existent_app\'')
  })
})
