import { globSync } from 'node:fs'
import { relative } from 'node:path'

import { packageNameToPath } from '@govuk-frontend/lib/names'
import { compileStringAsync } from 'sass-embedded'
import slash from 'slash'
import stylelint from 'stylelint'

import { sassConfig } from './sass.config.js'

/**
 * Setup
 */
const govukFrontendPath = packageNameToPath('govuk-frontend')

// Grab a list of all Sass files and sort them alphabetically, for consistent output
const sassFiles = globSync(`${slash(govukFrontendPath)}/dist/govuk/**/*.scss`, {
  exclude: ['**/*.map']
})
  .map((filePath) => slash(relative(govukFrontendPath, filePath)))
  .sort((a, b) => a.localeCompare(b))

async function compileSassFile(sassFilePath, type = 'import') {
  const sass = `@${type} "node_modules/govuk-frontend/${sassFilePath}";`

  return compileStringAsync(sass, sassConfig)
    .then(({ css }) => ({ css, error: null }))
    .catch((error) => ({ css: '', error }))
}

async function compileSassFiles(sassFilePaths, type = 'import') {
  const results = new Map()

  await Promise.all(
    sassFilePaths.map(async (sassFilePath) => {
      const result = await compileSassFile(sassFilePath, type)
      results.set(sassFilePath, result)
    })
  )

  return results
}

// Compile sass files and handle errors
// This way, we can compile once, and run multiple tests without having to recompile each time
let compiledFiles = new Map()
let compiledUseFiles
let compiledImportFiles

/**
 * Test suite
 */
describe('Sass file compilation', () => {
  beforeAll(async () => {
    compiledUseFiles = await compileSassFiles(sassFiles, 'use')
    compiledImportFiles = await compileSassFiles(sassFiles, 'import')
  })

  describe.each(['import', 'use'])('Sass file @%s compilation', (type) => {
    beforeAll(async () => {
      compiledFiles =
        type === 'import' ? await compiledImportFiles : await compiledUseFiles
    })

    it.each(sassFiles)('%s compiles without error', async (sassFilePath) => {
      const { error } = compiledFiles.get(sassFilePath)

      expect(error).toBeNull()
    })

    // See packages/govuk-frontend/src/govuk/index.unit.test.mjs for details of
    // this test. We've copied it here and tweaked it to include functions that
    // aren't prefixed with govuk or _govuk.
    it.each(sassFiles)(
      '%s does not contain any unexpected govuk- function calls',
      async (sassFilePath) => {
        // Most of our functions are prefixed with _govuk or govuk,
        // but there are some exceptions, which we'll call out here.
        const nonGOVUKFunctions = ['_should-warn', '_warning-text']

        const { css } = compiledFiles.get(sassFilePath)
        const functionNames = ['_?govuk-[\\w-]+', ...nonGOVUKFunctions].join(
          '|'
        )

        const matches = css.matchAll(
          new RegExp(`(?:${functionNames})\\(.*?\\)`, 'g')
        )

        // `matchAll` does not return an actual `Array` so we need
        // a little conversion before we can check its length
        expect(Array.from(matches)).toHaveLength(0)
      }
    )

    it.each(sassFiles)(
      '%s does not reference any undefined custom properties',
      async (sassFilePath) => {
        const { css } = compiledFiles.get(sassFilePath)

        const linter = await stylelint.lint({
          config: { rules: { 'no-unknown-custom-properties': true } },
          code: css
        })

        // Output stylelint warnings to make debugging easier
        if (linter.results[0].warnings.length) {
          console.log(
            'Warnings were present when testing the utilities for unknown custom properties:'
          )
          console.log(linter.results[0].warnings)
        }

        return expect(linter.results[0].warnings).toHaveLength(0)
      }
    )
  })

  describe('comparison between @import and @use', () => {
    it.each(sassFiles)(
      '%s compiled CSS matches snapshot',
      async (sassFilePath) => {
        const { css, error } = compiledImportFiles.get(sassFilePath)

        if (error) {
          return
        }

        expect(css).toMatchSnapshot()
      }
    )

    it.each(sassFiles)(
      '%s is the same for @import and @use',
      async (sassFilePath) => {
        const importResult = compiledImportFiles.get(sassFilePath)
        const useResult = compiledUseFiles.get(sassFilePath)

        if (importResult.error || useResult.error) {
          return
        }

        // Any other layer but settings, tools and helpers should output CSS.
        if (!/\/(settings|tools|helpers)\//.test(sassFilePath)) {
          expect(importResult.css).not.toBe('')
        }
        expect(importResult.css).toEqual(useResult.css)
      }
    )
  })
})
