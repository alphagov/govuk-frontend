const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const { marked } = require('marked')
const { join } = require('path')

const { getDirectories, getComponentsData, getFullPageExamples } = require('../lib/file-helper')
const helperFunctions = require('../lib/helper-functions')
const configPaths = require('../config/paths.js')
const middleware = require('./middleware/index.js')

const { HEROKU_APP } = process.env

const appViews = [
  configPaths.layouts,
  configPaths.views,
  configPaths.components,
  configPaths.src,
  join(configPaths.node_modules, 'govuk_template_jinja')
]

module.exports = async (options) => {
  const nunjucksOptions = options ? options.nunjucks : {}

  // Configure nunjucks
  const env = nunjucks.configure(appViews, {
    autoescape: true, // output with dangerous characters are escaped automatically
    express: app, // the express app that nunjucks should install to
    noCache: true, // never use a cache and recompile templates each time
    trimBlocks: true, // automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // automatically remove leading whitespace from a block/tag
    watch: true, // reload templates when they are changed. needs chokidar dependency to be installed
    ...nunjucksOptions // merge any additional options and overwrite defaults above.
  })

  // Cache mapped components and examples
  const [componentsData, componentNames, exampleNames, fullPageExamples] = await Promise.all([
    getComponentsData(),
    getDirectories(configPaths.components),
    getDirectories(configPaths.examples),
    getFullPageExamples()
  ])

  // Feature flags
  const flags = {
    isDeployedToHeroku: !!HEROKU_APP
  }

  // Share feature flags with middleware
  env.addGlobal('flags', flags)
  app.set('flags', flags)

  // make the function available as a filter for all templates
  env.addFilter('componentNameToMacroName', helperFunctions.componentNameToMacroName)
  env.addGlobal('markdown', marked)

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

  // Ensure robots are still able to crawl the pages.
  //
  // This might seem like a mistake, but it's not. If a page is blocked by
  // robots.txt, the crawler will never see the noindex directive, and so the
  // page can still appear in search results.
  app.get('/robots.txt', function (req, res) {
    res.type('text/plain')
    res.send('User-agent: *\nAllow: /')
  })

  // Set up middleware to serve static assets
  app.use('/public', express.static(configPaths.public))

  // Set up middleware for documentation
  app.use('/docs', middleware.docs)

  // serve html5-shiv from node modules
  app.use('/vendor/html5-shiv/', express.static('node_modules/html5shiv/dist/'))

  // serve legacy code from node modules
  app.use('/vendor/govuk_template/', express.static('node_modules/govuk_template_jinja/assets/'))
  app.use('/vendor/govuk_frontend_toolkit/assets', express.static('node_modules/govuk_frontend_toolkit/images'))
  app.use('/vendor/govuk_frontend_toolkit/', express.static('node_modules/govuk_frontend_toolkit/javascripts/govuk/'))
  app.use('/vendor/jquery/', express.static('node_modules/jquery/dist'))

  app.use('/assets', express.static(configPaths.assets))

  // Turn form POSTs into data that can be used for validation.
  app.use(bodyParser.urlencoded({ extended: true }))

  // Handle the banner component serverside.
  require('./banner.js')(app)

  // Define middleware for all routes
  app.use('*', function (request, response, next) {
    response.locals.legacy = (request.query.legacy === '1' || request.query.legacy === 'true')
    if (response.locals.legacy) {
      response.locals.legacyQuery = '?legacy=' + request.query.legacy
    } else {
      response.locals.legacyQuery = ''
    }
    next()
  })

  // Define routes

  // Index page - render the component list template
  app.get('/', async function (req, res) {
    res.render('index', {
      componentNames,
      exampleNames,
      fullPageExamples
    })
  })

  // Whenever the route includes a :componentName parameter, read the component data
  // from its YAML file
  app.param('componentName', function (req, res, next, componentName) {
    res.locals.componentData = componentsData.find(({ name }) => name === componentName)
    next()
  })

  // All components view
  app.get('/components/all', function (req, res, next) {
    res.locals.componentsData = componentsData.map((componentData) => {
      const defaultExample = componentData.examples.find(({ name }) => name === 'default')

      return {
        ...componentData,
        examples: [defaultExample]
      }
    })

    res.render('all-components', function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Component 'README' page
  app.get('/components/:componentName', function (req, res, next) {
    // make variables available to nunjucks template
    res.locals.componentPath = req.params.componentName

    res.render('component', function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Component example preview
  app.get('/components/:componentName/:exampleName*?/preview', function (req, res, next) {
    // Find the data for the specified example (or the default example)
    const componentName = req.params.componentName
    const exampleName = req.params.exampleName || 'default'

    const previewLayout = res.locals.componentData.previewLayout || 'layout'

    const exampleConfig = res.locals.componentData.examples.find(
      example => example.name.replace(/ /g, '-') === exampleName
    )

    if (!exampleConfig) {
      next()
    }

    // Construct and evaluate the component with the data for this example
    const macroName = helperFunctions.componentNameToMacroName(componentName)
    const macroParameters = JSON.stringify(exampleConfig.data, null, '\t')

    res.locals.componentView = env.renderString(
      `{% from '${componentName}/macro.njk' import ${macroName} %}
      {{ ${macroName}(${macroParameters}) }}`
    )

    let bodyClasses = ''
    if (req.query.iframe) {
      bodyClasses = 'app-iframe-in-component-preview'
    }

    res.render('component-preview', { bodyClasses, previewLayout })
  })

  // Example view
  app.get('/examples/:exampleName', function (req, res, next) {
    // Passing a random number used for the links so that they will be unique and not display as "visited"
    const randomPageHash = (Math.random() * 1000000).toFixed()
    res.render(`examples/${req.params.exampleName}/index`, { randomPageHash }, function (error, html) {
      if (error) {
        next(error)
      } else {
        res.send(html)
      }
    })
  })

  // Test view for injecting rendered components
  // and testing specific JavaScript configurations
  // Example view
  app.get('/tests/boilerplate', function (req, res) {
    res.render('tests/boilerplate')
  })

  // Full page example views
  require('./full-page-examples.js')(app)

  return app
}
