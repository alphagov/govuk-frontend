import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { packageTypeToPath } from '@govuk-frontend/lib/names'
import express from 'express'

const router = express.Router()

// Resolve GOV.UK Frontend from review app `node_modules`
// to allow previous versions to be installed locally
const frontendPath = packageTypeToPath('govuk-frontend', {
  modulePath: '/',
  moduleRoot: paths.app
})

/**
 * Add middleware to serve static assets
 */

router.use('/assets', express.static(join(frontendPath, 'assets')))
router.use('/javascripts', express.static(frontendPath))
router.use('/stylesheets', [
  express.static(frontendPath),
  express.static(join(paths.app, 'dist/stylesheets'))
])

export default router
