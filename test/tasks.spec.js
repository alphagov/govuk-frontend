/* eslint-env mocha */
const expect = require('chai').expect
const lib = require('../lib/file-helper')

describe('tasks', () => {
  describe('when running copy-to-destination', () => {
    // Check to have all the components in dist and nothing else
    it('should copy all components to dist', () => {
      expect(lib.DistComponentList).to.deep.equal(lib.SrcComponentList)
    })

    // Check to have all the components (plus all, globals, icons) in packages and nothing else
    it('should copy all components plus "all", "globals" and "icons" to packages', () => {
      let expectedPackagesComponentList = lib.SrcComponentList.slice()
      expectedPackagesComponentList.push('all', 'globals', 'icons')
      expectedPackagesComponentList.sort()
      expect(lib.PackagesComponentList).to.have.same.members(expectedPackagesComponentList)
    })
  })

  function defineTestsForComponent (componentName) {
    describe('when publishing ' + componentName, () => {
      // Check component files in dist
      it('should copy the right files to dist', () => {
        let actualDistFiles = lib.distFilesForComponent(componentName)
        let expectedDistFiles = lib.expectedDistFilesForComponent(componentName)
        expect(actualDistFiles).to.have.same.members(expectedDistFiles)
      })

      // Check component files in packages
      it('should copy the right files to packages', () => {
        let actualPackagesFiles = lib.packagesFilesForComponent(componentName)
        let expectedPackagesFiles = lib.expectedPackagesFilesForComponent(componentName)
        expect(actualPackagesFiles).to.have.same.members(expectedPackagesFiles)
      })
    })
  }

  lib.SrcComponentList.forEach((componentName) => {
    defineTestsForComponent(componentName)
  })
})
