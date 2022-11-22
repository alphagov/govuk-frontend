const { join } = require('path')

const { getListing } = require('../../../lib/file-helper')
const { renderSass } = require('../../../lib/jest-helpers')
const configPaths = require('../../../config/paths')

describe('Components', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing(configPaths.components, '**/*.scss', {
      ignore: [
        '**/_all.scss',
        '**/_index.scss'
      ]
    })
  })

  describe('Sass render', () => {
    it('renders CSS for all components', () => {
      const file = join(configPaths.components, '_all.scss')

      return expect(renderSass({ file })).resolves.toEqual(
        expect.objectContaining({
          css: expect.any(Object),
          stats: expect.any(Object)
        })
      )
    })

    it('renders CSS for each component', () => {
      const sassTasks = sassFiles.map((sassFilePath) => {
        const file = join(configPaths.components, sassFilePath)

        return expect(renderSass({ file })).resolves.toEqual(
          expect.objectContaining({
            css: expect.any(Object),
            stats: expect.any(Object)
          })
        )
      })

      return Promise.all(sassTasks)
    })
  })
})
