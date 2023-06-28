const { join } = require('path')

const cheerio = require('cheerio')
const { componentNameToMacroName, packageNameToPath } = require('govuk-frontend-lib/names')
const nunjucks = require('nunjucks')
const { outdent } = require('outdent')

const nunjucksPaths = [
  join(packageNameToPath('govuk-frontend'), 'src')
]

const nunjucksEnv = nunjucks.configure(nunjucksPaths, {
  trimBlocks: true,
  lstripBlocks: true
})

/**
 * Render component HTML
 *
 * @param {string} componentName - Component name
 * @param {{ [key: string]: unknown }} options - options to pass to the component macro
 * @param {string} [callBlock] - if provided, the macro is called using the
 *   Nunjucks call tag, with the callBlock passed as the contents of the block
 * @returns {string} HTML rendered by the macro
 */
function renderHTML (componentName, options, callBlock) {
  const macroName = componentNameToMacroName(componentName)
  const macroPath = `govuk/components/${componentName}/macro.njk`

  return renderMacro(macroName, macroPath, options, callBlock)
}

/**
 * Render component HTML into cheerio
 *
 * @param {string} componentName - Component name
 * @param {object} options - options to pass to the component macro
 * @param {string} [callBlock] - if provided, the macro is called using the
 *   Nunjucks call tag, with the callBlock passed as the contents of the block
 * @returns {import('cheerio').CheerioAPI} HTML rendered by the macro
 */
function render (componentName, options, callBlock) {
  return cheerio.load(renderHTML(componentName, options, callBlock))
}

/**
 * Render the string result from calling a macro
 *
 * @param {string} macroName - The name of the macro
 * @param {string} macroPath - The path to the file containing the macro
 * @param {{ [param: string]: unknown }} options - Nunjucks macro options (or params)
 * @param {string} [callBlock] - Content for an optional callBlock, if necessary for the macro to receive one
 * @returns {string} The result of calling the macro
 */
function renderMacro (macroName, macroPath, options = {}, callBlock) {
  const macroOptions = JSON.stringify(options, undefined, 2)

  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  // If we're nesting child components or text, pass the children to the macro
  // using the 'caller' Nunjucks feature
  macroString += callBlock
    ? `{%- call ${macroName}(${macroOptions}) -%}${callBlock}{%- endcall -%}`
    : `{{- ${macroName}(${macroOptions}) -}}`

  return nunjucksEnv.renderString(macroString, {})
}

/**
 * Render Nunjucks template HTML into cheerio
 *
 * @param {object} [context] - Nunjucks context
 * @param {{ [blockName: string]: string }} [blocks] - Nunjucks blocks
 * @returns {import('cheerio').CheerioAPI} Nunjucks template output
 */
function renderTemplate (context = {}, blocks = {}) {
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
  nunjucksEnv,
  render,
  renderHTML,
  renderMacro,
  renderTemplate
}
