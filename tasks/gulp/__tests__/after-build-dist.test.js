/* eslint-env jest */

const lib = require('../../../lib/file-helper')

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
})
