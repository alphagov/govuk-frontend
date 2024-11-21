/**
 * Logistics for handling files that get renamed and are no longer part of modules imported by `all.mjs`
 * but need to remain in the published package to support deprecations before they get removed
 */
import { join } from 'node:path'

/**
 * Paths to the deprecated files within `src/govuk`
 * (excluding the `src/govuk` part)
 */
export const deprecatedFilesPaths = []

/**
 * Checks if given Rollup input is a deprecated file
 *
 * This helps us decide whether to create bundled version of that input,
 * which we don't want for deprecated files (we just want to include them in the package)
 *
 * @param {string} rollupInput - The path to the input Rollup is compiling
 * @returns {boolean} - Whether the path corresponds to a deprecated file
 */
export function isDeprecated(rollupInput) {
  return deprecatedFilesPaths.some((deprecatedFilePath) =>
    rollupInput.endsWith(join('govuk', deprecatedFilePath))
  )
}

/**
 * Creates a glob matching the list of paths
 *
 * @param {string[]} paths - The list of paths to create a glob for
 * @returns {string} - A glob matching the deprecated files
 */
export function createGlobFromPaths(paths) {
  // Curly brace syntax in glob only works
  // when there's more than one pattern to match
  // so we need to distinguish between the two.
  if (paths.length > 1) {
    const joinedGlobs = paths.join(',')

    return `{${joinedGlobs}}`
  }

  return paths[0]
}
