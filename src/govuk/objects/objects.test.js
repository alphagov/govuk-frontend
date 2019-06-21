/* eslint-env jest */

const glob = require('glob')
const { renderSass } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths.json')

const sassFiles = glob.sync(`${configPaths.src}/objects/**/*.scss`)

it.each(sassFiles)('%s renders to CSS without errors', (file) => {
  return renderSass({ file: file })
})
