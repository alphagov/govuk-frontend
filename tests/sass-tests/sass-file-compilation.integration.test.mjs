import { globSync } from 'node:fs'
import { relative } from 'node:path'

import { packageNameToPath } from '@govuk-frontend/lib/names'
import { compileStringAsync } from 'sass-embedded'
import slash from 'slash'

import { sassConfig } from './sass.config.js'

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
})
