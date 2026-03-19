const { readFile } = require('fs/promises')
const { join } = require('path')

const { paths } = require('@govuk-frontend/config')
const {
  compileSassFile,
  getSassPathsFromLayer
} = require('@govuk-frontend/helpers/tests')
const sassdoc = require('sassdoc')

const partials = getSassPathsFromLayer('settings')

describe('The settings layer', () => {
  it('should not output any CSS', async () => {
    const file = join(paths.package, 'src/govuk/settings/_index.scss')
    await expect(compileSassFile(file)).resolves.toMatchObject({ css: '' })
  })

  it('has an import-only file for the `index`', async () => {
    const importOnlyPath = join(
      paths.package,
      'src/govuk/settings/_index.import.scss'
    )

    const fileContent = await readFile(importOnlyPath, { encoding: 'utf-8' })

    expect(fileContent).toBe(`@forward "index";\n`)
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
    it('associates everything with a "settings" group', async () => {
      const docs = await sassdoc.parse(
        join(paths.package, 'src/govuk/settings/**/*.scss')
      )

      for (const doc of docs) {
        expect(doc).toMatchObject({
          // Include doc.context.name in the expected result when this fails,
          // giving you the context to be able to fix it
          context: {
            name: doc.context.name
          },
          group: [expect.stringMatching(/^settings/)]
        })
      }
    })
  })
})
