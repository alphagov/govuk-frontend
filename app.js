const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const fs = require('fs')
const path = require('path')
const port = (process.env.PORT || 3000)
const yaml = require('js-yaml')

const helperFunctions = require('./lib/helper-functions.js')  // misc helpers
const dto = require('./lib/dto-helper.js')                    // directoryToObject helper
const configPaths = require('./config/paths.json')            // specify paths to main working directories

// Set up views
const appViews = [
  path.join(__dirname, configPaths.app),
  path.join(__dirname, configPaths.partials),
  path.join(__dirname, configPaths.components)
]

// Configure nunjucks
let env = nunjucks.configure(appViews, {
  autoescape: true, // output with dangerous characters are escaped automatically
  express: app, // the express app that nunjucks should install to
  noCache: true, // never use a cache and recompile templates each time
  trimBlocks: true, // automatically remove trailing newlines from a block/tag
  lstripBlocks: true, // automatically remove leading whitespace from a block/tag
  watch: true // reload templates when they are changed. needs chokidar dependency to be installed
})

// make the function available as a filter for all templates
env.addFilter('componentNameToMacroName', helperFunctions.componentNameToMacroName)

// Set view engine
app.set('view engine', 'njk')

// Set up middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, configPaths.public)))
app.use('/icons', express.static(path.join(__dirname, configPaths.public, 'icons')))

const server = app.listen(port, () => {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
})

// Define routes

// Index page - render the component list template
app.get('/', function (req, res) {
  Promise.all([
    dto.directoryToObject(path.resolve(configPaths.components)),
    dto.directoryToObject(path.resolve(configPaths.examples))
  ]).then(result => {
    const [components, examples] = result

    res.render('index', {
      componentsDirectory: components,
      examplesDirectory: examples
    })
  })
})

// Whenever the route includes a :component parameter, read the component data
// from its YAML file
app.param('component', function (req, res, next, componentName) {
  let yamlPath = configPaths.components + `${componentName}/${componentName}.yaml`

  try {
    res.locals.componentData = yaml.safeLoad(
      fs.readFileSync(yamlPath, 'utf8'), { json: true }
    )
    next()
  } catch (e) {
    next(new Error('failed to load component YAML file'))
  }
})

// Component 'README' page
app.get('/components/:component', function (req, res, next) {
  // make variables available to nunjucks template
  res.locals.componentPath = req.params.component

  res.render('../../' + configPaths.components + `${req.params.component}/index`, function (error, html) {
    if (error) {
      next(error)
    } else {
      res.send(html)
    }
  })
})

// Component example preview
app.get('/components/:component/:example*?/preview', function (req, res, next) {
  // Find the data for the specified example (or the default example)
  let componentName = req.params.component
  let requestedExampleName = req.params.example || 'default'

  let exampleConfig = res.locals.componentData.examples.find(
    example => example.name === requestedExampleName
  )

  if (!exampleConfig) {
    next()
  }

  // Construct and evaluate the component with the data for this example
  let macroName = helperFunctions.componentNameToMacroName(componentName)
  let macroParameters = JSON.stringify(exampleConfig.data, null, '\t')

  res.locals.componentView = env.renderString(
    `{% from '${componentName}/macro.njk' import ${macroName} %}
    {{ ${macroName}(${macroParameters}) }}`
  )

  let bodyClasses = ''
  if (req.query.iframe) {
    bodyClasses = 'app-iframe-in-component-preview'
  }

  res.render('component-preview', { bodyClasses })
})

// Example view
app.get('/examples/:example', function (req, res, next) {
  res.render('../' + configPaths.examples + `${req.params.example}/index`, function (error, html) {
    if (error) {
      next(error)
    } else {
      res.send(html)
    }
  })
})

// Disallow search index indexing
app.use(function (req, res, next) {
  // none - Equivalent to noindex, nofollow
  // noindex - Do not show this page in search results and do not show a "Cached" link in search results.
  // nofollow - Do not follow the links on this page
  res.setHeader('X-Robots-Tag', 'none')
  next()
})

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})

// Since this is the last non-error-handling middleware, we assume 404, as nothing else responded.
app.use(function (req, res, next) {
  res.status(404)
  res.format({
    html: function () {
      res.render('http-error', { error: 'Page not found', message: 'If you entered a web address please check it was correct.', url: req.url })
    },
    json: function () {
      res.json({ error: 'Not found' })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
  next()
})

// Error-handling middleware, take the same form require an arity of 4.
// When connect has an error, it will invoke ONLY error-handling middleware
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('http-error', { error: 'Internal server error', message: err })
})

module.exports = server
