import { join } from 'path'

import express from 'express'
import { paths } from 'govuk-frontend-config'
import { packageNameToPath } from 'govuk-frontend-lib/names'

const router = express.Router()

/**
 * Add middleware to serve static assets
 */

router.use('/assets', express.static(packageNameToPath('govuk-frontend', 'dist/govuk/assets')))
router.use('/javascripts', express.static(join(paths.app, 'dist/javascripts')))
router.use('/stylesheets', express.static(join(paths.app, 'dist/stylesheets')))

export default router
