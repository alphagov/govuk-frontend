import { compileStringAsync } from 'sass-embedded'

import { sassConfig } from './sass.config.js'

describe('All components', () => {
  let cssWithImport
  let cssWithUse

  beforeAll(async () => {
    const sass = `
      $govuk-suppressed-warnings: ("component-scss-files");
      @import "node_modules/govuk-frontend/src/govuk";
    `

    cssWithImport = (await compileStringAsync(sass, sassConfig)).css
  })

  beforeAll(async () => {
    const sass = `
      @use "node_modules/govuk-frontend/src/govuk" with (
        $govuk-suppressed-warnings: ("component-scss-files")
      );
    `

    cssWithUse = (await compileStringAsync(sass, sassConfig)).css
  })

  it('works when user @imports everything', () => {
    expect(cssWithImport).toMatchSnapshot()
  })

  it('outputs the same CSS with `@import` and `@use`', () => {
    expect(cssWithUse).toBe(cssWithImport)
  })
})
