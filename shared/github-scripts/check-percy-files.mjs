const EXTENSIONS = ['.css', '.scss', '.js', '.mjs', '.njk', '.yaml', '.yml']

/**
 * Check if there are relevant changes for Percy screenshots
 *
 * @param {string[]} changedFiles - Array of file paths that have changed
 * @returns {boolean} True if relevant changes are detected
 */
export function checkRelevantChanges(changedFiles) {
  for (const file of changedFiles) {
    if (isRelevantFile(file)) {
      return true
    }
  }

  return false
}
/**
 * Check if a file is relevant for Percy screenshots
 *
 * @param {string} file - File path to check
 * @returns {boolean} True if the file is relevant
 */
function isRelevantFile(file) {
  if (!file || file.includes('.test.')) {
    return false
  }

  // Package file changes always trigger screenshots
  if (file.endsWith('package.json') || file.endsWith('package-lock.json')) {
    return true
  }

  // Asset changes always trigger screenshots
  if (
    file.startsWith('packages/govuk-frontend/src/govuk/assets/') ||
    file.startsWith('dist/assets/')
  ) {
    return true
  }

  // Check for frontend source files (CSS, SCSS, JS, MJS, Nunjucks)
  if (
    file.startsWith('packages/govuk-frontend/src/govuk/') ||
    file.startsWith('packages/govuk-frontend-review/src/') ||
    file.startsWith('dist')
  ) {
    return EXTENSIONS.some((ext) => file.endsWith(ext))
  }

  return false
}
