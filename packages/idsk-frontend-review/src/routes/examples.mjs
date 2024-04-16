import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { getDirectories } from '@govuk-frontend/lib/files'
import express from 'express'

const router = express.Router()
const exampleNames = await getDirectories(join(paths.app, 'src/views/examples'))

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
