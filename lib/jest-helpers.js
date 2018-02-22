'use strict'

const path = require('path')
const fs = require('fs')
const nunjucks = require('nunjucks')
const cheerio = require('cheerio')
const yaml = require('js-yaml')

const configPaths = require('../config/paths.json')

nunjucks.configure(configPaths.src, {
  trimBlocks: true,
  lstripBlocks: true
})

/**
 * Render a component's template for testing
 * @param {string} componentName
 * @param {string} params parameters that are used in the component template
 * @returns {function} returns cheerio (jQuery) instance of the template for easy DOM querying
 */
function render (componentName, params) {
  const output = nunjucks.render(componentName + '/template.njk', { params })
  return cheerio.load(output)
}

/**
 * Get examples from a component's metadata file
 * @param {string} componentName
 * @returns {object} returns object that includes all examples at once
 */
function getExamples (componentName) {
  const file = fs.readFileSync(
    path.join(configPaths.src, componentName, `${componentName}.yaml`),
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

module.exports = { render, getExamples, htmlWithClassName }
