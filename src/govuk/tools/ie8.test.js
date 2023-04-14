const helpers = require('govuk-frontend-helpers')
const { outdent } = require('outdent')
const { sassNull } = require('sass-embedded')

const { compileSassString } = helpers.tests

// Create a mock warn function that we can use to override the native @warn
// function, that we can make assertions about post-render.
const mockWarnFunction = jest.fn()
  .mockReturnValue(sassNull)

const sassConfig = {
  logger: {
    warn: mockWarnFunction
  }
}

describe('@mixin govuk-if-ie8', () => {
  it('outputs @content when $govuk-is-ie8 is true', async () => {
    const sass = `
      $govuk-is-ie8: true;
      @import "tools/ie8";

      @include govuk-if-ie8 {
        .foo {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            color: red;
          }
        `
      })
  })

  it('does not output @content when $govuk-is-ie8 is false', async () => {
    const sass = `
      $govuk-is-ie8: false;
      @import "tools/ie8";

      @include govuk-if-ie8 {
        .foo {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({ css: '' })
  })

  it('emits a deprecation warning when called', async () => {
    const sass = `
      @import "settings/ie8";
      @import "tools/ie8";

      @include govuk-if-ie8 {
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
        'The govuk-if-ie8 mixin is deprecated and will be removed in v5.0. To ' +
        'silence this warning, update $govuk-suppressed-warnings with key: "ie8"'
      ]))
  })
})

describe('@mixin govuk-not-ie8', () => {
  it('outputs @content when $govuk-is-ie8 is false', async () => {
    const sass = `
      $govuk-is-ie8: false;
      @import "tools/ie8";

      @include govuk-not-ie8 {
        .foo {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({
        css: outdent`
          .foo {
            color: red;
          }
        `
      })
  })

  it('does not output @content when $govuk-is-ie8 is true', async () => {
    const sass = `
      $govuk-is-ie8: true;
      @import "tools/ie8";

      @include govuk-not-ie8 {
        .foo {
          color: red;
        }
      }
    `

    await expect(compileSassString(sass, sassConfig))
      .resolves
      .toMatchObject({ css: '' })
  })

  it('emits a deprecation warning when called', async () => {
    const sass = `
      @import "settings/ie8";
      @import "tools/ie8";

      @include govuk-not-ie8 {
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
        'The govuk-not-ie8 mixin is deprecated and will be removed in v5.0. To ' +
        'silence this warning, update $govuk-suppressed-warnings with key: "ie8"'
      ]))
  })
})
