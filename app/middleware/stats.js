const express = require('express')
const serveIndex = require('serve-index')

const configPaths = require('../../config/paths')
const router = express.Router()

// Serve the files themselves
router.use(express.static(configPaths.stats))
// Serve the directory listings, to allow navigating to the files
router.use(serveIndex(configPaths.stats))

module.exports = router
