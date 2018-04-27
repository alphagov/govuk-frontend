const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const util = require('util')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const readdir = util.promisify(fs.readdir)

const helperFunctions = require('../lib/helper-functions')
const configPaths = require('../config/paths.json')

// Set up views
const appViews = [
  configPaths.layouts,
  configPaths.partials,
  configPaths.examples,
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

  // Set view engine
  app.set('view engine', 'njk')

  // Set up middleware to serve static assets
  app.use('/public', express.static(configPaths.public))

  // serve html5-shiv from node modules
  app.use('/vendor/html5-shiv/', express.static('node_modules/html5shiv/dist/'))
  app.use('/icons', express.static(path.join(configPaths.src, 'icons')))

  // Define routes

  // Index page - render the component list template
  app.get('/', async function (req, res) {
    const components = await readdir(path.resolve(configPaths.src))
    const examples = await readdir(path.resolve(configPaths.examples))

    // Filter out globals, all and icons package
    const filteredComponents = components.filter(component => (
      component !== 'globals' &&
      component !== 'icons' &&
      !component.startsWith('all')
    ))

    res.render('index', {
      componentsDirectory: filteredComponents,
      examplesDirectory: examples
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

    let previewLayout = res.locals.componentData.previewLayout || 'layout'

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

    res.render('component-preview', { bodyClasses, previewLayout })
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

  return app
}
