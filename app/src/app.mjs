import { join } from 'path'

import express from 'express'
import { paths } from 'govuk-frontend-config'
import { getDirectories, getComponentsData, getFullPageExamples } from 'govuk-frontend-lib/files'
import { componentNameToMacroName } from 'govuk-frontend-lib/names'
import { outdent } from 'outdent'

import * as middleware from './common/middleware/index.mjs'
import * as nunjucks from './common/nunjucks/index.mjs'
import * as routes from './routes/index.mjs'

export default async () => {
  const app = express()

  // Cache mapped components and examples
  const [componentsData, componentNames, exampleNames, fullPageExamples] = await Promise.all([
    getComponentsData(),
    getDirectories(join(paths.package, 'src/govuk/components')),
    getDirectories(join(paths.app, 'src/views/examples')),
    getFullPageExamples()
  ])

  // Feature flags
  const flags = {
    isDeployedToHeroku: !!process.env.HEROKU_APP
  }

  // Set up Express.js
  app.set('flags', flags)
  app.set('query parser', 'simple')

  // Set up middleware
  app.use('/docs', middleware.docs)
  app.use('/vendor', middleware.vendor)
  app.use(middleware.assets)
  app.use(middleware.legacy)
  app.use(middleware.request)
  app.use(middleware.robots)

  // Handle the banner component serverside.
  routes.banner(app)

  // Configure nunjucks
  const env = nunjucks.renderer(app)

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
  app.get('/components/:componentName/:exampleName?/preview', function (req, res, next) {
    // Find the data for the specified example (or the default example)
    const componentName = req.params.componentName
    const exampleName = req.params.exampleName || 'default'

    const previewLayout = res.locals.componentData?.previewLayout || 'layout'

    const exampleConfig = res.locals.componentData?.examples.find(
      example => example.name.replace(/ /g, '-') === exampleName
    )

    if (!exampleConfig) {
      next()
    }

    // Construct and evaluate the component with the data for this example
    const macroName = componentNameToMacroName(componentName)
    const macroParameters = JSON.stringify(exampleConfig.data, null, '\t')

    res.locals.componentView = env.renderString(outdent`
      {% from '${componentName}/macro.njk' import ${macroName} %}
      {{ ${macroName}(${macroParameters}) }}
    `, {})

    let bodyClasses = ''

    if ('iframe' in req.query) {
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
  routes.fullPageExamples(app)

  return app
}
