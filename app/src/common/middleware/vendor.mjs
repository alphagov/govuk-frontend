import express from 'express'
import { packageNameToPath } from 'govuk-frontend-lib/names'

const router = express.Router()

/**
 * Add middleware to serve HTML5 Shiv
 * from node_modules
 */
router.use('/html5-shiv/', express.static(packageNameToPath('html5shiv', 'dist')))

/**
 * Add middleware to serve legacy code
 * from node_modules
 */
router.use('/govuk_template/', express.static(packageNameToPath('govuk_template_jinja', 'assets')))
router.use('/govuk_frontend_toolkit/assets', express.static(packageNameToPath('govuk_frontend_toolkit', 'images')))
router.use('/govuk_frontend_toolkit/', express.static(packageNameToPath('govuk_frontend_toolkit', 'javascripts/govuk')))
router.use('/iframe-resizer/', express.static(packageNameToPath('iframe-resizer', 'js')))
router.use('/jquery/', express.static(packageNameToPath('jquery', 'dist')))

export default router
