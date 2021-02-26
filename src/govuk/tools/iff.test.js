/* eslint-env jest */
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

describe('@function iff', () => {
  it('outputs if the condition is truthy', async () => {
    const sass = `
      @import 'tools/iff';

      .foo {
        color: red iff(true, !important);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo{color:red !important}')
  })

  it('does not output if the condition is falsey', async () => {
    const sass = `
      @import 'tools/iff';

      .foo {
        color: red iff(false, !important);
      }`

    const results = await renderSass({ data: sass, ...sassConfig })

    expect(results.css.toString().trim()).toBe('.foo{color:red}')
  })

  it('outputs a deprecation warning when called', () => {
    const sass = `
      @import 'tools/iff';

      .foo {
        color: red iff(true, !important);
      }`

    return renderSass({ data: sass, ...sassConfig }).then(() => {
      // Expect our mocked @warn function to have been called once with a single
      // argument, which should be the deprecation notice
      return expect(mockWarnFunction.mock.calls[0][0].getValue())
        .toEqual(
          'The `iff` function will be removed in a future release, ' +
          'use `if($condition, $if-true, null);` instead.'
        )
    })
  })
})
