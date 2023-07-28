import filters from 'nunjucks/src/filters.js'

/**
 * Format URL friendly "slug" back to human readable text
 *
 * @param {string} string - String to format
 * @returns {string} Human readable text
 */
export function unslugify(string) {
  return filters.capitalize(string.replace(/-/g, ' '))
}
