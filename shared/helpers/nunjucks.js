const { join } = require('path')

const cheerio = require('cheerio')
const { paths } = require('govuk-frontend-config')
const { componentNameToMacroName } = require('govuk-frontend-lib/names')
const nunjucks = require('nunjucks')
const { outdent } = require('outdent')

const nunjucksPaths = [
  join(paths.package, 'src/govuk'),
  join(paths.package, 'src/govuk/components')
]

const nunjucksEnv = nunjucks.configure(nunjucksPaths, {
  trimBlocks: true,
  lstripBlocks: true
})

/**
 * Render component HTML
 *
 * @param {string} componentName - Component name
 * @param {object} options - options to pass to the component macro
 * @param {string} [callBlock] - if provided, the macro is called using the
 *   Nunjucks call tag, with the callBlock passed as the contents of the block
 * @returns {string} HTML rendered by the macro
 */
function renderHTML (componentName, options, callBlock) {
  const macroName = componentNameToMacroName(componentName)
  const macroPath = `${componentName}/macro.njk`

  return callMacro(macroName, macroPath, [options], callBlock)
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
 * Returns the string result from calling a macro
 *
 * @param {string} macroName - The name of the macro
 * @param {string} macroPath - The path to the file containing the macro *from the root of the project*
 * @param {Array} params - The parameters that will be passed to the macro. They'll be `JSON.stringify`ed and joined with a `,`
 * @param {string} [callBlock] - Content for an optional callBlock, if necessary for the macro to receive one
 * @returns {string} The result of calling the macro
 */
function callMacro (macroName, macroPath, params = [], callBlock) {
  const macroParams = params.map(param => JSON.stringify(param, null, 2)).join(',')

  let macroString = `{%- from "${macroPath}" import ${macroName} -%}`

  // If we're nesting child components or text, pass the children to the macro
  // using the 'caller' Nunjucks feature
  if (callBlock) {
    macroString += `{%- call ${macroName}(${macroParams}) -%}${callBlock}{%- endcall -%}`
  } else {
    macroString += `{{- ${macroName}(${macroParams}) -}}`
  }

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
  let viewString = '{% extends "template.njk" %}'

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
  callMacro,
  render,
  renderHTML,
  renderTemplate
}
