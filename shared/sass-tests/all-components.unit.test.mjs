import { paths } from '@govuk-frontend/config'
import { compileStringAsync } from 'sass-embedded'

/** @type {import('sass-embedded').StringOptions<"async">} */
const sassConfig = {
  loadPaths: [paths.root],
  quietDeps: true,
  silenceDeprecations: ['import', 'mixed-decls']
}

describe('All components', () => {
  let cssWithImport
  let cssWithUse

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

  it('works when user @imports everything', () => {
    expect(cssWithImport).toMatchSnapshot()
  })

  it('works when user @uses everything', () => {
    expect(cssWithUse).toMatchSnapshot()
  })

  it('outputs the same CSS with `@import` and `@use`', () => {
    expect(cssWithUse).toBe(cssWithImport)
  })
})
