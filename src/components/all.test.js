/* eslint-env jest */

const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile)

const { allComponents, getComponentData, getParamNames, getNestedComponents, flatten } = require('../../lib/file-helper')
const { getTemplate, extractVariablesFromTemplate } = require('../../lib/nunjucks-helper')

const configPaths = require('../../config/paths.json')

// We can't use the render function from jest-helpers, because we need control
// over the nunjucks environment.
const nunjucks = require('nunjucks')
let env = null

describe('When nunjucks is configured with a different base path', () => {
  beforeAll(() => {
    // Create a new Nunjucks environment that uses the src directory as its
    // base path, rather than the components folder itself
    env = nunjucks.configure(configPaths.src)
  })

  it.each(allComponents)(`render('%s') does not error`, (component) => {
    expect(() => {
      nunjucks.render(`components/${component}/template.njk`, {})
    }).not.toThrow()
  })

  describe.each(allComponents)(`%s definition`, (component) => {

    const params = flatten(getComponentData(component).params)

    params.forEach(param => {
      describe(param.name, () => {
        it('has a valid type', () => {
          expect(param.type).toMatch(/array|boolean|integer|nunjucks-block|object|string/)
        })

        it('has a description', () => {
          expect(param.description).not.toBeFalsy()
        })
      })
    })
  })

  it.each(allComponents)(`%s parameters match their definition`, async (component) => {
    const variables = extractVariablesFromTemplate(getTemplate(component))
    const params = getComponentData(component).params

    // Ignore any variables that are part of other nested components
    const nestedComponents = getNestedComponents(params)
    const filteredVars = variables.filter(
      thisVar => !nestedComponents.some(component => thisVar.startsWith(`${component}.`))
    )

    const expectedParamNames = getParamNames(params)

    expect(filteredVars).toEqual(expectedParamNames)
  })
})
