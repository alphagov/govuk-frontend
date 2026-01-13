const { join } = require('path')

const { paths } = require('@govuk-frontend/config')
const { compileSassFile } = require('@govuk-frontend/helpers/tests')
const { getListing } = require('@govuk-frontend/lib/files')

describe('Components', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing('**/src/govuk/components/**/*.scss', {
      cwd: paths.package,
      ignore: ['**/_all.scss', '**/_index.scss']
    })
  })

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
    })

    it('renders CSS for each component', () => {
      const sassTasks = sassFiles.map((sassFilePath) => {
        const file = join(paths.package, sassFilePath)

        return expect(compileSassFile(file)).resolves.toMatchObject({
          css: expect.any(String),
          loadedUrls: expect.arrayContaining([expect.any(URL)])
        })
      })

      return Promise.all(sassTasks)
    })
  })
})
