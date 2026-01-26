const { join } = require('path')

const { paths } = require('@govuk-frontend/config')
const { compileSassFile } = require('@govuk-frontend/helpers/tests')
const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { getListing } = require('@govuk-frontend/lib/files')
const sassdoc = require('sassdoc')
const stylelint = require('stylelint')

describe('The objects layer', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing('**/src/govuk/objects/**/*.scss', {
      cwd: paths.package,
      ignore: ['**/_all.scss', '**/_index.scss']
    })
  })

  it('does not reference any undefined custom properties', async () => {
    // Requires base as this is where the custom properties come from
    const sass = `
      @import "base";
      @import "objects";
    `

    const { css } = await compileSassString(sass)

    const linter = await stylelint.lint({
      config: { rules: { 'no-unknown-custom-properties': true } },
      code: css
    })

    // Output stylelint warnings to make debugging easier
    if (linter.results[0].warnings.length) {
      console.log(
        'Warnings were present when testing the objects layer for unknown custom properties:'
      )
      console.log(linter.results[0].warnings)
    }

    return expect(linter.results[0].warnings).toHaveLength(0)
  })

  it('renders CSS for all objects', () => {
    const sassTasks = sassFiles.map((sassFilePath) => {
      const file = join(paths.package, sassFilePath)

      return expect(compileSassFile(file)).resolves.toMatchObject({
        css: expect.any(String),
        loadedUrls: expect.arrayContaining([expect.any(URL)])
      })
    })

    return Promise.all(sassTasks)
  })

  describe('Sass documentation', () => {
    it('associates everything with a "objects" group', async () => {
      const docs = await sassdoc.parse(
        join(paths.package, 'src/govuk/objects/**/*.scss')
      )

      for (const doc of docs) {
        expect(doc).toMatchObject({
          // Include doc.context.name in the expected result when this fails,
          // giving you the context to be able to fix it
          context: {
            name: doc.context.name
          },
          group: [expect.stringMatching(/^objects/)]
        })
      }
    })
  })
})
