import { globSync } from 'node:fs'
import { relative } from 'node:path'

import { compileSassStringLikeUsers } from '@govuk-frontend/helpers/tests'
import { packageNameToPath } from '@govuk-frontend/lib/names'
import slash from 'slash'

// Grab the list of components synchronously so we can create
// individual test suites for each of them
const govukFrontendPath = packageNameToPath('govuk-frontend')
const componentFolders = globSync(
  `${slash(govukFrontendPath)}/src/govuk/components/*`,
  {
    exclude: ['**/*.*']
  }
).map((folderPath) => slash(relative(govukFrontendPath, folderPath)))

describe('Individual components', () => {
  describe.each(componentFolders)('%s', (componentFolder) => {
    it('works when user @imports the component', async () => {
      const sass = `
        $govuk-suppressed-warnings: ("component-scss-files");
        @import "node_modules/govuk-frontend/${slash(componentFolder)}";
      `

      const css = await compileSassStringLikeUsers(sass)

      expect(css).toMatchSnapshot()
    })
  })
})
