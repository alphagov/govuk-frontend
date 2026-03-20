import { compileSassStringLikeUsers } from './helpers/sass.js'

describe('All components, with configuration', () => {
  let cssWithImport
  let cssWithUse

  beforeAll(async () => {
    const sass = `
      $govuk-functional-colours: (brand: hotpink);
      @import "pkg:@govuk-frontend/helpers/assets-urls";

      $govuk-font-url-function: 'fonts-url';

      @import "node_modules/govuk-frontend/src/govuk";
    `

    cssWithImport = await compileSassStringLikeUsers(sass)
  })

  beforeAll(async () => {
    const sass = `
      @use "sass:meta";
      @use "pkg:@govuk-frontend/helpers/assets-urls";

      @use "node_modules/govuk-frontend/src/govuk" with (
        $govuk-functional-colours: (brand: hotpink),
        $govuk-font-url-function: meta.get-function("fonts-url", $module: "assets-urls")
      );
    `

    cssWithUse = await compileSassStringLikeUsers(sass)
  })

  it('works when user @imports everything with configuration', async () => {
    expect(cssWithImport).toMatchSnapshot()
  })

  it('outputs the same CSS with `@import` and `@use`', () => {
    expect(cssWithUse).toBe(cssWithImport)
  })
})
