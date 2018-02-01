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

function render (componentName, params) {
  const output = nunjucks.render(componentName + '/template.njk', { params })
  const $ = cheerio.load(output)
  return { output, $ }
}

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

function htmlWithClassName ($, className) {
  const $component = $(className)
  const classSelector = className.replace('.', '')
  // Remove all other elements that do not match this component
  $component.find(`[class]:not([class^=${classSelector}])`).remove()
  return $.html($component)
}

module.exports = { render, getExamples, htmlWithClassName }
