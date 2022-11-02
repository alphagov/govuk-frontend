const { readFile } = require('fs/promises')
const { join } = require('path')
const { cwd } = require('process')
const slash = require('slash')

const configPaths = require('../../../config/paths.js')
const { filterPath, getListing, listingToArray } = require('../../../lib/file-helper')

describe('dist/', () => {
  const pkg = require(join(cwd(), configPaths.package, 'package.json'))

  let listingSourceAssets
  let listingDistAssets

  beforeAll(async () => {
    listingSourceAssets = await getListing(join(configPaths.src, 'assets'))
    listingDistAssets = await getListing(join(configPaths.dist, 'assets'))
  })

  describe('assets/', () => {
    it('should include the same files as in src/assets', () => {
      const filterPatterns = [
        '!**/.DS_Store'
      ]

      // Build array of expected output files
      const filesExpected = [...listingSourceAssets]
        .flatMap(listingToArray)
        .map(slash)
        .sort()

        // Only include files matching filter patterns
        .filter(filterPath(filterPatterns))

        // Files output from 'src/govuk' to 'dist'
        .map((file) => file.replace(/^src\/govuk\//, 'dist/'))

      // Build array of actual output files
      const filesActual = [...listingDistAssets]
        .flatMap(listingToArray)
        .map(slash)
        .sort()

        // Only include files matching filter patterns
        .filter(filterPath(filterPatterns))

      expect(filesActual).toEqual(filesExpected)
    })
  })

  describe(`govuk-frontend-${pkg.version}.min.css`, () => {
    let stylesheet

    beforeAll(async () => {
      stylesheet = await readFile(join(configPaths.dist, `govuk-frontend-${pkg.version}.min.css`), 'utf8')
    })

    it('should not contain current media query displayed on body element', () => {
      expect(stylesheet).not.toMatch(/body:before{content:/)
    })

    it('should contain the copyright notice', () => {
      expect(stylesheet).toContain('/*! Copyright (c) 2011 by Margaret Calvert & Henrik Kubel. All rights reserved. The font has been customised for exclusive use on gov.uk. This cut is not commercially available. */')
    })
  })

  describe(`govuk-frontend-ie8-${pkg.version}.min.css`, () => {
    let stylesheet

    beforeAll(async () => {
      stylesheet = await readFile(join(configPaths.dist, `govuk-frontend-ie8-${pkg.version}.min.css`), 'utf8')
    })

    it('should not contain current media query displayed on body element', () => {
      expect(stylesheet).not.toMatch(/body:before{content:/)
    })
  })

  describe(`govuk-frontend-${pkg.version}.min.js`, () => {
    let javascript

    beforeAll(async () => {
      javascript = await readFile(join(configPaths.dist, `govuk-frontend-${pkg.version}.min.js`), 'utf8')
    })

    it('should have the correct version name', () => {
      expect(javascript).toBeTruthy()
    })
  })
})
