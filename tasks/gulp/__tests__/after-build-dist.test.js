/* eslint-env jest */
const path = require('path')
const lib = require('../../../lib/file-helper')
const configPaths = require('../../../config/paths.json')

describe('building dist/', () => {
  describe('when running copy-to-destination', () => {
    // Check to have all the components in dist and nothing else
    it('should copy all components to dist', () => {
      expect(lib.DistComponentList).toEqual(lib.SrcComponentList)
    })
  })

  function defineTestsForComponent (componentName) {
    describe('when publishing ' + componentName, () => {
      // Check component files in dist
      it('should copy the right files to dist', () => {
        let actualDistFiles = lib.distFilesForComponent(componentName)
        let expectedDistFiles = lib.expectedDistFilesForComponent(componentName)
        expect(actualDistFiles).toEqual(expectedDistFiles)
      })
    })
  }

  lib.SrcComponentList.forEach((componentName) => {
    defineTestsForComponent(componentName)
  })
  describe('when compiling css to dist', () => {
    let version = require(path.join('../../../', configPaths.packages, 'all/package.json')).version
    const FrontendCssFile = lib.readFileContents(path.join(configPaths.dist, 'css/', `govuk-frontend-${version}.min.css`))
    const FrontendCssOldIeFile = lib.readFileContents(path.join(configPaths.dist, 'css/', `govuk-frontend-old-ie-${version}.min.css`))

    it('standard css file should not contain current media query displayed on body element', () => {
      expect(FrontendCssFile).not.toMatch(/body:before{content:/)
    })
    it('legacy css file should not contain current media query displayed on body element', () => {
      expect(FrontendCssOldIeFile).not.toMatch(/body:before{content:/)
    })
  })
})
