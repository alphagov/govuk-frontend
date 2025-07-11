import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { compileSassFile } from '@govuk-frontend/helpers/tests'
import { getListing } from '@govuk-frontend/lib/files'

describe('Components', () => {
  let sassFiles

  beforeAll(async () => {
    sassFiles = await getListing('**/src/govuk/components/**/*.scss', {
      cwd: paths.package,
      ignore: ['**/_all.scss', '**/_index.scss']
    })
  })

  it('renders CSS for all components', () => {
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
