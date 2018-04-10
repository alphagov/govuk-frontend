const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const bodyParser = require('body-parser')

const sass = require('node-sass')

const helperFunctions = require('../lib/helper-functions')
const directoryToObject = require('../lib/directory-to-object')
const configPaths = require('../config/paths.json')
const fileHelper = require('../lib/file-helper')

// Set up views
const appViews = [
  configPaths.layouts,
  configPaths.partials,
  configPaths.examples,
  configPaths.builder,
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

  // Builder view
  app.get('/builder', function (req, res, next) {
    const srcList = fileHelper.SrcFilteredComponentList
    const items = []
    for (const key of srcList) {
      const item = {
        text: key,
        value: key,
        name: key
      }
      items.push(item)
    }
    res.render('builder-layout', {items})
  })

  app.use(bodyParser.urlencoded({ extended: true }))
  app.post('/builder/output', function (req, res) {
    let selectedComponents = req.body.component

    const sassConfig = {
      includePaths: [ configPaths.src ],
      outputStyle: 'nested'
    }

    if (typeof selectedComponents === 'string') {
      selectedComponents = selectedComponents.split()
    }

    const customCSS = `
    ${selectedComponents.join(0).split(0).map(component => `
      @import "${path.join(configPaths.src, component, component)}";
    `
    ).join('')}`
    sass.render({
      data: customCSS,
      ...sassConfig
    }, function (err, result) {
      if (err) {
        return err
      }
      fs.writeFile('public/css/custom.css', result.css, 'utf8', (err) => {
        if (err) throw err
      })
    })
    res.render('builder-output', {selectedComponents})
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
