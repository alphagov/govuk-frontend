import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import {
  getComponentsFixtures,
  getComponentNames,
  getComponentNamesFiltered,
  render
} from '@govuk-frontend/lib/components'
import { filterPath, hasPath } from '@govuk-frontend/lib/files'
import { getStats, modulePaths } from '@govuk-frontend/stats'
import express from 'express'

import { getExampleNames, getFullPageExamples } from './common/lib/files.mjs'
import * as middleware from './common/middleware/index.mjs'
import * as nunjucks from './common/nunjucks/index.mjs'
import * as routes from './routes/index.mjs'

export default async () => {
  const app = express()

  // Resolve GOV.UK Frontend from review app `node_modules`
  // to allow previous versions to be installed locally
  const packageOptions = { moduleRoot: paths.app }

  // Cache mapped components and examples
  const [
    componentsFixtures,
    componentNames,
    componentNamesWithJavaScript,
    exampleNames,
    fullPageExamples
  ] = await Promise.all([
    getComponentsFixtures(packageOptions),

    // Components list
    getComponentNames(packageOptions),

    // Components list (with JavaScript only)
    getComponentNamesFiltered(
      (componentName, componentFiles) =>
        componentFiles.some(filterPath([`**/${componentName}.mjs`])),
      packageOptions
    ),

    getExampleNames(),
    getFullPageExamples()
  ])

  // Feature flags
  const flags = /** @type {FeatureFlags} */ ({
    isDeployedToHeroku: !!process.env.HEROKU_APP,
    isDevelopment: !['test', 'production'].includes(process.env.NODE_ENV),

    // Check for JSDoc, SassDoc and Rollup stats
    hasDocsScripts: await hasPath(join(paths.app, 'dist/docs/jsdoc')),
    hasDocsStyles: await hasPath(join(paths.app, 'dist/docs/sassdoc')),
    hasStats: await hasPath(join(paths.stats, 'dist'))
  })

  // Set up Express.js
  app.set('flags', flags)
  app.set('query parser', 'simple')

  // Set up middleware
  app.use('/docs', middleware.docs)
  app.use('/vendor', middleware.vendor)
  app.use(middleware.assets)
  app.use(middleware.request)
  app.use(middleware.robots)

  // Add build stats
  app.locals.stats = Object.fromEntries(
    await Promise.all(modulePaths.map(getStats))
  )

  // Handle the banner component serverside.
  routes.banner(app)

  // Configure nunjucks
  const env = nunjucks.renderer(app)

  // Define routes

  // Index page - render the component list template
  app.get('/', async function (req, res) {
    res.render('index', {
      componentNames,
      componentNamesWithJavaScript,
      exampleNames,
      fullPageExamples
    })
  })

  // Whenever the route includes a :componentName parameter, read the component fixtures
  app.param('componentName', function (req, res, next, componentName) {
    res.locals.componentFixtures = componentsFixtures.find(
      ({ component }) => component === componentName
    )
    next()
  })

  // All components redirect
  app.get('/components/all', function (req, res) {
    res.redirect('./')
  })

  // Component examples
  app.get('/components/:componentName?', (req, res) => {
    const { componentName } = req.params

    res.render(componentName ? 'component' : 'components', {
      componentsFixtures,
      componentName
    })
  })

  // Component example preview
  app.get(
    '/components/:componentName/:exampleName?/preview',
    function (req, res, next) {
      const { componentName, exampleName = 'default' } = req.params

      /** @type {ComponentFixtures | undefined} */
      const componentFixtures = res.locals.componentFixtures

      const fixture = componentFixtures?.fixtures.find(
        (fixture) => nunjucks.filters.slugify(fixture.name) === exampleName
      )

      if (!fixture) {
        return next()
      }

      // Render component using fixture
      const componentView = render(componentName, {
        context: fixture.options,
        env,

        // Skip Nunjucks render from cache in development
        fixture: !flags.isDevelopment ? fixture : undefined
      })

      let bodyClasses = 'app-template__body'

      for (const modifier of fixture.previewLayoutModifiers) {
        bodyClasses += ` app-template__body--${modifier}`
      }

      if ('iframe' in req.query) {
        bodyClasses += ' app-template__body--component-preview'
      }

      res.render('component-preview', {
        bodyClasses,
        componentName,
        componentView,
        exampleName,
        previewLayout: componentFixtures.previewLayout
      })
    }
  )

  // Example view
  app.get('/examples/:exampleName', function (req, res) {
    const { exampleName } = req.params

    res.render(`examples/${exampleName}/index`, {
      exampleName,

      // Render with random number for unique non-visited links
      randomPageHash: (Math.random() * 1000000).toFixed()
    })
  })

  // Full page example views
  routes.fullPageExamples(app)

  return app
}

/**
 * @typedef {import('@govuk-frontend/lib/components').ComponentFixtures} ComponentFixtures
 */

/**
 * @typedef {object} FeatureFlags
 * @property {boolean} isDeployedToHeroku - Review app using `HEROKU_APP`
 * @property {boolean} isDevelopment - Review app not using `NODE_ENV` production or test
 * @property {boolean} hasDocsStyles - Stylesheets documentation (SassDoc) is available
 * @property {boolean} hasDocsScripts - JavaScripts documentation (JSDoc) is available
 * @property {boolean} hasStats - Rollup stats are available
 */
