const { join } = require('path')

const { paths } = require('@govuk-frontend/config')
const { compileSassFile } = require('@govuk-frontend/helpers/tests')
const { getListing } = require('@govuk-frontend/lib/files')

describe('Components', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing('**/src/govuk/components/**/*.scss', {
      cwd: paths.package,
      ignore: ['**/_all.scss', '**/_index.scss']
    })
  })

  describe('Sass render', () => {
    it('renders CSS for all components', () => {
      const file = join(paths.package, 'src/govuk/components/_all.scss')

      return expect(compileSassFile(file)).resolves.toMatchObject({
        css: expect.any(String),
        loadedUrls: expect.arrayContaining([expect.any(URL)])
      })
    })

    it('renders CSS for each component', () => {
      const sassTasks = sassFiles.map((sassFilePath) => {
        const file = join(paths.package, sassFilePath)

        return expect(compileSassFile(file)).resolves.toMatchObject({
          css: expect.any(String),
          loadedUrls: expect.arrayContaining([expect.any(URL)])
        })
      })

      return Promise.all(sassTasks)
    })
  })
})
