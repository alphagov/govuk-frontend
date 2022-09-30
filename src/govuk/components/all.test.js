/**
 * @jest-environment puppeteer
 */

const { fetch } = require('undici')
const { WebSocket } = require('ws')
require('html-validate/jest')

const { allComponents, getComponentData } = require('../../../lib/file-helper')
const { nunjucksEnv, renderSass, renderHtml } = require('../../../lib/jest-helpers')

const configPaths = require('../../../config/paths.js')

const PORT = configPaths.ports.test
const baseUrl = 'http://localhost:' + PORT

// We can't use the render function from jest-helpers, because we need control
// over the nunjucks environment.
const nunjucks = require('nunjucks')

describe('Nunjucks render', () => {
  let nunjucksEnvCustom
  let nunjucksEnvDefault

  beforeAll(() => {
    // Create a new Nunjucks environment that uses the src directory as its
    // base path, rather than the components folder itself
    nunjucksEnvCustom = nunjucks.configure(configPaths.src)
    nunjucksEnvDefault = nunjucksEnv
  })

  describe('Environments', () => {
    it('renders template for each component', () => {
      return Promise.all(allComponents.map((component) =>
        expect(nunjucksEnvDefault.render(`${component}/template.njk`, {})).resolves
      ))
    })

    it('renders template for each component (different base path)', () => {
      return Promise.all(allComponents.map((component) =>
        expect(nunjucksEnvCustom.render(`components/${component}/template.njk`, {})).resolves
      ))
    })
  })
})

describe('Sass render', () => {
  it('renders CSS for all components', () => {
    const file = `${configPaths.src}/components/_all.scss`

    return expect(renderSass({ file })).resolves.toEqual(
      expect.objectContaining({
        css: expect.any(Object),
        stats: expect.any(Object)
      })
    )
  })

  it('renders CSS for each component', () => {
    const sassTasks = allComponents.map((component) => {
      const file = `${configPaths.src}/components/${component}/_${component}.scss`

      return expect(renderSass({ file })).resolves.toEqual(
        expect.objectContaining({
          css: expect.any(Object),
          stats: expect.any(Object)
        })
      )
    })

    return Promise.all(sassTasks)
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
})

describe('HTML validation', () => {
  it('renders valid HTML for each component example', () => {
    const componentTasks = allComponents.map(async (component) => {
      const { examples } = await getComponentData(component)

      // Loop through component examples
      const exampleTasks = examples.map(async ({ data }) => {
        const html = renderHtml(component, data)

        // Validate HTML
        return expect(html).toHTMLValidate({
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

      // Validate all component examples in parallel
      return Promise.all(exampleTasks)
    })

    // Check all components in parallel
    return Promise.all(componentTasks)
  }, 30000)
})
