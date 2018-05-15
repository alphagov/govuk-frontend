/* eslint-env jest */

const path = require('path')
const util = require('util')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const configPaths = require('../../config/paths.json')

describe('The tools layer', () => {
  it('should not output any CSS', async () => {
    const tools = path.join(configPaths.src, 'tools', '_all.scss')

    const output = await sassRender({ file: tools })
    expect(output.css.toString()).toEqual('')
  })
})
