const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const fs = require('fs')
const path = require('path')
const port = (process.env.PORT || 3000)
const dto = require('directory-to-object')
const yaml = require('js-yaml')
const helperFunctions = require('./lib/helper-functions.js')

// Set up views
const appViews = [
  path.join(__dirname, '/src/views/'),
  path.join(__dirname, '/src/components/'),
  path.join(__dirname, '/src/examples/')
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

// make the function above available as a filter for all templates
env.addFilter('capitaliseComponentName', helperFunctions.capitaliseComponentName)

// Set view engine
app.set('view engine', 'njk')

// Set up middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/icons', express.static(path.join(__dirname, '/public/icons')))

app.listen(port, () => {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
})

// Create a componentDirectory object representing the components directory
// which we can use to iterate the component list on the homepage
dto(path.resolve('./src/components'), (err, res) => {
  if (err) {
    console.log(err)
  }
  app.locals.componentsDirectory = res
})

// Create an examplesDirectory object representing the examples directory
// which we can use to iterate the list of examples on the examples page
dto(path.resolve('./src/views/examples'), (err, res) => {
  if (err) {
    console.log(err)
  }
  app.locals.examplesDirectory = res
})

// Define routes

// Index page - render the component list template
app.get('/', function (req, res) {
  res.render('component-list')
})

// Whenever the route includes a :component parameter, read the component data
// from its YAML file
app.param('component', function (req, res, next, componentName) {
  let yamlPath = `src/components/${componentName}/${componentName}.yaml`

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
      next()
    } else {
      res.send(html)
    }
  })
})

// Component variant preview
app.get('/components/:component/:variant*?/preview', function (req, res, next) {
  // Find the data for the specified variant (or the default variant)
  let requestedVariantName = req.params.variant || 'default'
  let variantConfig = res.locals.componentData.variants.find(
    variant => variant.name === requestedVariantName
  )

  if (!variantConfig) {
    next()
  }

  let macroParameters = JSON.stringify(variantConfig.data, null, '\t')

  // Construct and evaluate the component with the data for this variant
  let componentNameCapitalized = helperFunctions.capitaliseComponentName(
    req.params.component
  )
  let importStatement = `{% from '${req.params.component}/macro.njk' import govuk${componentNameCapitalized} %}`
  res.locals.componentView = env.renderString(
    `${importStatement}${`{{ govuk${componentNameCapitalized}(${macroParameters}) }}`}`
  )

  res.render('component-preview')
})

// Example list
app.get('/examples', function (req, res) {
  res.render('example-list')
})

// Example view
app.get('/examples/:example', function (req, res, next) {
  res.render(`examples/${req.params.example}/index`, function (error, html) {
    if (error) {
      next()
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
