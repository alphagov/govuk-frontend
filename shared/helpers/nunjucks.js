const cheerio = require('cheerio')
const {
  nunjucksEnv,
  renderComponent
} = require('govuk-frontend-lib/components')
const { outdent } = require('outdent')

/**
 * Render component HTML into cheerio
 *
 * @param {string} componentName - Component name
 * @param {object} options - options to pass to the component macro
 * @param {string} [callBlock] - if provided, the macro is called using the
 *   Nunjucks call tag, with the callBlock passed as the contents of the block
 * @returns {import('cheerio').CheerioAPI} HTML rendered by the macro
 */
function render(componentName, options, callBlock) {
  return cheerio.load(renderComponent(componentName, options, callBlock))
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

  return cheerio.load(nunjucksEnv.renderString(viewString, context))
}

module.exports = {
  render,
  renderTemplate
}
