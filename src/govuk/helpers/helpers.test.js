const { join } = require('path')

const sassdoc = require('sassdoc')

const { getListing } = require('../../../lib/file-helper')
const { renderSass } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths')

describe('The helpers layer', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing(configPaths.src, 'govuk/helpers/**/*.scss', {
      ignore: ['**/_all.scss']
    })
  })

  it('should not output any CSS', async () => {
    const helpers = join(configPaths.src, 'govuk/helpers/_all.scss')

    const output = await renderSass({ file: helpers })
    expect(output.css.toString()).toEqual('')
  })

  it('renders CSS for all helpers', () => {
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
