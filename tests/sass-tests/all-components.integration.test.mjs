import { compileSassStringLikeUsers, sassConfig } from './helpers/sass.js'

describe('All components', () => {
  let cssWithImport
  let cssWithUse
  let cssWithPkg

  beforeAll(async () => {
    const sass = `
      @import "node_modules/govuk-frontend/src/govuk";
    `

    cssWithImport = await compileSassStringLikeUsers(sass)
  })

  beforeAll(async () => {
    const sass = `
      @use "node_modules/govuk-frontend/src/govuk";
    `

    cssWithUse = await compileSassStringLikeUsers(sass)
  })

  beforeAll(async () => {
    const sass = `
      @use "pkg:govuk-frontend"
    `

    cssWithPkg = await compileSassStringLikeUsers(sass, {
      ...sassConfig,
      loadPaths: null // Prevent loadPaths from interfering
    })
  })

  it('works when user @imports everything', () => {
    expect(cssWithImport).toMatchSnapshot()
  })

  it('outputs the same CSS with `@import` and `@use`', () => {
    expect(cssWithUse).toBe(cssWithImport)
  })

  it('outputs the same CSS with a pkg url', async () => {
    const sass = `
      @use "node_modules/govuk-frontend/dist/govuk";
    `

    const css = await compileSassStringLikeUsers(sass)

    expect(css).toBe(cssWithPkg)
  })
})
