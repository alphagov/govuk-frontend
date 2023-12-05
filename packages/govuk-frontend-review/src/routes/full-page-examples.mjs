import express from 'express'

import { getFullPageExamples } from '../common/lib/files.mjs'
import * as routes from '../views/full-page-examples/index.mjs'

const router = express.Router()
const fullPageExamples = await getFullPageExamples()
const fullPageExampleNames = fullPageExamples.map(({ path }) => path)

// Full page examples, custom handlers
const fullPageExampleRoutes = Object.values(routes).flatMap(({ stack }) =>
  stack.map(({ route }) => route)
)

/**
 * Handle parameter :exampleName
 *
 * Adds context for full page examples for `{{ example.title }}` etc
 */
router.param(
  'exampleName',

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @param {string} exampleName
   */
  (req, res, next, exampleName) => {
    const example = fullPageExamples.find(
      (example) => example.path === exampleName
    )

    // Update response locals
    res.locals.example = example

    next()
  }
)

/**
 * Full page example name handler
 *
 * Empty handler ensures `router.param()` matches above to populate
 * `res.locals.example` before routes with custom handling are run
 */
router.all('/:exampleName', (req, res, next) => next())

/**
 * Full page example and 404 handler
 */
router.get('/:exampleName', (req, res, next) => {
  const { exampleName } = req.params

  // Check for known examples
  const hasExample = fullPageExampleNames.includes(exampleName)

  // Check for named custom examples with GET handlers
  const hasRouter = fullPageExampleRoutes.some(
    ({ path, methods }) => methods.get && path === `/${exampleName}`
  )

  // Continue to page not found or next matching route
  if (!hasExample || hasRouter) {
    return next()
  }

  res.render(`full-page-examples/${exampleName}/index`)
})

/**
 * Full page examples index
 */
router.get('/', (req, res) => {
  res.render('full-page-examples/index', {
    fullPageExamples
  })
})

/**
 * Full page example custom handling
 */
for (const route of Object.values(routes)) {
  router.use(route)
}

export default router
