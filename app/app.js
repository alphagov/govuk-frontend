const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const path = require('path')

const helperFunctions = require('../lib/helper-functions')
const configPaths = require('../config/paths.json')

// Routers
const indexRouter = require('./routes/indexRoutes')
const exampleRouter = require('./routes/exampleRoutes')
const componentRouter = require('./routes/componentRoutes')
const fullPageExampleRouter = require('./routes/fullPageExampleRoutes')
const bannerRoute = require('./routes/bannerRoutes')

// Set up views
const appViews = [
  configPaths.layouts,
  configPaths.views,
  configPaths.examples,
  configPaths.fullPageExamples,
  configPaths.components,
  configPaths.src
]

module.exports = (options) => {
  const nunjucksOptions = options ? options.nunjucks : {}

  // Configure nunjucks
  let env = nunjucks.configure(appViews, {
    autoescape: true, // output with dangerous characters are escaped automatically
    express: app, // the express app that nunjucks should install to
    noCache: true, // never use a cache and recompile templates each time
    trimBlocks: true, // automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // automatically remove leading whitespace from a block/tag
    watch: true, // reload templates when they are changed. needs chokidar dependency to be installed
    ...nunjucksOptions // merge any additional options and overwrite defaults above.
  })

  // make the function available as a filter for all templates
  env.addFilter('componentNameToMacroName', helperFunctions.componentNameToMacroName)

  // Set the nunjucksEnv so it can be used in various routes like componentRoute.js
  app.set('nunjucksEnv', env)

  // Set view engine
  app.set('view engine', 'njk')

  // Disallow search index indexing
  app.use(function (req, res, next) {
    // none - Equivalent to noindex, nofollow
    // noindex - Do not show this page in search results and do not show a
    //   "Cached" link in search results.
    // nofollow - Do not follow the links on this page
    res.setHeader('X-Robots-Tag', 'none')
    next()
  })

  // Set up middleware to serve static assets
  app.use('/public', express.static(configPaths.public))

  app.use('/docs', express.static(configPaths.sassdoc))

  // serve html5-shiv from node modules
  app.use('/vendor/html5-shiv/', express.static('node_modules/html5shiv/dist/'))

  // serve legacy code from node node modules
  app.use('/vendor/govuk_template/', express.static('node_modules/govuk_template_jinja/assets/stylesheets/'))

  app.use('/assets', express.static(path.join(configPaths.src, 'assets')))

  // Turn form POSTs into data that can be used for validation.
  app.use(bodyParser.urlencoded({ extended: true }))

  // Handle the banner component serverside.
  app.use(bannerRoute)

  // Define routes

  // Index page - render the component list template
  app.use('/', indexRouter)

  // All components view
  app.use('/components', componentRouter)

  // Example view
  app.use('/examples', exampleRouter)

  // Full page example views
  app.use('/full-page-examples', fullPageExampleRouter)

  app.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    res.send('User-agent: *\nDisallow: /')
  })

  return app
}
