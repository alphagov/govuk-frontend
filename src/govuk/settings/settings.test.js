/* eslint-env jest */

const path = require('path')

const glob = require('glob')

const { renderSass } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths.json')

const sassFiles = glob.sync(`${configPaths.src}/settings/**/*.scss`)

describe('The settings layer', () => {
  it('should not output any CSS', async () => {
    const settings = path.join(configPaths.src, 'settings', '_all.scss')

    const output = await renderSass({ file: settings })
    expect(output.css.toString()).toEqual('')
  })

  it.each(sassFiles)('%s renders to CSS without errors', (file) => {
    return renderSass({ file: file })
  })
})
