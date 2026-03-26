import { globSync } from 'node:fs'
import { relative } from 'node:path'

import { packageNameToPath } from '@govuk-frontend/lib/names'
import slash from 'slash'
import stylelint from 'stylelint'

import { compileSassStringLikeUsers } from './helpers/sass.js'

/**
 * Setup
 */
const govukFrontendPath = packageNameToPath('govuk-frontend')

// Grab a list of all Sass files and sort them alphabetically, for consistent output
const sassFiles = globSync(`${slash(govukFrontendPath)}/src/govuk/**/*.scss`, {
  exclude: ['**/*.import.scss', '**/*--internal.scss']
})
  .map((filePath) => slash(relative(govukFrontendPath, filePath)))
  .sort((a, b) => a.localeCompare(b))

// Compile a Sass file and store any errors
async function compileSassFile(sassFilePath, type = 'import') {
  const suppressWarnings = `$govuk-suppressed-warnings: ("component-scss-files");\n`
  const sass = `${suppressWarnings}@${type} "node_modules/govuk-frontend/${sassFilePath}";`

  const css = await compileSassStringLikeUsers(sass)
  return css
}

/**
 * Test suite
 */
describe.each(sassFiles)('%s', (sassFilePath) => {
  let useCss, importCss

  beforeAll(async () => {
    // Compile file with `@use` and `@import` in parallel. In most tests, we only
    // need the `@use` result, as that will become the default, and is more
    // likely to fail on newer features.
    const results = await Promise.all([
      compileSassFile(sassFilePath, 'use'),
      compileSassFile(sassFilePath, 'import')
    ])
    useCss = results[0]
    importCss = results[1]
  })

  it('outputs the same CSS with `@import` and `@use`', () => {
    expect(importCss).toEqual(useCss)
  })

  // See packages/govuk-frontend/src/govuk/index.unit.test.mjs for details of
  // this test. We've copied it here and tweaked it to include functions that
  // aren't prefixed with govuk or _govuk.
  it('does not contain any unexpected govuk- function calls', () => {
    // Most of our functions are prefixed with _govuk or govuk,
    // but there are some exceptions, which we'll call out here.
    const nonGOVUKFunctions = ['_should-warn', '_warning-text']

    const functionNames = ['_?govuk-[\\w-]+', ...nonGOVUKFunctions].join('|')

    const matches = useCss.matchAll(
      new RegExp(`(?:${functionNames})\\(.*?\\)`, 'g')
    )

    // `matchAll` does not return an actual `Array` so we need
    // a little conversion before we can check its length
    expect(Array.from(matches)).toHaveLength(0)
  })

  it('does not reference any undefined custom properties', async () => {
    const linter = await stylelint.lint({
      config: { rules: { 'no-unknown-custom-properties': true } },
      code: useCss
    })

    // Output stylelint warnings to make debugging easier
    if (linter.results[0].warnings.length) {
      console.log(
        'Warnings were present when testing the utilities for unknown custom properties:'
      )
      console.log(linter.results[0].warnings)
    }

    return expect(linter.results[0].warnings).toHaveLength(0)
  })

  it('matches snapshot', () => {
    expect(useCss).toMatchSnapshot()
  })

  it('does not output CSS from settings, tools or helpers', () => {
    if (/\/(settings|tools|helpers)\//.test(sassFilePath)) {
      expect(useCss).toBe('')
    }
  })
})
