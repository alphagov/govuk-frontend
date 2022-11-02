const { join } = require('path')

const sassdoc = require('sassdoc')

const { getListing } = require('../../../lib/file-helper')
const { renderSass } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths.js')

describe('The tools layer', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing(configPaths.src, 'tools/**/*.scss', {
      ignore: ['**/_all.scss']
    })
  })

  it('should not output any CSS', async () => {
    const tools = join(configPaths.src, 'tools', '_all.scss')

    const output = await renderSass({ file: tools })
    expect(output.css.toString()).toEqual('')
  })

  it('renders CSS for all tools', () => {
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
    it('associates everything with a "tools" group', async () => {
      const docs = await sassdoc.parse(join(configPaths.src, 'tools', '*.scss'))

      for (const doc of docs) {
        expect(doc).toMatchObject({
          // Include doc.context.name in the expected result when this fails,
          // giving you the context to be able to fix it
          context: {
            name: doc.context.name
          },
          group: [
            expect.stringMatching(/^tools/)
          ]
        })
      }
    })
  })
})
