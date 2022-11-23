import { readFile } from 'fs/promises'
import { join } from 'path'

import configPaths from '../../../config/paths.js'
import { getListing } from '../../../lib/file-helper.js'

describe('dist/', () => {
  let pkg
  let listingSourceAssets
  let listingDistAssets

  beforeAll(async () => {
    pkg = JSON.parse(await readFile(join(configPaths.package, 'package.json'), 'utf8'))
    listingSourceAssets = await getListing(configPaths.assets)
    listingDistAssets = await getListing(join(configPaths.dist, 'assets'))
  })

  describe('assets/', () => {
    it('should include the same files as in src/assets', () => {
      expect(listingDistAssets).toEqual(listingSourceAssets)
    })
  })

  describe('govuk-frontend-[version].min.css', () => {
    let filename
    let stylesheet

    beforeAll(async () => {
      filename = `govuk-frontend-${pkg.version}.min.css`
      stylesheet = await readFile(join(configPaths.dist, filename), 'utf8')
    })

    it('should not contain current media query displayed on body element', () => {
      expect(stylesheet).not.toMatch(/body:before{content:/)
    })

    it('should contain the copyright notice', () => {
      expect(stylesheet).toContain('/*! Copyright (c) 2011 by Margaret Calvert & Henrik Kubel. All rights reserved. The font has been customised for exclusive use on gov.uk. This cut is not commercially available. */')
    })

    it('should contain source mapping URL', () => {
      expect(stylesheet).toMatch(new RegExp(`/\\*# sourceMappingURL=${filename}.map \\*/$`))
    })
  })

  describe('govuk-frontend-ie8-[version].min.css', () => {
    let filename
    let stylesheet

    beforeAll(async () => {
      filename = `govuk-frontend-ie8-${pkg.version}.min.css`
      stylesheet = await readFile(join(configPaths.dist, filename), 'utf8')
    })

    it('should not contain current media query displayed on body element', () => {
      expect(stylesheet).not.toMatch(/body:before{content:/)
    })

    it('should contain source mapping URL', () => {
      expect(stylesheet).toMatch(new RegExp(`/\\*# sourceMappingURL=${filename}.map \\*/$`))
    })
  })

  describe('govuk-frontend-[version].min.js', () => {
    let filename
    let javascript

    beforeAll(async () => {
      filename = `govuk-frontend-${pkg.version}.min.js`
      javascript = await readFile(join(configPaths.dist, filename), 'utf8')
    })

    it('should have the correct version name', () => {
      expect(javascript).toBeTruthy()
    })

    it('should contain source mapping URL', () => {
      expect(javascript).toMatch(new RegExp(`//# sourceMappingURL=${filename}.map$`))
    })
  })
})
