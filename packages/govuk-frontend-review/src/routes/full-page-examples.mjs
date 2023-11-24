import express from 'express'

import { getFullPageExamples } from '../common/lib/files.mjs'
import * as routes from '../views/full-page-examples/index.mjs'

const router = express.Router()
const fullPageExamples = await getFullPageExamples()
const fullPageExampleNames = fullPageExamples.map(({ path }) => path)

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
 * Full page example
 */
router.get('/:exampleName', (req, res, next) => {
  const { exampleName } = req.params

  // No matching example so continue to page not found
  if (!fullPageExampleNames.includes(exampleName)) {
    return next()
  }

  res.render(`full-page-examples/${exampleName}/index`)
})

export default router
