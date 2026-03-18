const { globSync } = require('fs')
const { join, basename } = require('path')

const { paths } = require('@govuk-frontend/config')
const { compileSassFile } = require('@govuk-frontend/helpers/tests')
const sassdoc = require('sassdoc')

const partials = globSync('**/src/govuk/settings/**/*.scss', {
  cwd: paths.package,
  exclude: ['**/_index.scss', '**/*.import.scss', '**/*--internal.scss']
}).map((partialPath) => ({
  partialPath,
  name: basename(partialPath)
}))

describe('The tools layer', () => {
  it('should not output any CSS', async () => {
    const file = join(paths.package, 'src/govuk/tools/_index.scss')
    await expect(compileSassFile(file)).resolves.toMatchObject({ css: '' })
  })

  describe.each(partials)('$name', ({ partialPath, name }) => {
    it('renders without errors', () => {
      const file = join(paths.package, partialPath)

      return expect(compileSassFile(file)).resolves.toMatchObject({
        css: expect.any(String),
        loadedUrls: expect.arrayContaining([expect.any(URL)])
      })
    })
  })

  describe('Sass documentation', () => {
    it('associates everything with a "tools" group', async () => {
      const docs = await sassdoc.parse(
        join(paths.package, 'src/govuk/tools/**/*.scss')
      )

      for (const doc of docs) {
        expect(doc).toMatchObject({
          // Include doc.context.name in the expected result when this fails,
          // giving you the context to be able to fix it
          context: {
            name: doc.context.name
          },
          group: [expect.stringMatching(/^tools/)]
        })
      }
    })
  })
})
