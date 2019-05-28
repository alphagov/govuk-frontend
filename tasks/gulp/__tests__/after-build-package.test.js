/* eslint-env jest */

const fs = require('fs')
const path = require('path')
const util = require('util')

const recursive = require('recursive-readdir')
var glob = require('glob')

const configPaths = require('../../../config/paths.json')
const lib = require('../../../lib/file-helper')

const { renderSass } = require('../../lib/jest-helpers')

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
        '*.snap'
      ]

      const additionalFilesNotInSrc = [
        'package.json',
        'govuk-prototype-kit.config.json',
        '**/macro-options.json'
      ]

      return recursive(configPaths.src, filesToIgnore).then(
        files => {
          let filesNotInSrc = files
          // Use glob to generate an array of files that accounts for wildcards in filenames
          filesNotInSrc = glob.sync('{' + additionalFilesNotInSrc.join(',') + '}', { cwd: 'package' })

          return files
            // Remove /src prefix from filenames
            .map(file => file.replace(/^src\//, ''))
            // Allow for additional files that are not in src
            .concat(filesNotInSrc)
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
    it('should compile without throwing an exception', async () => {
      const allScssFile = path.join(configPaths.package, 'all.scss')
      await renderSass({ file: allScssFile })
    })
  })

  describe('component', () => {
    const componentNames = lib.allComponents.slice()

    it.each(componentNames)(`'%s' should have macro-options.json that contains JSON`, (name) => {
      const filePath = path.join(configPaths.package, 'components', name, 'macro-options.json')
      return readFile(filePath, 'utf8')
        .then((data) => {
          var parsedData = JSON.parse(data)
          // We expect the component JSON to contain "name", "type", "required", "description"
          expect(parsedData).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: expect.any(String),
                type: expect.any(String),
                required: expect.any(Boolean),
                description: expect.any(String)
              })
            ])
          )
        })
        .catch(error => {
          throw error
        })
    })
  })
})
