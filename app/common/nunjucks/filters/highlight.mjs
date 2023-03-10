import hljs from 'highlight.js'

/**
 * Format code with syntax highlighting
 *
 * @param {string} code - Code in plain text
 * @param {string} [language] - Code programming language
 * @returns {string} Code with syntax highlighting
 */
export function highlight (code, language) {
  return hljs.highlight(code.trim(), { language: language || 'plaintext' }).value
}
