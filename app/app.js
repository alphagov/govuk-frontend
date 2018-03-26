const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const fs = require('fs')
const path = require('path')
const port = (process.env.PORT || 3000)
const yaml = require('js-yaml')
const root = process.cwd()
const sassMiddleware = require('node-sass-middleware')
const postcssMiddleware = require('postcss-middleware')
const configPaths = require('../config/paths.json')

const helperFunctions = require('../lib/helper-functions')
const directoryToObject = require('../lib/directory-to-object')
const pluginConfig = require('../lib/plugins')

// Set up views
const appViews = [
  configPaths.layouts,
  configPaths.partials,
  configPaths.examples,
  configPaths.src
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

// middleware to compile component scss on request
const destPath = configPaths.public
app.use(sassMiddleware({
  src: root,
  response: false,
  dest: destPath,
  outputStyle: 'extended'
}))

// get the above request and tranform css
app.use(postcssMiddleware({
  plugins: [
    pluginConfig.plugins.autoprefixer,
    pluginConfig.plugins.postcsspseudoclasses
  ],
  src: function (req) {
    // on entry page only return app.css
    if (req.path === '/') {
      return '/app/assets/scss/app.css'
    } else {
      return path.join(destPath, req.path)
    }
  }
}))

// Set up middleware to serve static assets
app.use('/public', express.static(configPaths.public))

// serve html5-shiv from node modules
app.use('/vendor/html5-shiv/', express.static('node_modules/html5shiv/dist/'))
app.use('/icons', express.static(path.join(configPaths.src, 'icons')))

const server = app.listen(port, () => {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
})

// Define routes

// Index page - render the component list template
app.get('/', function (req, res) {
  Promise.all([
    directoryToObject(path.resolve(configPaths.src)),
    directoryToObject(path.resolve(configPaths.examples))
  ]).then(result => {
    const [components, examples] = result

    // filter out globals, all and icons package
    const {globals, all, icons, ...filteredComponents} = components

    res.render('index', {
      componentsDirectory: filteredComponents,
      examplesDirectory: examples
    })
  })
})

// Whenever the route includes a :component parameter, read the component data
// from its YAML file
app.param('component', function (req, res, next, componentName) {
  let yamlPath = configPaths.src + `${componentName}/${componentName}.yaml`

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

  res.render(`${req.params.component}/index`, function (error, html) {
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
  // make variables available to nunjucks template
  res.locals.componentPath = req.params.component

  res.render('component-preview', { bodyClasses })
})

// Example view
app.get('/examples/:example', function (req, res, next) {
  res.render(`${req.params.example}/index`, function (error, html) {
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
