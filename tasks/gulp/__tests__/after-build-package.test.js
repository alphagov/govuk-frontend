/* eslint-env jest */

const fs = require('fs')
const path = require('path')
const util = require('util')

const sass = require('node-sass')
const recursive = require('recursive-readdir')

const configPaths = require('../../../config/paths.json')

const sassRender = util.promisify(sass.render)
const readFile = util.promisify(fs.readFile)

describe('package/', () => {
  it('should contain the expected files', () => {
    // Build an array of the files that are present in the package directory.
    const actualPackageFiles = () => {
      return recursive(configPaths.package).then(
        files => {
          return files
            // Remove /package prefix from filenames
            .map(file => file.replace(/^package\//, ''))
            // Sort to make comparison easier
            .sort()
        },
        error => {
          console.error('Unable to get package files', error)
        }
      )
    }

    // Build an array of files we expect to be found in the package directory,
    // based on the contents of the src directory.
    const expectedPackageFiles = () => {
      const filesToIgnore = [
        '.DS_Store',
        '*.test.js',
        '*.yaml',
        'README.njk',
        '*.snap'
      ]

      const additionalFilesNotInSrc = [
        'package.json'
      ]

      return recursive(configPaths.src, filesToIgnore).then(
        files => {
          return files
            // Remove /src prefix from filenames
            .map(file => file.replace(/^src\//, ''))
            // Allow for additional files that are not in src
            .concat(additionalFilesNotInSrc)
            // Sort to make comparison easier
            .sort()
        },
        error => {
          console.error('Unable to get package files', error)
        }
      )
    }

    // Compare the expected directory listing with the files we expect
    // to be present
    Promise.all([actualPackageFiles(), expectedPackageFiles()])
      .then(results => {
        const [actualPackageFiles, expectedPackageFiles] = results

        expect(actualPackageFiles).toEqual(expectedPackageFiles)
      })
  })

  describe('README.md', () => {
    it('is not overwritten', () => {
      return readFile(path.join(configPaths.package, 'README.md'), 'utf8')
        .then(contents => {
          // Look for H1 matching 'GOV.UK Frontend' from existing README
          expect(contents).toMatch(/^# GOV.UK Frontend/)
        }).catch(error => {
          throw error
        })
    })
  })

  describe('all.scss', () => {
    it('should compile without throwing an exeption', async () => {
      const allScssFile = path.join(configPaths.package, 'all.scss')
      await sassRender({ file: allScssFile })
    })
  })
})
