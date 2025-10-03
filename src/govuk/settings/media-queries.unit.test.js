const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { sassNull } = require('sass-embedded')

// Create a mock warn function that we can use to override the native @warn
// function, that we can make assertions about post-render.
const mockWarnFunction = jest.fn().mockReturnValue(sassNull)

const sassConfig = {
  logger: {
    warn: mockWarnFunction
  }
}

describe('$govuk-show-breakpoints', () => {
  it('throws a deprecation warning if set to `true`', async () => {
    const sass = `
        $govuk-show-breakpoints: true;
        @import "settings/media-queries";
      `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the deprecation notice
    expect(mockWarnFunction).toHaveBeenCalledWith(
      'The `$govuk-show-breakpoints` variable is deprecated and is non-operational. ' +
        'It will be removed in the next major version. To silence this warning, ' +
        'update $govuk-suppressed-warnings with key: "govuk-show-breakpoints"',
      expect.anything()
    )
  })
})
