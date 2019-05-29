/* eslint-env jest */

const path = require('path')
const util = require('util')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const configPaths = require('../../../config/paths.json')

describe('The settings layer', () => {
  it('should not output any CSS', async () => {
    const settings = path.join(configPaths.src, 'settings', '_all.scss')

    const output = await sassRender({ file: settings })
    expect(output.css.toString()).toEqual('')
  })
})
