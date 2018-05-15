/* eslint-env jest */

const path = require('path')
const util = require('util')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const lib = require('../../../lib/file-helper')
const configPaths = require('../../../config/paths.json')

describe('Individual components', () => {
  it('should compile individual scss files without throwing exceptions', done => {
    const componentNames = lib.allComponents.slice()

    const getSassRenders = () => {
      return componentNames.map(name => {
        const filePath = path.join(configPaths.components, name, `_${name}.scss`)
        return sassRender({ file: filePath })
      })
    }

    Promise
      .all(getSassRenders())
      .then(() => { done() })
      .catch(error => { throw error })
  })
})
