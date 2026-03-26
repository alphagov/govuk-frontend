const { readFile } = require('fs/promises')
const { join } = require('path')

const { paths } = require('@govuk-frontend/config')
const {
  compileSassFile,
  compileSassString,
  getSassPathsFromLayer
} = require('@govuk-frontend/helpers/tests')
const sassdoc = require('sassdoc')
const stylelint = require('stylelint')

const partials = getSassPathsFromLayer('core')

describe('The core layer', () => {
  it('has an import-only file for the `index`', async () => {
    const importOnlyPath = join(
      paths.package,
      'src/govuk/settings/_index.import.scss'
    )

    const fileContent = await readFile(importOnlyPath, { encoding: 'utf-8' })

    expect(fileContent).toBe(`@forward "index";\n`)
  })

  it('does not reference any undefined custom properties', async () => {
    // Requires base as this is where the custom properties come from
    const sass = `
      @use "core";
    `

    const { css } = await compileSassString(sass)

    const linter = await stylelint.lint({
      config: { rules: { 'no-unknown-custom-properties': true } },
      code: css
    })

    // Output stylelint warnings to make debugging easier
    if (linter.results[0].warnings.length) {
      console.log(
        'Warnings were present when testing the core layer for unknown custom properties:'
      )
      console.log(linter.results[0].warnings)
    }

    return expect(linter.results[0].warnings).toHaveLength(0)
  })

  describe.each(partials)('$name', ({ partialPath, name }) => {
    it('renders without errors', () => {
      const file = join(paths.package, partialPath)

      return expect(compileSassFile(file)).resolves.toMatchObject({
        css: expect.any(String),
        loadedUrls: expect.arrayContaining([expect.any(URL)])
      })
    })

    it('has a corresponding import-only file', async () => {
      const importOnlyPath = join(
        paths.package,
        partialPath.replace('.scss', '.import.scss')
      )
      const { moduleName } = /_(?<moduleName>.*)\.scss/.exec(name).groups

      const fileContent = await readFile(importOnlyPath, { encoding: 'utf-8' })

      expect(fileContent).toContain(`@forward "${moduleName}";`)
    })
  })

  describe('Sass documentation', () => {
    it('associates everything with a "core" group', async () => {
      const docs = await sassdoc.parse(
        join(paths.package, 'src/govuk/core/**/*.scss')
      )

      for (const doc of docs) {
        expect(doc).toMatchObject({
          // Include doc.context.name in the expected result when this fails,
          // giving you the context to be able to fix it
          context: {
            name: doc.context.name
          },
          group: [expect.stringMatching(/^core/)]
        })
      }
    })
  })
})
