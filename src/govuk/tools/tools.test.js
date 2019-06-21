/* eslint-env jest */

const path = require('path')

const glob = require('glob')

const { renderSass } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths.json')

const sassFiles = glob.sync(`${configPaths.src}/tools/**/*.scss`)

describe('The tools layer', () => {
  it('should not output any CSS', async () => {
    const tools = path.join(configPaths.src, 'tools', '_all.scss')

    const output = await renderSass({ file: tools })
    expect(output.css.toString()).toEqual('')
  })

  it.each(sassFiles)('%s renders to CSS without errors', (file) => {
    return renderSass({ file: file })
  })
})
