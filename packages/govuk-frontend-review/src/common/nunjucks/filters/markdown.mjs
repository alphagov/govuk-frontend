import { marked } from 'marked'
import filters from 'nunjucks/src/filters.js'

/**
 * Render Markdown
 *
 * @param {string} content - Markdown source
 * @returns {string} Rendered Markdown
 */
export function markdown(content) {
  return filters.safe(marked.parse(content))
}
