const { join } = require('path')

const sassdoc = require('sassdoc')

const configPaths = require('../../../config/paths')
const { getListing } = require('../../../lib/file-helper')
const { compileSassFile } = require('../../../lib/jest-helpers')

describe('The helpers layer', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing(configPaths.src, 'govuk/helpers/**/*.scss', {
      ignore: ['**/_all.scss']
    })
  })

  it('should not output any CSS', async () => {
    const file = join(configPaths.src, 'govuk/helpers/_all.scss')
    await expect(compileSassFile(file)).resolves.toMatchObject({ css: '' })
  })

  it('renders CSS for all helpers', () => {
    const sassTasks = sassFiles.map((sassFilePath) => {
      const file = join(configPaths.src, sassFilePath)

      return expect(compileSassFile(file)).resolves.toMatchObject({
        css: expect.any(String),
        stats: expect.any(Object)
      })
    })

    return Promise.all(sassTasks)
  })

  describe('Sass documentation', () => {
    it('associates everything with a "helpers" group', async () => {
      const docs = await sassdoc.parse(join(configPaths.src, 'govuk/helpers/**/*.scss'))

      for (const doc of docs) {
        expect(doc).toMatchObject({
          // Include doc.context.name in the expected result when this fails,
          // giving you the context to be able to fix it
          context: {
            name: doc.context.name
          },
          group: [
            expect.stringMatching(/^helpers/)
          ]
        })
      }
    })
  })
})
