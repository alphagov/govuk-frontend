/* eslint-env jest */

const path = require('path')

const glob = require('glob')

const { renderSass } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths.json')

const sassFiles = glob.sync(`${configPaths.src}/helpers/**/*.scss`)

describe('The helpers layer', () => {
  it('should not output any CSS', async () => {
    const helpers = path.join(configPaths.src, 'helpers', '_all.scss')

    const output = await renderSass({ file: helpers })
    expect(output.css.toString()).toEqual('')
  })

  it.each(sassFiles)('%s renders to CSS without errors', (file) => {
    return renderSass({ file: file })
  })
})
