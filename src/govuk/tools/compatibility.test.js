/* eslint-env jest */

const { renderSass } = require('../../lib/jest-helpers')

const sassConfig = {
  outputStyle: 'compressed'
}

describe('@mixin govuk-compatibility', () => {
  it('does not output if the app is not marked as included', async () => {
    const sass = `
      $_govuk-compatibility: (existing_app: false);

      @import "tools/compatibility";

      @include govuk-compatibility(existing_app) {
        .foo {
          color: red;
        }
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString()).toEqual('')
  })

  it('outputs if the app is not marked as included', async () => {
    const sass = `
      $_govuk-compatibility: (existing_app: true);

      @import "tools/compatibility";

      @include govuk-compatibility(existing_app) {
        .foo {
          color: red;
        }
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo{color:red}')
  })

  it('throws an exception if the app is not recognised', async () => {
    const sass = `
      $_govuk-compatibility: (existing_app: true);

      @import "tools/compatibility";

      @include govuk-compatibility(non_existent_app) {
        .foo {
          color: red;
        }
      }`

    await expect(renderSass({ data: sass, ...sassConfig }))
      .rejects
      .toThrow('Non existent product \'non_existent_app\'')
  })
})
