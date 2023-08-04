const cheerio = require('cheerio')
const {
  nunjucksEnv,
  renderComponent
} = require('govuk-frontend-lib/components')
const { outdent } = require('outdent')

// Nunjucks default environment
const env = nunjucksEnv()

/**
 * Render component HTML into cheerio
 *
 * @param {string} componentName - Component name
 * @param {MacroOptions} [params] - Nunjucks macro options (or params)
 * @param {string} [callBlock] - Nunjucks macro `caller()` content (optional)
 * @returns {import('cheerio').CheerioAPI} HTML rendered by the macro
 */
function render(componentName, params, callBlock) {
  return cheerio.load(renderComponent(componentName, params, callBlock))
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

  return cheerio.load(env.renderString(viewString, context))
}

module.exports = {
  render,
  renderTemplate
}

/**
 * @typedef {import('govuk-frontend-lib/components').MacroOptions} MacroOptions
 */
