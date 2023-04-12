import { readFile } from 'fs/promises'
import { EOL } from 'os'
import { join } from 'path'

import { paths, pkg } from 'govuk-frontend-config'
import { helpers } from 'govuk-frontend-lib'

const { getListing } = helpers.files

describe('dist/', () => {
  let listingSourceAssets
  let listingDistAssets

  beforeAll(async () => {
    listingSourceAssets = await getListing(join(paths.src, 'govuk/assets'))
    listingDistAssets = await getListing(join(paths.dist, 'assets'))
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
      stylesheet = await readFile(join(paths.dist, filename), 'utf8')
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

    it('should contain version number custom property', () => {
      expect(stylesheet).toContain(`--govuk-frontend-version:"${pkg.version}"`)
    })
  })

  describe('govuk-frontend-ie8-[version].min.css', () => {
    let filename
    let stylesheet

    beforeAll(async () => {
      filename = `govuk-frontend-ie8-${pkg.version}.min.css`
      stylesheet = await readFile(join(paths.dist, filename), 'utf8')
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
      javascript = await readFile(join(paths.dist, filename), 'utf8')
    })

    it('should have the correct version name', () => {
      expect(javascript).toBeTruthy()
    })

    it('should contain correct version number', () => {
      expect(javascript).toContain(`.version="${pkg.version}",`)
    })

    it('should contain source mapping URL', () => {
      expect(javascript).toMatch(new RegExp(`//# sourceMappingURL=${filename}.map$`))
    })
  })

  describe('VERSION.txt', () => {
    let filename
    let version

    beforeAll(async () => {
      filename = 'VERSION.txt'
      version = await readFile(join(paths.dist, filename), 'utf8')
    })

    it('should contain the correct version', () => {
      expect(version).toEqual(pkg.version + EOL)
    })
  })
})
