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
  const sassBootstrap = '@use "settings/warnings--internal";'

  it('Fires a @warn with the message plus the key suffix text', async () => {
    const sass = `
      ${sassBootstrap}
      @include warnings--internal.warning('test', 'This is a warning.');
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the test message
    expect(mockWarnFunction).toHaveBeenCalledWith(
      'This is a warning. To silence this warning, update ' +
        '$govuk-suppressed-warnings with key: "test"',
      expect.anything()
    )
  })

  it('Only fires one @warn per warning key', async () => {
    const sass = `
      ${sassBootstrap}
      @include warnings--internal.warning('test', 'This is a warning.');
      @include warnings--internal.warning('test', 'This is a warning.');
    `

    await compileSassString(sass, sassConfig)

    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the test message
    expect(mockWarnFunction.mock.calls).toHaveLength(1)
  })

  it('fires every @warn if $silence-further-warnings is false', async () => {
    const sass = `
      ${sassBootstrap}
      @include warnings--internal.warning('test', 'This is a warning.', $silence-further-warnings: false);
      @include warnings--internal.warning('test', 'This is a warning.');
    `

    await compileSassString(sass, sassConfig)

    expect(mockWarnFunction.mock.calls).toHaveLength(2)
  })

  it('Does not fire a @warn if the key is already in $govuk-suppressed-warnings', async () => {
    const sass = `
      @use "sass:list";
      @use "settings/warnings" as * with (
        $govuk-suppressed-warnings: ('test')
      );
      ${sassBootstrap}

      @include warnings--internal.warning('test', 'This is a warning.');
    `

    await compileSassString(sass, sassConfig)
    expect(mockWarnFunction).not.toHaveBeenCalled()
  })
})
