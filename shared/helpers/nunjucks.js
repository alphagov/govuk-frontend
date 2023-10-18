const {
  renderComponent,
  renderString
} = require('@govuk-frontend/lib/components')
const cheerio = require('cheerio')
const { outdent } = require('outdent')

/**
 * Render component HTML into cheerio
 *
 * @param {string} componentName - Component name
 * @param {MacroRenderOptions} [options] - Nunjucks macro render options
 * @returns {import('cheerio').CheerioAPI} HTML rendered by the macro
 */
function render(componentName, options) {
  return cheerio.load(renderComponent(componentName, options))
}

/**
 * Render template HTML into cheerio
 *
 * @param {string} templatePath - Nunjucks template path
 * @param {TemplateRenderOptions} [options] - Nunjucks template render options
 * @returns {import('cheerio').CheerioAPI} Nunjucks template output
 */
function renderTemplate(templatePath, options) {
  let viewString = `{% extends "${templatePath}" %}`

  if (options?.blocks) {
    for (const [name, content] of Object.entries(options.blocks)) {
      viewString += outdent`

        {% block ${name} -%}
          ${content}
        {%- endblock %}`
    }
  }

  return cheerio.load(renderString(viewString, options))
}

module.exports = {
  render,
  renderTemplate
}

/**
 * @typedef {import('@govuk-frontend/lib/components').MacroOptions} MacroOptions
 * @typedef {import('@govuk-frontend/lib/components').MacroRenderOptions} MacroRenderOptions
 * @typedef {import('@govuk-frontend/lib/components').TemplateRenderOptions} TemplateRenderOptions
 */
