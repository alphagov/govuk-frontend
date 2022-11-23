const sass = require('node-sass')

const { renderSass } = require('../../../lib/jest-helpers')

// Create a mock warn function that we can use to override the native @warn
// function, that we can make assertions about post-render.
const mockWarnFunction = jest.fn()
  .mockReturnValue(sass.NULL)

const sassConfig = {
  outputStyle: 'compressed',
  functions: {
    '@warn': mockWarnFunction
  }
}

describe('@mixin govuk-compatibility', () => {
  // Import the warning mixin
  const warningsImport = '@import "settings/warnings";'

  it('does not output if the app is not marked as included', async () => {
    const sass = `
      ${warningsImport}

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
      ${warningsImport}
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
      ${warningsImport}
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

  it('outputs a deprecation warning when called', async () => {
    const sass = `
      ${warningsImport}
      $_govuk-compatibility: (existing_app: true);

      @import "tools/compatibility";

      @include govuk-compatibility(existing_app) {
        .foo {
          color: red;
        }
      }`

    await renderSass({ data: sass, ...sassConfig }).then(() => {
      // Expect our mocked @warn function to have been called once with a single
      // argument, which should be the deprecation notice
      return expect(mockWarnFunction.mock.calls[0][0].getValue())
        .toEqual(
          'govuk-compatibility is deprecated. From version 5.0, GOV.UK Frontend ' +
          'will not support compatibility mode. To silence this warning, ' +
          'update $govuk-suppressed-warnings with key: "compatibility-helper"'
        )
    })
  })
})
