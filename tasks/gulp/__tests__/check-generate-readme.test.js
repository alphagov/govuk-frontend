/* eslint-env jest */

const gulp = require('gulp')

const fs = require('fs')
const path = require('path')
const util = require('util')

const lib = require('../../../lib/file-helper')
const configPaths = require('../../../config/paths.json')

const readFile = util.promisify(fs.readFile)

const gulpStart = (taskName) => {
  return new Promise((resolve, reject) => {
    try {
      gulp.start(taskName, resolve)
    } catch (error) {
      reject(error)
    }
  })
}

require('../generate-readme.js')

describe('Generating READMEs', () => {
  it('should have no dirty changes since they should be committed into source', done => {
    const componentNames = lib.PackagesCount.slice()

    const getReadmeContents = () => {
      return componentNames.map(name => {
        const filePath = path.join(configPaths.govukFrontend, name, 'README.md')
        return readFile(filePath, 'utf8')
          .then(data => {
            return { name, data }
          }).catch(error => {
            throw error
          })
      })
    }

    let existingReadmeContents = ''

    Promise
      .all(getReadmeContents())
      .then((readmeContents) => {
        existingReadmeContents = readmeContents
        return gulpStart('generate:readme')
      })
      .then(() => {
        return Promise.all(getReadmeContents())
      })
      .then((readmeContents) => {
        const dirtyReadmeNames =
          readmeContents
            .filter(readme => {
              const matchingReadme = existingReadmeContents.find(existingReadme => {
                return (existingReadme.name === readme.name)
              })
              const readmeIsDirty = (readme.data !== matchingReadme.data)
              return readmeIsDirty
            })
            .map(readme => {
              return readme.name
            })
            .join(', ')

        expect(dirtyReadmeNames).toBeFalsy()
        done()
      })
      .catch(error => {
        throw error
      })
  })
})
