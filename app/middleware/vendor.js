const express = require('express')

const router = express.Router()

/**
 * Add middleware to serve HTML5 Shiv
 * from node_modules
 */
router.use('/html5-shiv/', express.static('node_modules/html5shiv/dist/'))

/**
 * Add middleware to serve legacy code
 * from node_modules
 */
router.use('/govuk_template/', express.static('node_modules/govuk_template_jinja/assets/'))
router.use('/govuk_frontend_toolkit/assets', express.static('node_modules/govuk_frontend_toolkit/images'))
router.use('/govuk_frontend_toolkit/', express.static('node_modules/govuk_frontend_toolkit/javascripts/govuk/'))
router.use('/jquery/', express.static('node_modules/jquery/dist'))

module.exports = router
