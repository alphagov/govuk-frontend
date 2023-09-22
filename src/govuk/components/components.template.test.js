const { join } = require('path')

const { paths } = require('@govuk-frontend/config')
const {
  getComponentsFixtures,
  getComponentNames,
  nunjucksEnv,
  renderComponent
} = require('@govuk-frontend/lib/components')
const { HtmlValidate } = require('html-validate')

describe('Components', () => {
  let nunjucksEnvCustom
  let nunjucksEnvDefault

  let componentNames

  beforeAll(async () => {
    // Create a new Nunjucks environment that uses the `src/govuk` directory as
    // its first search path, rather than default to `src` (no 'govuk' prefix)
    nunjucksEnvCustom = nunjucksEnv([join(paths.package, 'src/govuk')])
    nunjucksEnvDefault = nunjucksEnv()

    // Components list
    componentNames = await getComponentNames()
  })

  describe('Nunjucks environment', () => {
    it('renders template for each component', () => {
      return Promise.all(
        componentNames.map(
          (componentName) =>
            expect(
              nunjucksEnvDefault.render(
                `govuk/components/${componentName}/template.njk`,
                {}
              )
            ).resolves
        )
      )
    })

    it('renders template for each component (different base path)', () => {
      return Promise.all(
        componentNames.map(
          (componentName) =>
            expect(
              nunjucksEnvCustom.render(
                `components/${componentName}/template.njk`,
                {}
              )
            ).resolves
        )
      )
    })
  })

  describe('Nunjucks HTML validation', () => {
    /** @type {HtmlValidate} */
    let validator

    beforeAll(() => {
      validator = new HtmlValidate({
        extends: ['html-validate:recommended'],
        rules: {
          // Allow for multiple buttons in the same form to have the same name
          // (as in the cookie banner examples)
          'form-dup-name': [
            'error',
            { shared: ['radio', 'checkbox', 'submit'] }
          ],

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

    it('renders valid HTML for each component example', async () => {
      const componentsFixtures = await getComponentsFixtures()

      // Validate component examples
      for (const { component: componentName, fixtures } of componentsFixtures) {
        const fixtureTasks = fixtures.map(
          async ({ name: exampleName, options }) => {
            const html = renderComponent(componentName, options)

            // Validate HTML
            return expect({
              componentName,
              exampleName,
              report: await validator.validateString(html)
            }).toEqual({
              componentName,
              exampleName,
              report: expect.objectContaining({ valid: true })
            })
          }
        )

        // Validate all component examples in parallel
        await Promise.all(fixtureTasks)
      }
    }, 30000)
  })
})