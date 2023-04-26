import { join } from 'path'

import express from 'express'
import { paths } from 'govuk-frontend-config'

const router = express.Router()

/**
 * Add middleware to serve static assets
 */
router.use('/assets', express.static(join(paths.app, 'dist/assets')))
router.use('/javascripts', express.static(join(paths.app, 'dist/javascripts')))
router.use('/stylesheets', express.static(join(paths.app, 'dist/stylesheets')))

export default router
