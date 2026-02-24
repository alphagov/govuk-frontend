import { compileStringAsync } from 'sass-embedded'

import { sassConfig } from './sass.config.js'

describe('All components, with configuration', () => {
  let cssWithImport
  let cssWithUse

  beforeAll(async () => {
    const sass = `
      $govuk-functional-colours: (brand: hotpink);
      @import "./assets-urls";

      $govuk-font-url-function: 'fonts-url';

      @import "node_modules/govuk-frontend/dist/govuk";
    `

    cssWithImport = (await compileStringAsync(sass, sassConfig)).css
  })

  beforeAll(async () => {
    const sass = `
      @use "sass:meta";
      @use "./assets-urls";

      @use "node_modules/govuk-frontend/dist/govuk" with (
        $govuk-functional-colours: (brand: hotpink),
        $govuk-font-url-function: meta.get-function("fonts-url", $module: "assets-urls")
      );
    `

    cssWithUse = (await compileStringAsync(sass, sassConfig)).css
  })

  it('works when user @imports everything with configuration', async () => {
    expect(cssWithImport).toMatchSnapshot()
  })

  it('works when user @uses everything with configuration', async () => {
    expect(cssWithUse).toMatchSnapshot()
  })

  it('outputs the same CSS with `@import` and `@use`', () => {
    expect(cssWithUse).toBe(cssWithImport)
  })
})
