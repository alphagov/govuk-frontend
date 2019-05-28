/* eslint-env jest */

const path = require('path')

const { renderSass } = require('../../lib/jest-helpers')
const configPaths = require('../../config/paths.json')

describe('The tools layer', () => {
  it('should not output any CSS', async () => {
    const tools = path.join(configPaths.src, 'tools', '_all.scss')

    const output = await renderSass({ file: tools })
    expect(output.css.toString()).toEqual('')
  })
})
