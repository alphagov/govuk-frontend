import { join } from 'path'

import beautify from 'js-beautify'

import { paths } from '../../../../config/index.js'

/**
 * Component HTML code (formatted)
 *
 * @param {string} componentName - Component name
 * @param {unknown} params - Component macro params
 * @returns {string} Nunjucks code
 */
export function getHTMLCode (componentName, params) {
  const templatePath = join(paths.components, componentName, 'template.njk')

  // Render to HTML
  const html = this.env.render(templatePath, { params }).trim()

  // Default beautify options
  const options = beautify.html.defaultOptions()

  return beautify.html(html, {
    indent_size: 2,
    // Ensure nested labels in headings are indented properly
    inline: options.inline.filter((tag) => !['label'].includes(tag)),
    // Remove blank lines
    max_preserve_newlines: 0,
    // Ensure attribute wrapping in header SVG is preserved
    wrap_attributes: 'preserve'
  })
}
