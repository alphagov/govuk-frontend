import express from 'express'

import { getExampleNames } from '../common/lib/files.mjs'

const router = express.Router()
const exampleNames = await getExampleNames()

/**
 * Other example
 */
router.get('/:exampleName', (req, res, next) => {
  const { exampleName } = req.params

  // Unknown example, continue to page not found
  if (!exampleNames.includes(exampleName)) {
    return next()
  }

  res.render(`examples/${exampleName}/index`, {
    exampleName,

    // Render with random number for unique non-visited links
    randomPageHash: (Math.random() * 1000000).toFixed()
  })
})

export default router
