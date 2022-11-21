import { readFile } from 'fs/promises'
import { join } from 'path'

import configPaths from '../../../config/paths.js'
import { getListing } from '../../../lib/file-helper.js'

describe('dist/', () => {
  const pkg = require(join(configPaths.package, 'package.json'))

  let listingSourceAssets
  let listingDistAssets

  beforeAll(async () => {
    listingSourceAssets = await getListing(configPaths.assets)
    listingDistAssets = await getListing(join(configPaths.dist, 'assets'))
  })

  describe('assets/', () => {
    it('should include the same files as in src/assets', () => {
      expect(listingDistAssets).toEqual(listingSourceAssets)
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
