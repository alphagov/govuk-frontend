/* eslint-env jest */

const path = require('path')
const util = require('util')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const configPaths = require('../../../config/paths.json')

describe('The helpers layer', () => {
  it('should not output any CSS', async () => {
    const helpers = path.join(configPaths.src, 'helpers', '_all.scss')

    const output = await sassRender({ file: helpers })
    expect(output.css.toString()).toEqual('')
  })
})
