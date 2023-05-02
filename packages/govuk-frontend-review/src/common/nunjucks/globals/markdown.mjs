import { marked } from 'marked'

/**
 * Render Markdown
 *
 * @param {string} content - Markdown source
 * @returns {string} Rendered Markdown
 */
export function markdown (content) {
  return marked.parse(content)
}
