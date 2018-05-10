/* eslint-env jest */

const path = require('path')
const util = require('util')
const sass = require('node-sass')

const lib = require('../../../lib/file-helper')
const configPaths = require('../../../config/paths.json')

const sassRender = util.promisify(sass.render)

describe('building package/', () => {
  describe('when running copy-to-destination', () => {
    // Check to have all the components and nothing else
    it('should copy all components folders', () => {
      let expectedFilesAndFolders = lib.SrcComponentList.slice()
      // We expect the package to contain files from source that are not in folders
      expectedFilesAndFolders.push('package.json', 'README.md', 'all.scss', 'all-ie8.scss', 'all.js')
      expectedFilesAndFolders.sort()
      expect(lib.PackageComponentList).toEqual(expectedFilesAndFolders)
    })
  })

  function defineTestsForComponent (componentName) {
    describe('when publishing ' + componentName, () => {
      // Check files in each folder
      it('should copy the right files to package/', () => {
        let actualPackageFiles = lib.packageFilesForComponent(componentName)
        let expectedPackageFiles = lib.expectedPackageFilesForComponent(componentName)
        expect(actualPackageFiles).toEqual(expectedPackageFiles)
      })
    })
  }

  lib.SrcComponentList.forEach((componentName) => {
    defineTestsForComponent(componentName)
  })

  describe('after running copy-to-destination', () => {
    it('scss files should compile without throwing an exeption', async () => {
      const allScssFile = path.join(configPaths.package, 'all.scss')
      await sassRender({ file: allScssFile })
    })
  })
})
