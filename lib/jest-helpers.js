'use strict'

const path = require('path')
const fs = require('fs')
const nunjucks = require('nunjucks')
const cheerio = require('cheerio')
const yaml = require('js-yaml')

const configPaths = require('../config/paths.json')

nunjucks.configure(configPaths.components, {
  trimBlocks: true,
  lstripBlocks: true
})

/**
 * Render a component's template for testing
 * @param {string} componentName
 * @param {object} params parameters that are used in the component template
 * @returns {function} returns cheerio (jQuery) instance of the template for easy DOM querying
 */
function render (componentName, params) {
  if (typeof params === 'undefined') {
    throw new Error('Parameters passed to `render` should be an object but are undefined')
  }
  const output = nunjucks.render(componentName + '/template.njk', { params })
  return cheerio.load(output)
}

/**
 * Render a component macro for testing
 *
 * Generates the code to load and call the macro,
 * marshalling the passed arguments so that Nunjucks
 * does not complain about objects within objects.
 *
 * @param {string} componentName
 * @param {object|string|array} params args that are used in the component template as params
 * @param {object} keywordArgs args that are used in the component template as keyword arguments
 * @returns {function} returns cheerio (jQuery) instance of the template for easy DOM querying
 */
function renderMacro (componentName, params, keywordArgs = {}) {
  const macroName = `govuk-${componentName}`.replace(/-(.)/g, (m, m1) => m1.toUpperCase())

  const getPrefixedArgName = (prefix, arg) => {
    return `${prefix}${arg}`.replace(/-/g, '___')
  }
  const explodeMacroArgs = (prefix, args) => {
    if (typeof args === 'object') {
      if (Array.isArray(args)) {
        const arrArgs = []
        const arrStrings = []
        args.forEach((arg, index) => {
          const prefixedIndex = `${prefix}${index}`
          arrArgs.push(explodeMacroArgs(prefixedIndex, arg))
          arrStrings.push(prefixedIndex)
        })
        const setArr = `{% set ${prefix} = [ ${arrStrings.join(', ')} ] %}`
        const arrReturnValue = `${arrArgs.join('\n')}\n${setArr}`
        return arrReturnValue
      } else {
        const objKeys = Object.keys(args)
        const objArgs = []
        objKeys.forEach(arg => {
          const objPrefix = getPrefixedArgName(prefix, arg)
          objArgs.push(explodeMacroArgs(objPrefix, args[arg]))
        })
        const objKeysStrings = objKeys.map(arg => {
          return `"${arg}": ${getPrefixedArgName(prefix, arg)}`
        })
        const setObj = `{% set ${prefix} = { ${objKeysStrings.join(', ')} } %}`
        const objReturnValue = `${objArgs.join('\n')}\n${setObj}`
        return objReturnValue
      }
    } else {
      return `{% set ${prefix} = ${JSON.stringify(args)} %}`
    }
  }

  const macroSets = []
  let macroArgs = []

  if (params) {
    macroSets.push(explodeMacroArgs('params', params))
    macroArgs.push('params')
  }

  Object.keys(keywordArgs).forEach(arg => {
    macroSets.push(explodeMacroArgs(`keyword${arg}`, keywordArgs[arg]))
    macroArgs.push(`${arg}=keyword${arg}`)
  })

  const macroString = `
${macroSets.join('\n')}
{%- from "${componentName}/macro.njk" import ${macroName} -%}
{{- ${macroName}(${macroArgs.join(', ')}) -}}
`

  const output = nunjucks.renderString(macroString)
  return cheerio.load(output)
}

/**
 * Get examples from a component's metadata file
 * @param {string} componentName
 * @returns {object} returns object that includes all examples at once
 */
function getExamples (componentName) {
  const file = fs.readFileSync(
    path.join(configPaths.components, componentName, `${componentName}.yaml`),
    'utf8'
  )

  const docs = yaml.safeLoad(file)

  const examples = {}

  for (let example of docs.examples) {
    examples[example.name] = example.data
  }

  return examples
}

/**
 * Get the raw HTML representation of a component, and remove any other
 * child elements that do not match the component.
 * Relies on B.E.M naming ensuring that child components relating to a component
 * are namespaced.
 * @param {function} $ requires an instance of cheerio (jQuery) that includes the
 * rendered component.
 * @param {string} className the top level class 'Block' in B.E.M terminology
 * @returns {string} returns HTML
 */
function htmlWithClassName ($, className) {
  const $component = $(className)
  const classSelector = className.replace('.', '')
  // Remove all other elements that do not match this component
  $component.find(`[class]:not([class^=${classSelector}])`).remove()
  return $.html($component)
}

module.exports = { render, renderMacro, getExamples, htmlWithClassName }
