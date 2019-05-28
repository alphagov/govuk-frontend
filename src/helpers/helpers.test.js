/* eslint-env jest */

const path = require('path')

const { renderSass } = require('../../lib/jest-helpers')
const configPaths = require('../../config/paths.json')

describe('The helpers layer', () => {
  it('should not output any CSS', async () => {
    const helpers = path.join(configPaths.src, 'helpers', '_all.scss')

    const output = await renderSass({ file: helpers })
    expect(output.css.toString()).toEqual('')
  })
})
