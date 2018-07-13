/* eslint-env jest */

const { allComponents } = require('../../lib/file-helper')

const configPaths = require('../../config/paths.json')

// We can't use the render function from jest-helpers, because we need control
// over the nunjucks environment.
const nunjucks = require('nunjucks')

describe('When nunjucks is configured with a different base path', () => {
  beforeAll(() => {
    // Create a new Nunjucks environment that uses the src directory as its
    // base path, rather than the components folder itself
    nunjucks.configure(configPaths.src)
  })

  it.each(allComponents)(`render('%s') does not error`, (component) => {
    expect(() => {
      nunjucks.render(`components/${component}/template.njk`, {})
    }).not.toThrow()
  })
})
