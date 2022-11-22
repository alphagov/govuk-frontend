const { join } = require('path')

const sassdoc = require('sassdoc')

const configPaths = require('../../../config/paths')
const { getListing } = require('../../../lib/file-helper')
const { renderSass } = require('../../../lib/jest-helpers')

describe('The objects layer', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing(configPaths.src, 'govuk/objects/**/*.scss', {
      ignore: ['**/_all.scss']
    })
  })

  it('renders CSS for all objects', () => {
    const sassTasks = sassFiles.map((sassFilePath) => {
      const file = join(configPaths.src, sassFilePath)

      return expect(renderSass({ file })).resolves.toEqual(
        expect.objectContaining({
          css: expect.any(Object),
          stats: expect.any(Object)
        })
      )
    })

    return Promise.all(sassTasks)
  })

  describe('Sass documentation', () => {
    it('associates everything with a "objects" group', async () => {
      const docs = await sassdoc.parse(join(configPaths.src, 'govuk/objects/**/*.scss'))

      for (const doc of docs) {
        expect(doc).toMatchObject({
          // Include doc.context.name in the expected result when this fails,
          // giving you the context to be able to fix it
          context: {
            name: doc.context.name
          },
          group: [
            expect.stringMatching(/^objects/)
          ]
        })
      }
    })
  })
})
