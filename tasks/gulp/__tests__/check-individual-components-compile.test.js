/* eslint-env jest */

const path = require('path')

const sass = require('node-sass')

const lib = require('../../../lib/file-helper')
const configPaths = require('../../../config/paths.json')

const sassRender = (options) => {
  return new Promise((resolve, reject) => {
    sass.render(options, (error, result) => {
      if (error) {
        return reject(error)
      }
      return resolve(result)
    })
  })
}

describe('Individual components', () => {
  it('should compile individual scss files without throwing exceptions', done => {
    const componentNames = lib.SrcFilteredComponentList.slice()

    const getSassRenders = () => {
      return componentNames.map(name => {
        const filePath = path.join(configPaths.src, name, `_${name}.scss`)
        return sassRender({ file: filePath })
      })
    }

    Promise
      .all(getSassRenders())
      .then(() => { done() })
      .catch(error => { throw error })
  })
})
