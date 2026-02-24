import { compileStringAsync } from 'sass-embedded'

import { sassConfig } from './sass.config.js'

describe('All components', () => {
  let cssWithImport
  let cssWithUse
  let cssWithPkg

  beforeAll(async () => {
    const sass = `
      @import "node_modules/govuk-frontend/dist/govuk";
    `

    cssWithImport = (await compileStringAsync(sass, sassConfig)).css
  })

  beforeAll(async () => {
    const sass = `
      @use "node_modules/govuk-frontend/dist/govuk";
    `

    cssWithUse = (await compileStringAsync(sass, sassConfig)).css
  })

  beforeAll(async () => {
    const sass = `
      @use "pkg:govuk-frontend"
    `

    cssWithPkg = (
      await compileStringAsync(sass, {
        ...sassConfig,
        loadPaths: null // Prevent loadPaths from interfering
      })
    ).css
  })

  it('works when user @imports everything', () => {
    expect(cssWithImport).toMatchSnapshot()
  })

  it('outputs the same CSS with `@import` and `@use`', () => {
    expect(cssWithUse).toBe(cssWithImport)
  })

  it('outputs the same CSS with a pkg url', () => {
    expect(cssWithPkg).toBe(cssWithUse)
  })
})
