const fs = require('fs')
const path = require('path')
const util = require('util')

const cheerio = require('cheerio')
const nunjucks = require('nunjucks')
const outdent = require('outdent')
const yaml = require('js-yaml')
const { configureAxe } = require('jest-axe')

const sass = require('node-sass')
const sassRender = util.promisify(sass.render)

const configPaths = require('../config/paths.js')
const { componentNameToMacroName, componentNameToJavaScriptClassName } = require('./helper-functions.js')

const nunjucksEnv = nunjucks.configure([configPaths.src, configPaths.components], {
  trimBlocks: true,
  lstripBlocks: true
})

/**
 * Render the raw HTML for a component
 *
 * @param {String} componentName
 * @param {Object} options options to pass to the component macro
 * @param {String} [callBlock] if provided, the macro is called using the
 *   Nunjucks call tag, with the callBlock passed as the contents of the block
 * @returns {String} HTML rendered by the macro
 */
function renderHtml (componentName, options, callBlock = false) {
  if (typeof options === 'undefined') {
    throw new Error('Parameters passed to `render` should be an object but are undefined')
  }

  const macroName = componentNameToMacroName(componentName)
  const macroParams = JSON.stringify(options, null, 2)

  let macroString = `{%- from "${componentName}/macro.njk" import ${macroName} -%}`

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
 * @param {String} componentName
 * @param {Object} options options to pass to the component macro
 * @param {String} [callBlock] if provided, the macro is called using the
 *   Nunjucks call tag, with the callBlock passed as the contents of the block
 *
 * @returns {CheerioAPI} a jQuery-like representation of the macro output
 */
function render (componentName, options, callBlock = false) {
  return cheerio.load(
    renderHtml(componentName, options, callBlock)
  )
}

function renderTemplate (params = {}, blocks = {}) {
  let viewString = '{% extends "template.njk" %}'

  for (const [blockName, blockContent] of Object.entries(blocks)) {
    viewString += outdent`

      {% block ${blockName} -%}
        ${blockContent}
      {%- endblock %}`
  }

  const output = nunjucksEnv.renderString(viewString, params)
  return cheerio.load(output)
}

/**
 * Render and initialise a component within test boilerplate HTML
 *
 * Renders a component's Nunjucks macro with the given params, injects it into
 * the test boilerplate page, then either:
 *
 * - instantiates the component class, passing the provided JavaScript
 *   configuration, and calls the init function
 * - runs the passed initialiser function inside the browser
 *   (which lets you instantiate it a different way, like using `initAll`,
 *   or run arbitrary code)
 *
 * @param {String} componentName - The kebab-cased name of the component
 * @param {Object} options
 * @param {String} options.baseUrl - The base URL of the test server
 * @param {Object} options.nunjucksParams - Params passed to the Nunjucks macro
 * @param {Object} [options.javascriptConfig] - The configuration hash passed to
 *  the component's class for initialisation
 * @param {Function} [options.initialiser] - A function that'll run in the
 *  browser to execute arbitrary initialisation. Receives an object with the
 *  passed configuration as `config` and the PascalCased component name as
 *  `componentClassName`
 * @returns {Promise}
 */
async function renderAndInitialise (componentName, options = {}) {
  await page.goto(`${options.baseUrl}/tests/boilerplate`, { waitUntil: 'load' })

  const html = renderHtml(componentName, options.nunjucksParams)

  // Inject rendered HTML into the page
  await page.$eval('#slot', (slot, htmlForSlot) => {
    slot.innerHTML = htmlForSlot
  }, html)

  const initialiser = options.initialiser || function ({ config, componentClassName }) {
    const $component = document.querySelector('[data-module]')
    new window.GOVUKFrontend[componentClassName]($component, config).init()
  }

  if (initialiser) {
    // Run a script to init the JavaScript component
    await page.evaluate(initialiser, {
      config: options.javascriptConfig,
      componentClassName: componentNameToJavaScriptClassName(componentName)
    })
  }
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

  const docs = yaml.load(file)

  const examples = {}

  for (const example of docs.examples) {
    examples[example.name] = example.data
  }

  return examples
}

/**
 * Render Sass
 *
 * @param {object} options Options to pass to sass.render
 * @return {promise} Result of calling sass.render
 */
function renderSass (options) {
  return sassRender({
    includePaths: [configPaths.src],
    ...options
  })
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

module.exports = { axe, render, renderHtml, renderAndInitialise, getExamples, htmlWithClassName, renderSass, renderTemplate }
