const { join } = require('path')
const util = require('util')

const cheerio = require('cheerio')
const { configureAxe } = require('jest-axe')
const sass = require('node-sass')
const nunjucks = require('nunjucks')
const outdent = require('outdent')

const sassRender = util.promisify(sass.render)

const configPaths = require('../config/paths')

const { getComponentData } = require('./file-helper')
const { componentNameToMacroName } = require('./helper-functions')

const nunjucksEnv = nunjucks.configure([join(configPaths.src, 'govuk'), configPaths.components], {
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
function renderHtml (componentName, options, callBlock = false) {
  if (typeof options === 'undefined') {
    throw new Error(
      'Parameters passed to `render` should be an object but are undefined'
    )
  }

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
function callMacro (macroName, macroPath, params = [], callBlock = false) {
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
 * Render component into Cheerio API
 *
 * Allows us to interrogate the output of the macro using a jQuery-like syntax
 *
 * @param {string} componentName - Component name
 * @param {object} options - options to pass to the component macro
 * @param {string} [callBlock] - if provided, the macro is called using the
 *   Nunjucks call tag, with the callBlock passed as the contents of the block
 * @returns {import('cheerio').CheerioAPI} a jQuery-like representation of the macro output
 */
function render (componentName, options, callBlock = false) {
  return cheerio.load(
    renderHtml(componentName, options, callBlock)
  )
}

/**
 * Render Nunjucks template into Cheerio API
 *
 * @param {object} [context] - Nunjucks context
 * @param {Object<string, string>} [blocks] - Nunjucks blocks
 * @returns {import('cheerio').CheerioAPI} a jQuery-like representation of the template output
 */
function renderTemplate (context = {}, blocks = {}) {
  let viewString = '{% extends "template.njk" %}'

  for (const [blockName, blockContent] of Object.entries(blocks)) {
    viewString += outdent`

      {% block ${blockName} -%}
        ${blockContent}
      {%- endblock %}`
  }

  const output = nunjucksEnv.renderString(viewString, context)
  return cheerio.load(output)
}

/**
 * Get examples from a component's metadata file
 *
 * @param {string} componentName - Component name
 * @returns {Promise<Object<string, object>>} returns object that includes all examples at once
 */
async function getExamples (componentName) {
  const componentData = await getComponentData(componentName)

  const examples = {}

  for (const example of componentData?.examples || []) {
    examples[example.name] = example.data
  }

  return examples
}

/**
 * Render Sass
 *
 * @param {import('node-sass').Options} options - Options to pass to sass.render
 * @returns {Promise<import('node-sass').Result>} Result of calling sass.render
 */
function renderSass (options) {
  return sassRender({
    includePaths: [join(configPaths.src, 'govuk')],
    ...options
  })
}

/**
 * Get the raw HTML representation of a component, and remove any other
 * child elements that do not match the component.
 * Relies on B.E.M naming ensuring that child components relating to a component
 * are namespaced.
 *
 * @param {import('cheerio').CheerioAPI} $ - requires an instance of cheerio (jQuery) that includes the
 * rendered component.
 * @param {string} className - the top level class 'Block' in B.E.M terminology
 * @returns {string} returns HTML
 */
function htmlWithClassName ($, className) {
  const $component = $(className)
  const classSelector = className.replace('.', '')
  // Remove all other elements that do not match this component
  $component.find(`[class]:not([class^=${classSelector}])`).remove()
  return $.html($component)
}

/**
 * As we're testing incomplete HTML fragments, we don't expect there to be a
 * skip link, or for them to be contained within landmarks.
 */
const axe = configureAxe({
  rules: {
    'skip-link': { enabled: false },
    region: { enabled: false }
  }
})

module.exports = {
  axe,
  getExamples,
  htmlWithClassName,
  nunjucksEnv,
  callMacro,
  render,
  renderHtml,
  renderSass,
  renderTemplate
}
