import { Marked } from 'marked'
import markedLinkifyIt from 'marked-linkify-it'
import { markedSmartypants } from 'marked-smartypants'
import filters from 'nunjucks/src/filters.js'

// Custom Marked instance with extensions
const marked = new Marked()
  .use(markedLinkifyIt()) // Enable automatic URL linking
  .use(markedSmartypants()) // Enable "smart" typographic punctuation

/**
 * Render Markdown
 *
 * @param {string} content - Markdown source
 * @returns {string} Rendered Markdown
 */
export function markdown(content) {
  return filters.safe(marked.parse(content))
}
