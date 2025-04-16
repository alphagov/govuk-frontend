import { resolve } from 'path'

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
 * Full page example name handler
 *
 * Empty handlers ensure `router.param()` matches above to populate
 * `res.locals.example` before routes with custom handling are run
 */
router.all('/:exampleName', (req, res, next) => next())
router.all('/:exampleName/confirm', (req, res, next) => next())

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

/**
 * Full page example and 404 handler
 */
router.get('/:exampleName', (req, res, next) => {
  const { exampleName } = req.params

  // No matching example? Continue to page not found
  if (!fullPageExampleNames.includes(exampleName)) {
    return next()
  }

  res.render(`full-page-examples/${exampleName}/index`)
})

/**
 * Full page example confirmation page and 404 handler
 */
router.get('/:exampleName/confirm', (req, res, next) => {
  const { exampleName } = req.params

  // No matching example? Continue to page not found
  if (!fullPageExampleNames.includes(exampleName)) {
    return next()
  }

  res.render(`full-page-examples/${exampleName}/confirm`)
})

/**
 * Dynamically serve images for use in examples
 */
router.get('/:exampleName/images/:fileName', function (req, res, next) {
  const { exampleName, fileName } = req.params

  const options = {
    root: resolve(`src/views/full-page-examples/${exampleName}/images`)
  }

  res.sendFile(fileName, options, function (err) {
    if (err) {
      next()
    }
  })
})

export default router
