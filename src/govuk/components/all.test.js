/* eslint-env jest */

const { allComponents } = require('../../../lib/file-helper')
const { renderSass } = require('../../../lib/jest-helpers')

const configPaths = require('../../../config/paths.json')

const fs = require('fs')
const path = require('path')

// We can't use the render function from jest-helpers, because we need control
// over the nunjucks environment.
const nunjucks = require('nunjucks')
const yamlToJson = require('js-yaml')

describe('When nunjucks is configured with a different base path', () => {
  beforeAll(() => {
    // Create a new Nunjucks environment that uses the src directory as its
    // base path, rather than the components folder itself
    nunjucks.configure(configPaths.src)
  })

  it.each(allComponents)('render(\'%s\') does not error', (component) => {
    expect(() => {
      nunjucks.render(`components/${component}/template.njk`, {})
    }).not.toThrow()
  })
})

it('_all.scss renders to CSS without errors', () => {
  return renderSass({
    file: `${configPaths.src}/components/_all.scss`
  })
})

it.each(allComponents)('%s.scss renders to CSS without errors', (component) => {
  return renderSass({
    file: `${configPaths.src}/components/${component}/_${component}.scss`
  })
})

it.each(allComponents)('%s has valid YAML', (component) => {
  const componentYAML = loadYAML(component)
  const expectedObject = convertToExpectation(componentYAML.params)

  componentYAML.examples.forEach(example => {
    expect(example.data).toMatchObject(expectedObject)
  })
})

function convertToExpectation (params) {
  const expectedObject = {}

  params.forEach(param => {
    if (param.required && !isHtmlOrText(param.name)) {
      switch (param.type) {
        case 'object':
          if (!param.isComponent) {
            expectedObject[param.name] = convertToExpectation(param.params)
          }
          break
        case 'boolean':
          expectedObject[param.name] = expect.any(Boolean)
          break
        case 'string':
          expectedObject[param.name] = expect.any(String)
          break
      }
    }
  })

  return expect.objectContaining(expectedObject)
}

function isHtmlOrText (name) {
  return ['html', 'text'].includes(name.substr('-4').toLowerCase())
}

function loadYAML (component) {
  const filePath = path.resolve(__dirname, `./${component}/${component}.yaml`)
  let yaml

  try {
    yaml = fs.readFileSync(filePath, { encoding: 'utf8', json: true })
  } catch (e) {
    console.error('ENOENT: no such file or directory: ', filePath)
  }

  if (yaml) {
    return yamlToJson.safeLoad(yaml)
  }

  return false;
}
