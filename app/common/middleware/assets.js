const { join } = require('path')

const express = require('express')

const configPaths = require('../../../config/paths')
const router = express.Router()

/**
 * Add middleware to serve static assets
 */
router.use('/assets', express.static(join(configPaths.public, 'assets')))
router.use('/javascripts', express.static(join(configPaths.public, 'javascripts')))
router.use('/stylesheets', express.static(join(configPaths.public, 'stylesheets')))

module.exports = router
