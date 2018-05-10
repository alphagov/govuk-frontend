/* eslint-env jest */
const path = require('path')
const lib = require('../../../lib/file-helper')
const configPaths = require('../../../config/paths.json')

describe('building dist/', () => {
  let version = require(path.join('../../../', configPaths.package, 'package.json')).version

  describe('when compiling css to dist', () => {
    const FrontendCssFile = lib.readFileContents(path.join(configPaths.dist, `govuk-frontend-${version}.min.css`))
    const FrontendCssOldIeFile = lib.readFileContents(path.join(configPaths.dist, `govuk-frontend-ie8-${version}.min.css`))

    it('standard css file should not contain current media query displayed on body element', () => {
      expect(FrontendCssFile).not.toMatch(/body:before{content:/)
    })
    it('legacy css file should not contain current media query displayed on body element', () => {
      expect(FrontendCssOldIeFile).not.toMatch(/body:before{content:/)
    })
  })

  describe('when compiling Javascipt to dist', () => {
    const FrontendJsFile = lib.readFileContents(path.join(configPaths.dist, `govuk-frontend-${version}.min.js`))

    it('javascript file has the correct version name', () => {
      expect(FrontendJsFile).toBeTruthy()
    })
  })
})
