import { marked } from 'marked'

/**
 * Render Markdown
 *
 * @param {string} content - Markdown source
 * @returns {string} Rendered Markdown
 */
export function markdown (content) {
  // Explicitly set deprecated properties to false to avoid deprecation warnings
  return marked.parse(content, {
    mangle: false,
    headerIds: false
  })
}
