import express from 'express'

import { getFullPageExamples } from '../common/lib/files.mjs'
import * as routes from '../views/full-page-examples/index.mjs'

const router = express.Router()
const fullPageExamples = await getFullPageExamples()
const fullPageExampleNames = fullPageExamples.map(({ path }) => path)

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
 * Full page examples index
 */
router.get('/', (req, res) => {
  res.render('full-page-examples/index', {
    fullPageExamples
  })
})

/**
 * Full page example 404 handler
 */
router.all('/:exampleName', (req, res, next) => {
  const { exampleName } = req.params

  // No matching example so flag as page not found
  // for other routes mounted to '/:exampleName'
  if (!fullPageExampleNames.includes(exampleName)) {
    res.status(404)
  }

  next()
})

/**
 * Full page example custom handling
 */
for (const route of Object.values(routes)) {
  router.use(route)
}

/**
 * Full page example
 */
router.get('/:exampleName', (req, res, next) => {
  const { exampleName } = req.params

  // No matching example so continue to page not found
  if (res.statusCode !== 200) {
    return next()
  }

  res.render(`full-page-examples/${exampleName}/index`)
})

export default router
