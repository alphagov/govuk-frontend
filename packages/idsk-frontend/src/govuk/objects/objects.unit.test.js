const { join } = require('path')

const { paths } = require('@govuk-frontend/config')
const { compileSassFile } = require('@govuk-frontend/helpers/tests')
const { getListing } = require('@govuk-frontend/lib/files')
const sassdoc = require('sassdoc')

describe('The objects layer', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing('**/src/govuk/objects/**/*.scss', {
      cwd: paths.package,
      ignore: ['**/_all.scss']
    })
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
