
const { join } = require('path')

const nunjucks = require('nunjucks')

const { paths } = require('../../../config/index.js')

const filters = require('./filters/index.js')
const globals = require('./globals/index.js')

function renderer (app) {
  const appViews = [
    paths.layouts,
    paths.views,
    paths.components,
    join(paths.src, 'govuk'),
    join(paths.node_modules, 'govuk_template_jinja')
  ]

  // Initialise nunjucks environment
  const env = nunjucks.configure(appViews, {
    autoescape: true, // output with dangerous characters are escaped automatically
    express: app, // the express app that nunjucks should install to
    noCache: true, // never use a cache and recompile templates each time
    trimBlocks: true, // automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // automatically remove leading whitespace from a block/tag
    watch: true // reload templates when they are changed. needs chokidar dependency to be installed
  })

  // Set view engine
  app.set('view engine', 'njk')

  // Share feature flags with middleware
  env.addGlobal('flags', app.get('flags'))

  // Custom filters
  for (const key in filters) {
    env.addFilter(key, filters[key])
  }

  // Custom globals
  for (const key in globals) {
    env.addGlobal(key, globals[key])
  }

  return env
}

module.exports.renderer = renderer
