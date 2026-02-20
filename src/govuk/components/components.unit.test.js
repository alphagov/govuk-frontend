const { globSync } = require('fs')
const { join, basename } = require('path')

const { paths } = require('@govuk-frontend/config')
const { compileSassFile } = require('@govuk-frontend/helpers/tests')
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
      let sassCompilationResult

      beforeAll(async () => {
        const source = join(paths.package, 'src/govuk/components/_index.scss')
        sassCompilationResult = await compileSassFile(source)
      })

      it('renders CSS for all components', () => {
        return expect(sassCompilationResult).toMatchObject({
          css: expect.any(String),
          loadedUrls: expect.arrayContaining([expect.any(URL)])
        })
      })

      it('does not use custom properties in shorthand properties', async () => {
        const { css } = sassCompilationResult

        // Use a list of allowed properties rather than disallowed ones
        // to catch new uses and explicitly allow them, rather than
        // risk problematic future uses implicitly be accepted
        const allowedProperties = ['box-shadow']

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
          code: sassCompilationResult.css
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

    describe.each(componentFolders)('%s', (componentFolder) => {
      const componentName = basename(componentFolder)

      describe('_index.scss', () => {
        let css
        let sassPath

        beforeAll(async () => {
          sassPath = join(componentFolder, '_index.scss')

          css = (await compileSassFile(sassPath)).css
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

      describe(`_${componentName}.scss`, () => {
        let css
        let sassPath

        beforeAll(async () => {
          sassPath = join(componentFolder, `_${componentName}.scss`)

          css = (await compileSassFile(sassPath)).css
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
  })
})
