const { join } = require('path')

const cheerio = require('cheerio')
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
 * Render macro HTML
 *
 * Included for compatibility with v5 macro rendering
 *
 * @param {string} macroName - The name of the macro
 * @param {string} macroPath - The path to the file containing the macro
 * @param {object} [options] - Nunjucks macro render options
 * @returns {string} HTML rendered by the macro
 */
function renderMacro (macroName, macroPath, options) {
  const paramsFormatted = JSON.stringify(options?.context ?? {}, undefined, 2)

  // v5 tests use `[./]govuk/macros/[macro]` as the path to the macro
  // We need to get rid of the first bit for backwards compatibility
  const compatibleMacroPath = macroPath.includes('govuk/')
    ? macroPath.replace(/^.*govuk\//, '')
    : macroPath

  let macroString = `{%- from "${compatibleMacroPath}" import ${macroName} -%}`

  // If we're nesting child components or text, pass the children to the macro
  // using the 'caller' Nunjucks feature
  macroString += options?.callBlock
    ? `{%- call ${macroName}(${paramsFormatted}) -%}${options.callBlock}{%- endcall -%}`
    : `{{- ${macroName}(${paramsFormatted}) -}}`

  return nunjucksEnv.renderString(macroString, options?.context ?? {})
}

/**
 * Render Nunjucks template HTML into cheerio
 *
 * @param {object} [options] - Nunjucks context
 * @param {object} [options.context] - Nunjucks context
 * @param {Object<string, string>} [options.blocks] - Nunjucks blocks
 * @param {object} [options.set] - Variables to set in the template
 * @returns {import('cheerio').CheerioAPI} Nunjucks template output
 */
function renderTemplate (options) {
  let viewString = '{% extends "template.njk" %}'

  if (options?.set) {
    for (const [name, content] of Object.entries(options.set)) {
      viewString += outdent`
        {% set ${name} = ${content} %}`
    }
  }

  if (options?.blocks) {
    for (const [blockName, blockContent] of Object.entries(options.blocks)) {
      viewString += outdent`

        {% block ${blockName} -%}
          ${blockContent}
        {%- endblock %}`
    }
  }

  return cheerio.load(nunjucksEnv.renderString(viewString, options?.context ?? {}))
}

module.exports = {
  nunjucksEnv,
  callMacro,
  render,
  renderMacro,
  renderHTML,
  renderTemplate
}
