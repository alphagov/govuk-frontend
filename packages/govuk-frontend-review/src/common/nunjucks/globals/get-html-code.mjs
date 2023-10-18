import { renderComponent } from '@govuk-frontend/lib/components'
import beautify from 'js-beautify'

/**
 * Component HTML code (formatted)
 *
 * @this {{ env: import('nunjucks').Environment }}
 * @param {string} componentName - Component name
 * @param {MacroRenderOptions} [options] - Nunjucks macro render options
 * @returns {string} HTML rendered by the component
 */
export function getHTMLCode(componentName, options) {
  const html = renderComponent(componentName, { ...options, env: this.env })

  // Default beautify options
  const beautifyOptions = beautify.html.defaultOptions()

  return beautify.html(html, {
    indent_size: 2,
    // Ensure nested labels in headings are indented properly
    inline: beautifyOptions.inline.filter((tag) => !['label'].includes(tag)),
    // Remove blank lines
    max_preserve_newlines: 0,
    // Ensure attribute wrapping in header SVG is preserved
    wrap_attributes: 'preserve'
  })
}

/**
 * @typedef {import('@govuk-frontend/lib/components').MacroRenderOptions} MacroRenderOptions
 */
