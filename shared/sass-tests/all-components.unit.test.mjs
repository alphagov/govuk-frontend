import { paths } from '@govuk-frontend/config'
import { compileStringAsync, NodePackageImporter } from 'sass-embedded'

/** @type {import('sass-embedded').StringOptions<"async">} */
const sassConfig = {
  loadPaths: [paths.root],
  quietDeps: true,
  silenceDeprecations: ['import', 'mixed-decls'],
  importers: [new NodePackageImporter()]
}

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

  it('works when user @uses everything', () => {
    expect(cssWithUse).toMatchSnapshot()
  })

  it('outputs the same CSS with `@import` and `@use`', () => {
    expect(cssWithUse).toBe(cssWithImport)
  })

  it('outputs the same CSS with a pkg url', () => {
    expect(cssWithPkg).toBe(cssWithUse)
  })
})
