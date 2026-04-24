const { globSync } = require('fs')
const { join, basename } = require('path')

const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { sassNull } = require('sass-embedded')
const { default: slash } = require('slash')
const stylelint = require('stylelint')

// Grab the list of components synchronously so we can create
// individual test suites for each of them
const componentFolders = globSync(`${slash(__dirname)}/*`, {
  exclude: ['**/*.*']
})

describe('Components', () => {
  describe('Sass render', () => {
    describe('all components', () => {
      describe.each([
        [
          'import',
          `
          @import "base";
          @import "components";
        `
        ],
        ['use', `@use "components" as *;`]
      ])('with `@%s`', (type, sass) => {
        let css

        beforeAll(async () => {
          css = (await compileSassString(sass)).css
        })

        it('outputs the custom properties only once', () => {
          const occurrences = css.matchAll(/--govuk-breakpoint-mobile/g)

          expect(Array.from(occurrences)).toHaveLength(1)
        })

        it('does not use custom properties in shorthand properties', async () => {
          // Use a list of allowed properties rather than disallowed ones
          // to catch new uses and explicitly allow them, rather than
          // risk problematic future uses implicitly be accepted
          const allowedProperties = ['--value', 'box-shadow']

          await require('postcss')({
            postcssPlugin: 'govuk-frontend-var-in-shorthands',
            Declaration(declaration) {
              // Find out if the value includes a CSS variable that is not the entire value
              // Test first for `var(` to avoid running regex unnecessarily
              if (
                declaration.value.includes('var(') &&
                !declaration.value.match(/^var\(.*?\)$/)
              ) {
                // If it does, error unless we allow custom properties for that property
                if (!allowedProperties.includes(declaration.prop)) {
                  throw new Error(
                    `\`${declaration.prop}: ${declaration.value}\` includes a custom property as part of its value`
                  )
                }
              }
            }
          }).process(css, {
            // Avoid PostCSS complaining about lacking a `from` option to locate a Browserslist file
            // as we don't care about Browser support here, just parsing syntax
            from: undefined
          })
        })

        it('does not reference any undefined custom properties', async () => {
          const linter = await stylelint.lint({
            config: { rules: { 'no-unknown-custom-properties': true } },
            code: css
          })

          // Output stylelint warnings to make debugging easier
          if (linter.results[0].warnings.length) {
            console.log(
              'Warnings were present when testing all components for unknown custom properties:'
            )
            console.log(linter.results[0].warnings)
          }

          return expect(linter.results[0].warnings).toHaveLength(0)
        })
      })
    })

    describe.each(componentFolders)('%s', (componentFolder) => {
      const componentName = basename(componentFolder)

      describe('_index.scss', () => {
        const sassPath = join(componentFolder, '_index.scss')
        const sassUrl = `file:${slash(sassPath)}`

        describe.each([
          [
            'import',
            `
            @import "base";
            @import "${sassUrl}";
          `
          ],
          ['use', `@use "${sassUrl}" as *;`]
        ])('with `@%s`', (type, sass) => {
          let css

          beforeAll(async () => {
            css = (
              await compileSassString(`
              ${sass}
              :root {
                --value: #{govuk-functional-colour(brand)}
              }
            `)
            ).css
          })

          it("includes the component's CSS", () => {
            expect(css).toContain(`.govuk-${componentName}`)
          })

          it('renders the custom properties used by the component', async () => {
            const linter = await stylelint.lint({
              config: { rules: { 'no-unknown-custom-properties': true } },
              code: css
            })

            // Output stylelint warnings to make debugging easier
            if (linter.results[0].warnings.length) {
              console.log(
                `Warnings were present when testing ${sassPath} for unknown custom properties:`
              )
              console.log(linter.results[0].warnings)
            }

            return expect(linter.results[0].warnings).toHaveLength(0)
          })
        })
      })

      describe(`_${componentName}.scss`, () => {
        const sassPath = join(componentFolder, `_${componentName}.scss`)
        const sassUrl = `file:${slash(sassPath)}`

        let css

        let sassConfig
        let warnCalls

        beforeAll(async () => {
          const sass = `
            // Mock a deprecation warning having been triggered by another component
            // to ensure each component will output a deprecation warning rather than
            // force developers to chase them one by one
            @use 'settings/warnings--internal';
            @include warnings--internal.component-scss-file-warning(mock-component);

            // Sass works using URLs not paths, so we need (particularly for windows):
            // 1. the 'file:' protocol to make this a URL
            // 2. to turn any backslash into forward slash
            @import "${sassUrl}";
          `

          // Create a mock warn function that we can use to override the native @warn
          // function, that we can make assertions about post-render.
          const mockWarnFunction = jest.fn().mockReturnValue(sassNull)

          sassConfig = {
            logger: {
              warn: mockWarnFunction
            }
          }

          const compilationResult = await compileSassString(sass, sassConfig)
          css = compilationResult.css

          // Mocks are reset
          warnCalls = mockWarnFunction.mock.calls
        })

        it("includes the component's CSS", () => {
          expect(css).toContain(`.govuk-${componentName}`)
        })

        it('renders the custom properties used by the component', async () => {
          const linter = await stylelint.lint({
            config: { rules: { 'no-unknown-custom-properties': true } },
            code: css
          })

          // Output stylelint warnings to make debugging easier
          if (linter.results[0].warnings.length) {
            console.log(
              `Warnings were present when testing ${sassPath} for unknown custom properties:`
            )
            console.log(linter.results[0].warnings)
          }

          return expect(linter.results[0].warnings).toHaveLength(0)
        })

        it('logs a deprecation warning when imported', () => {
          const warningText =
            `Importing \`<PATH_TO_GOVUK_FRONTEND>/components/${componentName}/${componentName}\` is deprecated.` +
            ` Import \`<PATH_TO_GOVUK_FRONTEND>/components/${componentName}\` instead.` +
            ' To silence this warning, update $govuk-suppressed-warnings with key: "component-scss-files"'

          // Calls to `warn` are registered as arrays with one item per call
          // As there may be other calls to warn, but we're not interested in those,
          // we'll use `arrayContaining` for a partial comparison of the list of calls
          expect(warnCalls).toEqual(
            expect.arrayContaining([[warningText, expect.anything()]])
          )
        })
      })
    })

    describe('component variables', () => {
      // Map the user-configurable button colours to some test values
      const buttonColours = [
        {
          variable: '$govuk-button-background-colour',
          value: '#112233'
        },
        {
          variable: '$govuk-button-text-colour',
          value: '#445566'
        },
        {
          variable: '$govuk-inverse-button-background-colour',
          value: '#778899'
        },
        {
          variable: '$govuk-inverse-button-text-colour',
          value: '#aabbcc'
        }
      ]

      const useConfiguration = buttonColours
        .map(({ variable, value }) => `${variable}: ${value}`)
        .join(',\n')

      const importDeclarations = buttonColours
        .map(({ variable, value }) => `${variable}: ${value};`)
        .join('\n')

      const sassSources = {
        'with `@use` including the whole of GOV.UK Frontend': `
            @use "index" with (
              ${useConfiguration}
            );
          `,
        'with `@import` including the whole of GOV.UK Frontend': `
            ${importDeclarations}
            @import "index";
          `,
        'with `@use` including the components layer': `
            @use "base" with (
              ${useConfiguration}
            );
            @use "components";
          `,
        'with `@import` including the components layer': `
            ${importDeclarations}
            @import "components";
          `,
        'with `@use` including the individual button file': `
            @use "base" with (
              ${useConfiguration}
            );
            @use "components/button";
          `,
        'with `@import` including the individual button file': `
            ${importDeclarations}
            @import "components/button";
          `
      }

      describe.each(Object.entries(sassSources))('%s', (_, sass) => {
        let css

        beforeAll(async () => {
          css = (await compileSassString(sass)).css
        })

        it.each(buttonColours)(
          'uses the configured value for $variable',
          ({ value }) => {
            expect(css).toContain(value)
          }
        )
      })
    })
  })
})
