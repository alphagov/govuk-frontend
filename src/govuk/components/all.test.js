/* eslint-env jest */

require('html-validate/jest')

const { allComponents, getComponentData } = require('../../../lib/file-helper')
const { renderSass, render } = require('../../../lib/jest-helpers')

const configPaths = require('../../../config/paths.json')

const PORT = configPaths.ports.test
const baseUrl = 'http://localhost:' + PORT

const percySnapshot = require('@percy/puppeteer')

// We can't use the render function from jest-helpers, because we need control
// over the nunjucks environment.
const nunjucks = require('nunjucks')

describe('When nunjucks is configured with a different base path', () => {
  let nunjucksEnv

  beforeAll(() => {
    // Create a new Nunjucks environment that uses the src directory as its
    // base path, rather than the components folder itself
    nunjucksEnv = nunjucks.configure(configPaths.src)
  })

  it.each(allComponents)('render(\'%s\') does not error', (component) => {
    expect(() => {
      nunjucksEnv.render(`components/${component}/template.njk`, {})
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

it.each(allComponents)('generate screenshots for Percy visual regression, with JavaScript disabled', async (component) => {
  await page.setJavaScriptEnabled(false)
  await page.goto(baseUrl + '/components/' + component + '/preview', { waitUntil: 'load' })
  await percySnapshot(page, 'no-js: ' + component)
})

it.each(allComponents)('generate screenshots for Percy visual regression, with JavaScript enabled', async (component) => {
  await page.setJavaScriptEnabled(true)
  await page.goto(baseUrl + '/components/' + component + '/preview', { waitUntil: 'load' })
  await percySnapshot(page, 'js: ' + component)
})

describe.each(allComponents)('%s', (component) => {
  describe('examples output valid HTML', () => {
    const examples = getComponentData(component).examples.map(function (example) {
      return [example.name, example.data]
    })

    it.each(examples)('example "%s" outputs valid HTML', async (_, data) => {
      const $ = render(component, data)

      expect($.html()).toHTMLValidate({
        rules: {
          // We don't use boolean attributes consistently – buttons currently
          // use disabled="disabled"
          'attribute-boolean-style': 'off',

          'input-attributes': 'off',
          'no-conditional-comment': 'off',
          'no-inline-style': 'off',
          'no-redundant-role': 'off',
          'no-trailing-whitespace': 'off',
          'prefer-button': 'off',
          'prefer-native-element': 'off',
          'text-content': 'off',
          'valid-id': 'off',
          'wcag/h30': 'off',
          'wcag/h71': 'off'
        },
        elements: [
          'html5',
          {
            // Allow textarea autocomplete attribute to be street-address
            // (html-validate only allows on/off in default rules)
            textarea: {
              attributes: {
                autocomplete: { enum: ['on', 'off', 'street-address'] }
              }
            },
            // Allow buttons to omit the type attribute (defaults to 'submit')
            button: {
              attributes: {
                type: { required: false }
              }
            }
          }
        ]
      })
    })
  })
})
