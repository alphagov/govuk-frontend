import { globSync } from 'node:fs'
import { relative } from 'node:path'

import { paths } from '@govuk-frontend/config'
import { packageNameToPath } from '@govuk-frontend/lib/names'
import { compileStringAsync } from 'sass-embedded'
import slash from 'slash'

/** @type {import('sass-embedded').StringOptions<"async">} */
const sassConfig = {
  loadPaths: [paths.root],
  quietDeps: true,
  silenceDeprecations: ['import', 'mixed-decls']
}

// Grab the list of components synchronously so we can create
// individual test suites for each of them
const govukFrontendPath = packageNameToPath('govuk-frontend')
const componentFolders = globSync(
  `${slash(govukFrontendPath)}/dist/govuk/components/*`,
  {
    exclude: ['**/*.*']
  }
).map((folderPath) => slash(relative(govukFrontendPath, folderPath)))

describe('Individual components', () => {
  describe.each(componentFolders)('%s', (componentFolder) => {
    it('works when user @imports the component', async () => {
      const sass = `
        @import "node_modules/govuk-frontend/${slash(componentFolder)}";
      `

      const { css } = await compileStringAsync(sass, sassConfig)

      expect(css).toMatchSnapshot()
    })
  })
})
