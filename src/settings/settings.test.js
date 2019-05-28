/* eslint-env jest */

const path = require('path')

const { renderSass } = require('../../lib/jest-helpers')
const configPaths = require('../../config/paths.json')

describe('The settings layer', () => {
  it('should not output any CSS', async () => {
    const settings = path.join(configPaths.src, 'settings', '_all.scss')

    const output = await renderSass({ file: settings })
    expect(output.css.toString()).toEqual('')
  })
})
