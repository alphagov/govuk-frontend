const { join } = require('path')

const { paths } = require('govuk-frontend-config')
const { componentNameToMacroName } = require('govuk-frontend-lib/names')
const nunjucks = require('nunjucks')
const { outdent } = require('outdent')

const nunjucksPaths = [
  join(paths.src, 'govuk'),
  join(paths.src, 'govuk/components')
]

const nunjucksEnv = nunjucks.configure(nunjucksPaths, {
  trimBlocks: true,
  lstripBlocks: true
})

/**
 * Render the raw HTML for a component
 *
 * @param {string} componentName - Component name
 * @param {object} options - options to pass to the component macro
 * @param {string} [callBlock] - if provided, the macro is called using the
 *   Nunjucks call tag, with the callBlock passed as the contents of the block
 * @returns {string} HTML rendered by the macro
 */
function render (componentName, options, callBlock) {
  const macroName = componentNameToMacroName(componentName)
  const macroPath = `${componentName}/macro.njk`

  return callMacro(macroName, macroPath, [options], callBlock)
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

  return nunjucksEnv.renderString(macroString)
}

/**
 * Render Nunjucks template
 *
 * @param {object} [context] - Nunjucks context
 * @param {Object<string, string>} [blocks] - Nunjucks blocks
 * @returns {string} Nunjucks template output
 */
function renderTemplate (context = {}, blocks = {}) {
  let viewString = '{% extends "template.njk" %}'

  for (const [blockName, blockContent] of Object.entries(blocks)) {
    viewString += outdent`

      {% block ${blockName} -%}
        ${blockContent}
      {%- endblock %}`
  }

  return nunjucksEnv.renderString(viewString, context)
}

module.exports = {
  nunjucksEnv,
  callMacro,
  render,
  renderTemplate
}
