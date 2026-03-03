import { globSync } from 'node:fs'
import { relative } from 'node:path'

import { packageNameToPath } from '@govuk-frontend/lib/names'

const govukFrontendPath = packageNameToPath('govuk-frontend')

const slash = (path) => path.replace(/\\/g, '/')

/**
 * Extracts Sass import/use/forward paths from file content,
 * ignoring comment lines and built-in `sass:` modules.
 *
 * @param {string} content - Sass file content
 * @returns {string[]} Array of import paths
 */
function extractImports(content) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.match(/^(\/\/|\/\*|\*)/)) // filter comments
    .map(
      (line) => line.match(/^@(?:import|use|forward)\s+["']([^"']+)["']/)?.[1]
    )
    .filter((path) => path && !path.startsWith('sass:'))
}

function getAllSassFiles() {
  return globSync(`${slash(govukFrontendPath)}/dist/govuk/**/*.scss`, {
    exclude: ['**/*.map']
  })
    .map((filePath) => slash(relative(govukFrontendPath, filePath)))
    .sort((a, b) => a.localeCompare(b))
}

export { extractImports, getAllSassFiles, govukFrontendPath }
