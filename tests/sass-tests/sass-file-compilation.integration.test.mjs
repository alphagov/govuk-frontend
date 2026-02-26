import { globSync } from 'node:fs'
import { relative } from 'node:path'

import { packageNameToPath } from '@govuk-frontend/lib/names'
import { compileStringAsync } from 'sass-embedded'
import slash from 'slash'

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

// Compile sass files and handle errors
// This way, we can compile once, and run multiple tests without having to recompile each time
const compiledFiles = new Map()

async function compileSassFile(sassFilePath) {
  const sass = `@import "node_modules/govuk-frontend/${sassFilePath}";`

  return compileStringAsync(sass, sassConfig)
    .then(({ css }) => ({ css, error: null }))
    .catch((error) => ({ css: '', error }))
}

/**
 * Test suite
 */
describe('Sass file compilation', () => {
  beforeAll(async () => {
    await Promise.all(
      sassFiles.map(async (sassFilePath) => {
        compiledFiles.set(sassFilePath, await compileSassFile(sassFilePath))
      })
    )
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
      const functionNames = ['_?govuk-[\\w-]+', ...nonGOVUKFunctions].join('|')

      const matches = css.matchAll(
        new RegExp(`(?:${functionNames})\\(.*?\\)`, 'g')
      )

      // `matchAll` does not return an actual `Array` so we need
      // a little conversion before we can check its length
      expect(Array.from(matches)).toHaveLength(0)
    }
  )
})
