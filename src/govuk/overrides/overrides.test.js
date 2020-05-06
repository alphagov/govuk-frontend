/* eslint-env jest */

const sass = require('node-sass')

const glob = require('glob')
const { renderSass } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths.json')

const sassFiles = glob.sync(`${configPaths.src}/overrides/**/*.scss`)

it.each(sassFiles)('%s renders with a deprecation warning', (file) => {
  // Create a mock warn function that we can use to override the native @warn
  // function, that we can make assertions about post-render.
  const mockWarnFunction = jest.fn()
    .mockReturnValue(sass.NULL)

  return renderSass({
    file: file,
    functions: {
      '@warn': mockWarnFunction
    }
  }).then(() => {
    // Expect our mocked @warn function to have been called once with a single
    // argument, which should be the deprecation notice
    return expect(mockWarnFunction.mock.calls[0][0].getValue())
      .toEqual(
        'Importing items from the overrides layer without first importing ' +
        '`base` is deprecated, and will no longer work as of GOV.UK Frontend v4.0.'
      )
  })
})
