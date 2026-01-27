import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import express from 'express'

const router = express.Router()

/**
 * Sass docs have moved
 */
router.get('/', (req, res) => {
  return res.redirect('./sass')
})

/**
 * Add middleware
 */
router.use('/sass', express.static(join(paths.app, 'dist/docs/sassdoc')))
router.use('/javascript', express.static(join(paths.app, 'dist/docs/jsdoc')))
router.use('/stats', express.static(join(paths.stats, 'dist')))

export default router
