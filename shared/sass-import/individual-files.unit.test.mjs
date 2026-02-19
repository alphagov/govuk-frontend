import { globSync } from 'node:fs'
import { relative } from 'node:path'

import { paths } from '@govuk-frontend/config'
import { compileStringAsync, NodePackageImporter } from 'sass-embedded'
import slash from 'slash'

// To keep the output a little quiet, we'll silence a couple of things though`
/** @type {import("sass-embedded").StringOptions<"async">} */
const sassConfig = {
  quietDeps: true, // We're not interested in deprecation warnings from govuk-frontend
  silenceDeprecations: ['import'], // We're going to use the deprecated `@import`
  importers: [new NodePackageImporter()]
}

// Get the relative path of all **built** Sass files in GOV.UK Frontend
const sassFiles = globSync(slash(`${paths.package}/dist/govuk/**/*.scss`)).map(
  (sassFilePath) => relative(paths.package, sassFilePath)
)

describe.each(sassFiles)('%s', (sassFilePath) => {
  describe('with `@import`', () => {
    it('does not contain any unexpected govuk- function calls', async () => {
      const sass = `@import "pkg:govuk-frontend/${sassFilePath}";`

      const { css } = await compileStringAsync(sass, sassConfig)

      expect(css).not.toMatch(/_?govuk-[\w-]+\(.*?\)/g)
    })
  })
})
