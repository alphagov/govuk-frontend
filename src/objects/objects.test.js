/* eslint-env jest */

const util = require('util')
const glob = require('glob')

const configPaths = require('../../config/paths.json')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const sassFiles = glob.sync(`${configPaths.src}/objects/**/*.scss`)

it.each(sassFiles)('%s renders to CSS without errors', (file) => {
  return sassRender({ file: file, includePaths: [ configPaths.src ] })
})
