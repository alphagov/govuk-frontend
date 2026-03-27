import { readFile } from 'fs/promises'
import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import {
  compileSassString,
  compileSassFile,
  getSassPathsFromLayer
} from '@govuk-frontend/helpers/tests'

const partials = getSassPathsFromLayer('settings')

describe('GOV.UK Frontend custom properties', () => {
  it('imports each set of custom properties', async () => {
    const sass = `
      @import "custom-properties";
    `

    const { css } = await compileSassString(sass)

    await expect(css).toContain('--govuk-frontend-version')
    await expect(css).toContain('--govuk-breakpoint-mobile')
    await expect(css).toContain('--govuk-brand-colour')
  })

  it('has am import-only file for the `index`', async () => {
    const importOnlyPath = join(
      paths.package,
      'src/govuk/settings/_index.import.scss'
    )

    const fileContent = await readFile(importOnlyPath, { encoding: 'utf-8' })

    expect(fileContent).toBe(`@forward "index";\n`)
  })

  describe.each(partials)('$name', ({ partialPath, name }) => {
    it('renders without errors', () => {
      const file = join(paths.package, partialPath)

      return expect(compileSassFile(file)).resolves.toMatchObject({
        css: expect.any(String),
        loadedUrls: expect.arrayContaining([expect.any(URL)])
      })
    })

    it('has a corresponding import-only file', async () => {
      const importOnlyPath = join(
        paths.package,
        partialPath.replace('.scss', '.import.scss')
      )
      const { moduleName } = /_(?<moduleName>.*)\.scss/.exec(name).groups

      const fileContent = await readFile(importOnlyPath, { encoding: 'utf-8' })

      expect(fileContent).toContain(`@forward "${moduleName}";`)
    })
  })
})
