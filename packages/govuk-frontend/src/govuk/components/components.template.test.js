const { join } = require('path')

const { paths } = require('@govuk-frontend/config')
const {
  getComponentsFixtures,
  getComponentNames,
  nunjucksEnv,
  render
} = require('@govuk-frontend/lib/components')
const validatorConfig = require('govuk-frontend/.htmlvalidate.js')
const { HtmlValidate } = require('html-validate')
const { outdent } = require('outdent')

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
    const validator = new HtmlValidate(validatorConfig)

    it('renders valid HTML for each component example', async () => {
      const componentsFixtures = await getComponentsFixtures()

      // Validate component examples
      for (const { component: componentName, fixtures } of componentsFixtures) {
        const fixtureTasks = fixtures.map(async (fixture) => {
          const html = outdent`
            ${render(componentName, {
              context: fixture.options,
              fixture
            })}

            <!--
              Target for references in examples (e.g. aria-controls)
              https://html-validate.org/rules/no-missing-references.html
            -->
            <div id="test-target-element"></div>
          `

          // Validate HTML
          return expect({
            componentName,
            exampleName: fixture.name,
            report: await validator.validateString(html)
          }).toEqual({
            componentName,
            exampleName: fixture.name,
            report: expect.objectContaining({ valid: true })
          })
        })

        // Validate all component examples in parallel
        await Promise.all(fixtureTasks)
      }
    }, 30000)
  })
})
