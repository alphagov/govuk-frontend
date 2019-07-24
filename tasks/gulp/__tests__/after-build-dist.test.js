/* eslint-env jest */
const path = require('path')
const lib = require('../../../lib/file-helper')
const configPaths = require('../../../config/paths.json')
const recursive = require('recursive-readdir')

describe('dist/', () => {
  const version = require(path.join('../../../', configPaths.package, 'package.json')).version

  describe('assets/', () => {
    it('should include the same files as in src/assets', () => {
      // Build an array of the assets that are present in the src directory.
      const expectedDistAssets = () => {
        const filesToIgnore = [
          '.DS_Store'
        ]
        return recursive(path.join(configPaths.src, 'assets'), filesToIgnore).then(
          files => {
            return files
              // Remove /package prefix from filenames
              .map(file => file.replace(/^src\/govuk\/assets\//, ''))
              // Sort to make comparison easier
              .sort()
          },
          error => {
            console.error('Unable to get asset files from src', error)
          }
        )
      }

      const actualDistAssets = () => {
        return recursive(path.join(configPaths.dist, 'assets')).then(
          files => {
            return files
              // Remove /package prefix from filenames
              .map(file => file.replace(/^dist\/assets\//, ''))
              // Sort to make comparison easier
              .sort()
          },
          error => {
            console.error('Unable to get asset files from dist', error)
          }
        )
      }

      // Compare the expected directory listing with the files we expect
      // to be present
      Promise.all([actualDistAssets(), expectedDistAssets()])
        .then(results => {
          const [actualDistAssets, expectedDistAssets] = results

          expect(actualDistAssets).toEqual(expectedDistAssets)
        })
    })
  })

  describe(`govuk-frontend-${version}.min.css`, () => {
    const stylesheet = lib.readFileContents(path.join(configPaths.dist, `govuk-frontend-${version}.min.css`))

    it('should not contain current media query displayed on body element', () => {
      expect(stylesheet).not.toMatch(/body:before{content:/)
    })
  })

  describe(`govuk-frontend-ie8-${version}.min.css`, () => {
    const stylesheet = lib.readFileContents(path.join(configPaths.dist, `govuk-frontend-ie8-${version}.min.css`))

    it('should not contain current media query displayed on body element', () => {
      expect(stylesheet).not.toMatch(/body:before{content:/)
    })
  })

  describe(`govuk-frontend-${version}.min.js`, () => {
    const javascript = lib.readFileContents(path.join(configPaths.dist, `govuk-frontend-${version}.min.js`))

    it('should have the correct version name', () => {
      expect(javascript).toBeTruthy()
    })
  })
})
