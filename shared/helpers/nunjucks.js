const cheerio = require('cheerio')
const {
  renderComponent,
  renderString
} = require('govuk-frontend-lib/components')
const { outdent } = require('outdent')

/**
 * Render component HTML into cheerio
 *
 * @param {string} componentName - Component name
 * @param {MacroOptions} [params] - Nunjucks macro options (or params)
 * @param {MacroRenderOptions} [options] - Nunjucks macro render options
 * @returns {import('cheerio').CheerioAPI} HTML rendered by the macro
 */
function render(componentName, params, options) {
  return cheerio.load(renderComponent(componentName, params, options))
}

/**
 * Render Nunjucks template HTML into cheerio
 *
 * @param {object} [context] - Nunjucks context
 * @param {{ [blockName: string]: string }} [blocks] - Nunjucks blocks
 * @returns {import('cheerio').CheerioAPI} Nunjucks template output
 */
function renderTemplate(context = {}, blocks = {}) {
  let viewString = '{% extends "govuk/template.njk" %}'

  for (const [blockName, blockContent] of Object.entries(blocks)) {
    viewString += outdent`

      {% block ${blockName} -%}
        ${blockContent}
      {%- endblock %}`
  }

  return cheerio.load(renderString(viewString, context))
}

module.exports = {
  render,
  renderTemplate
}

/**
 * @typedef {import('govuk-frontend-lib/components').MacroOptions} MacroOptions
 * @typedef {import('govuk-frontend-lib/components').MacroRenderOptions} MacroRenderOptions
 */
