import { join, resolve } from 'path'

import { paths } from '@govuk-frontend/config'
import {
  getComponentsFixtures,
  getComponentNames,
  getComponentNamesFiltered,
  render
} from '@govuk-frontend/lib/components'
import {
  filterPath,
  getDirectories,
  getReadableFileSizes,
  hasPath
} from '@govuk-frontend/lib/files'
import { getModuleFileSizes } from '@govuk-frontend/stats'
import express from 'express'

import { getFullPageExamples } from './common/lib/files.mjs'
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

    getDirectories(join(paths.app, 'src/views/examples')),
    getFullPageExamples()
  ])

  // Feature flags
  const flags = /** @type {FeatureFlags} */ ({
    isDevelopment: !process.env.HEROKU_APP && !process.env.CI,

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
  app.use(middleware.assets)
  app.use(middleware.request)
  app.use(middleware.robots)
  app.use(middleware.banner)
  app.use(middleware.featureFlags)

  // Add build stats
  const moduleFileSizes = await getReadableFileSizes(await getModuleFileSizes())
  const allBundles = moduleFileSizes.filter(
    (module) => module.path === 'all.mjs'
  )

  app.locals.stats = componentNamesWithJavaScript.sort().map((name) => {
    const componentSizes = moduleFileSizes.filter(
      (module) => module.path === `components/${name}/${name}.mjs`
    )
    return {
      componentName: name,
      bundled: componentSizes.find((size) => size.type === 'bundled').size,
      minified: componentSizes.find((size) => size.type === 'minified').size
    }
  })
  app.locals.allBundle = {
    bundled: allBundles.find((size) => size.type === 'bundled').size,
    minified: allBundles.find((size) => size.type === 'minified').size
  }

  // Configure nunjucks
  const env = nunjucks.renderer(app)

  // Define parameters

  /**
   * Handle parameter :componentName
   *
   * Finds all component fixtures and default example
   */
  app.param(
    'componentName',

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response<{}, Partial<PreviewLocals>>} res
     * @param {import('express').NextFunction} next
     * @param {string} componentName
     */
    (req, res, next, componentName) => {
      // Find all fixtures for component
      const componentFixtures = componentsFixtures.find(
        ({ component }) => component === componentName
      )

      if (!componentFixtures) {
        throw new NotFoundError(`Component not found: ${componentName}`)
      }

      // Add response locals
      res.locals.componentName = componentName
      res.locals.componentFixtures = componentFixtures

      next()
    }
  )

  /**
   * Handle parameter :exampleName
   *
   * Finds component fixture for example and updates locals
   */
  app.param(
    'exampleName',

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response<{}, Partial<PreviewLocals>>} res
     * @param {import('express').NextFunction} next
     * @param {string} exampleName
     */
    (req, res, next, exampleName) => {
      const { componentFixtures } = res.locals

      // Replace default fixture with named example
      const componentFixture = componentFixtures?.fixtures.find(
        ({ name }) => nunjucks.filters.slugify(name) === exampleName
      )

      if (!componentFixture) {
        throw new NotFoundError(`Example not found: ${exampleName}`)
      }

      // Update response locals
      res.locals.componentFixture = componentFixture
      res.locals.exampleName = exampleName

      next()
    }
  )

  /**
   * Review app home page
   */
  app.get('/', (req, res) => {
    res.render('index', {
      componentNames,
      componentNamesWithJavaScript,
      exampleNames,
      fullPageExamples
    })
  })

  /**
   * All components redirect
   */
  app.get('/components/all', (req, res) => {
    res.redirect('./')
  })

  /**
   * All default examples of all components
   */
  app.get('/components', (req, res) => {
    res.render('components', {
      componentsFixtures
    })
  })

  /**
   * Component examples
   */
  app.get('/components/:componentName', (req, res) => {
    res.render('component')
  })

  /**
   * Default example redirect
   */
  app.get('/components/:componentName/preview', (req, res, next) => {
    // Rewrite the URL to set the example to 'default' without redirecting
    req.url = req.url.replace('/preview', '/default/preview')
    next()
  })

  /**
   * Component example preview
   */
  app.get(
    '/components/:componentName/:exampleName/preview',

    /**
     * @param {import('express').Request} req
     * @param {import('express').Response<{}, Partial<PreviewLocals>>} res
     * @param {import('express').NextFunction} next
     * @returns {void}
     */
    (req, res, next) => {
      const {
        componentName,
        componentFixtures: fixtures,
        componentFixture: fixture
      } = res.locals

      // Render component using fixture
      const componentView = render(componentName, {
        context: fixture.options,
        env,
        fixture
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
        componentView,
        previewLayout: fixtures.previewLayout
      })
    }
  )

  /**
   * Additional routes
   */
  app.use('/examples', routes.examples)
  app.use('/full-page-examples', routes.fullPageExamples)

  // For use in examples
  app.use('/images', express.static(resolve('src/images')))

  /**
   * Page not found handler
   */
  app.use((req, res) => {
    res.status(404).render('errors/404')
  })

  /**
   * Error handler
   */
  app.use((error, req, res, next) => {
    if (error instanceof NotFoundError) {
      return res.status(404).render('errors/404', {
        error
      })
    }

    console.error(error)
    res.status(500).render('errors/500', {
      error
    })
  })

  return app
}

class NotFoundError extends Error {
  name = 'NotFoundError'
}

/**
 * @import {ComponentFixtures} from '@govuk-frontend/lib/components'
 * @import {ComponentFixture} from '@govuk-frontend/lib/components'
 */

/**
 * @typedef {object} PreviewLocals
 * @property {ComponentFixtures} componentFixtures - All Component fixtures
 * @property {ComponentFixture} [componentFixture] - Single component fixture
 * @property {string} componentName - Component name
 * @property {string} [exampleName] - Example name
 * @property {boolean} [useRebrand] - Whether to show rebranded examples
 */

/**
 * @typedef {object} FeatureFlags
 * @property {boolean} isDevelopment - Review app not in CI or on Heroku
 * @property {boolean} hasDocsStyles - Stylesheets documentation (SassDoc) is available
 * @property {boolean} hasDocsScripts - JavaScripts documentation (JSDoc) is available
 * @property {boolean} hasStats - Rollup stats are available
 */
