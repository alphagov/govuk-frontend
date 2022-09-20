/**
 * @jest-environment puppeteer
 */

const { fetch } = require('undici')
const { WebSocket } = require('ws')
require('html-validate/jest')

const { allComponents, getComponentData } = require('../../../lib/file-helper')
const { renderSass, renderHtml } = require('../../../lib/jest-helpers')

const configPaths = require('../../../config/paths.js')

const PORT = configPaths.ports.test
const baseUrl = 'http://localhost:' + PORT

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

describe.each(allComponents)('%s', (component) => {
  let percySnapshot

  beforeAll(() => {
    // Polyfill fetch() detection, upload via WebSocket()
    // Fixes Percy running in a non-browser environment
    global.window = { fetch, WebSocket }
    percySnapshot = require('@percy/puppeteer')
  })

  it(`${component}.scss renders to CSS without errors`, () => {
    return renderSass({
      file: `${configPaths.src}/components/${component}/_${component}.scss`
    })
  })

  it('generate screenshots for Percy visual regression, with JavaScript disabled', async () => {
    await page.setJavaScriptEnabled(false)
    await page.goto(baseUrl + '/components/' + component + '/preview', { waitUntil: 'load' })
    await percySnapshot(page, 'no-js: ' + component)
  })

  it('generate screenshots for Percy visual regression, with JavaScript enabled', async () => {
    await page.setJavaScriptEnabled(true)
    await page.goto(baseUrl + '/components/' + component + '/preview', { waitUntil: 'load' })
    await percySnapshot(page, 'js: ' + component)
  })

  describe('examples output valid HTML', () => {
    const examples = getComponentData(component).examples.map(function (example) {
      return [example.name, example.data]
    })

    it.each(examples)('example "%s" outputs valid HTML', async (_, data) => {
      expect(renderHtml(component, data)).toHTMLValidate({
        rules: {
          // We don't use boolean attributes consistently – buttons currently
          // use disabled="disabled"
          'attribute-boolean-style': 'off',

          // Allow pattern attribute on input type="number"
          'input-attributes': 'off',

          // Allow for conditional comments (used in header for fallback png)
          'no-conditional-comment': 'off',

          // Allow inline styles for testing purposes
          'no-inline-style': 'off',

          // Allow for explicit roles on regions that have implict roles
          // We do this to better support AT with older versions of IE that
          // have partial support for HTML5 semantic elements
          'no-redundant-role': 'off',

          // More hassle than it's worth 👾
          'no-trailing-whitespace': 'off',

          // We still support creating `input type=button` with the button
          // component, but you have to explicitly choose to use them over
          // buttons
          'prefer-button': 'off',

          // Allow use of roles where there are native elements that would give
          // us that role automatically, e.g. <section> instead of
          // <div role="region">
          //
          // This is mainly needed for links styled as buttons, but we do this
          // in the cookie banner and notification banner too
          'prefer-native-element': 'off',

          // HTML Validate is opinionated about IDs beginning with a letter and
          // only containing letters, numbers, underscores and dashes – which is
          // more restrictive than the spec allows.
          //
          // Relax the rule to allow anything that is valid according to the
          // spec.
          'valid-id': ['error', { relaxed: true }]
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
