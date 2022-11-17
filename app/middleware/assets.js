const express = require('express')

const configPaths = require('../../config/paths.js')
const router = express.Router()

/**
 * Add middleware to serve static assets
 */
router.use('/assets', express.static(configPaths.assets))
router.use('/public', express.static(configPaths.public))

module.exports = router
