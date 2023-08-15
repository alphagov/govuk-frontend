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

describe('Warnings mixin', () => {
  const sassBootstrap = '@import "settings/warnings";'

  it('Fires a @warn with the message plus the key suffix text', async () => {
    const sass = `
      ${sassBootstrap}
      @include _warning('test', 'This is a warning.');
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the test message
    expect(mockWarnFunction.mock.calls[0]).toEqual(
      expect.arrayContaining([
        'This is a warning. To silence this warning, update ' +
          '$govuk-suppressed-warnings with key: "test"'
      ])
    )
  })

  it('Only fires one @warn per warning key', async () => {
    const sass = `
      ${sassBootstrap}
      @include _warning('test', 'This is a warning.');
      @include _warning('test', 'This is a warning.');
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the test message
    expect(mockWarnFunction.mock.calls.length).toEqual(1)
  })

  it('Does not fire a @warn if the key is already in $govuk-suppressed-warnings', async () => {
    const sass = `
      ${sassBootstrap}

      $govuk-suppressed-warnings: append($govuk-suppressed-warnings, 'test');
      @include _warning('test', 'This is a warning.');
    `

    await compileSassString(sass, sassConfig)
    expect(mockWarnFunction).not.toHaveBeenCalled()
  })
})
