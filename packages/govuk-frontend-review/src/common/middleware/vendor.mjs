import express from 'express'
import { packageNameToPath } from 'govuk-frontend-lib/names'

const router = express.Router()

/**
 * Add middleware to serve dependencies
 * from node_modules
 */
router.use('/iframe-resizer/', express.static(packageNameToPath('iframe-resizer', 'js')))

export default router
