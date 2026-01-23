import { readFile } from 'fs/promises'
import { join } from 'path'

import { paths, pkg } from '@govuk-frontend/config'
import { getListing } from '@govuk-frontend/lib/files'

describe('dist/', () => {
  let listingSourceAssets
  let listingDistAssets

  beforeAll(async () => {
    listingSourceAssets = await getListing('**/*', {
      cwd: join(paths.package, 'src/govuk/assets')
    })

    listingDistAssets = await getListing('**/*', {
      cwd: join(paths.root, 'dist/assets')
    })
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
      stylesheet = await readFile(join(paths.root, `dist/${filename}`), 'utf8')
    })

    it('should not contain current media query displayed on body element', () => {
      expect(stylesheet).not.toMatch(/body:before{content:/)
    })

    it('should not contain Sass variables', () => {
      expect(stylesheet).not.toContain('$govuk-')
    })

    it('should contain the copyright notice', () => {
      expect(stylesheet).toContain(
        '/*! Copyright (c) 2011 by Margaret Calvert & Henrik Kubel. All rights reserved. The font has been customised for exclusive use on gov.uk. This cut is not commercially available. */'
      )
    })

    it('should contain source mapping URL', () => {
      expect(stylesheet).toMatch(
        new RegExp(`/\\*# sourceMappingURL=${filename}.map \\*/\n$`)
      )
    })

    it('should contain CSS custom properties', () => {
      // GOV.UK Frontend version number
      expect(stylesheet).toContain(`--govuk-frontend-version:"${pkg.version}"`)

      // Breakpoints for `window.matchMedia()` in Header, Tabs components
      expect(stylesheet).toContain('--govuk-breakpoint-mobile:20rem')
      expect(stylesheet).toContain('--govuk-breakpoint-tablet:40.0625rem')
      expect(stylesheet).toContain('--govuk-breakpoint-desktop:48.0625rem')
    })
  })

  describe('govuk-frontend-[version].min.css.map', () => {
    let filename
    let sourcemap

    beforeAll(async () => {
      filename = `govuk-frontend-${pkg.version}.min.css.map`
      sourcemap = JSON.parse(
        await readFile(join(paths.root, `dist/${filename}`), 'utf8')
      )
    })

    it('should contain relative paths to sources', () => {
      expect(sourcemap.sources).toContain(
        '../packages/govuk-frontend/src/govuk/index.scss'
      )
      expect(sourcemap.sources).toContain(
        '../packages/govuk-frontend/src/govuk/custom-properties/_frontend-version.scss'
      )
    })
  })

  describe('govuk-frontend-[version].min.js', () => {
    let filename
    let javascript

    beforeAll(async () => {
      filename = `govuk-frontend-${pkg.version}.min.js`
      javascript = await readFile(join(paths.root, `dist/${filename}`), 'utf8')
    })

    it('should have the correct version name', () => {
      expect(javascript).toBeTruthy()
    })

    it('should contain correct version number', () => {
      expect(javascript).toContain(`const version="${pkg.version}"`)
    })

    it('should contain source mapping URL', () => {
      expect(javascript).toMatch(
        new RegExp(`//# sourceMappingURL=${filename}.map\n$`)
      )
    })
  })

  describe('govuk-frontend-[version].min.js.map', () => {
    let filename
    let sourcemap

    beforeAll(async () => {
      filename = `govuk-frontend-${pkg.version}.min.js.map`
      sourcemap = JSON.parse(
        await readFile(join(paths.root, `dist/${filename}`), 'utf8')
      )
    })

    it('should contain relative paths to sources', () => {
      expect(sourcemap.sources).toContain(
        '../packages/govuk-frontend/src/govuk/init.mjs'
      )
      expect(sourcemap.sources).toContain(
        '../packages/govuk-frontend/src/govuk/common/govuk-frontend-version.mjs'
      )
    })
  })

  describe('VERSION.txt', () => {
    let filename
    let version

    beforeAll(async () => {
      filename = 'VERSION.txt'
      version = await readFile(join(paths.root, `dist/${filename}`), 'utf8')
    })

    it('should contain the correct version', () => {
      expect(version).toBe(`${pkg.version}\n`)
    })
  })
})
