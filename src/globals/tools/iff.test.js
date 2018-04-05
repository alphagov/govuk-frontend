/* eslint-env jest */

const util = require('util')

const configPaths = require('../../../config/paths.json')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const sassConfig = {
  includePaths: [ configPaths.src ],
  outputStyle: 'compressed'
}

describe('@function iff', () => {
  it('outputs if the condition is truthy', async () => {
    const sass = `
      @import 'globals/tools/iff';

      .foo {
        color: red iff(true, !important);
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(`.foo{color:red !important}`)
  })

  it('does not output if the condition is falsey', async () => {
    const sass = `
      @import 'globals/tools/iff';

      .foo {
        color: red iff(false, !important);
      }`

    const results = await sassRender({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe(`.foo{color:red}`)
  })
})
