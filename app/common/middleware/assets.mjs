import { join } from 'path'

import express from 'express'

import configPaths from '../../../config/paths.js'

const router = express.Router()

/**
 * Add middleware to serve static assets
 */
router.use('/assets', express.static(join(configPaths.public, 'assets')))
router.use('/javascripts', express.static(join(configPaths.public, 'javascripts')))
router.use('/stylesheets', express.static(join(configPaths.public, 'stylesheets')))

export default router
