const { compileSassString } = require('govuk-frontend-helpers/tests')
const { outdent } = require('outdent')
const { sassNull } = require('sass-embedded')

// Create a mock warn function that we can use to override the native @warn
// function, that we can make assertions about post-render.
const mockWarnFunction = jest.fn()
  .mockReturnValue(sassNull)

const sassConfig = {
  logger: {
    warn: mockWarnFunction
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
      }
    `

    await expect(compileSassString(sass))
      .resolves
      .toMatchObject({ css: '' })
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
      }
    `

    await expect(compileSassString(sass))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            color: red;
          }
        `
      })
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
      }
    `

    await expect(compileSassString(sass, sassConfig))
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
      }
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the deprecation notice
    expect(mockWarnFunction.mock.calls[0])
      .toEqual(expect.arrayContaining([
        'govuk-compatibility is deprecated. From version 5.0, GOV.UK Frontend ' +
        'will not support compatibility mode. To silence this warning, ' +
        'update $govuk-suppressed-warnings with key: "compatibility-helper"'
      ]))
  })
})
