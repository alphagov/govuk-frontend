import { join } from 'path'

import express from 'express'

import { paths } from '../../../../config/index.js'

const router = express.Router()

/**
 * Add middleware to serve static assets
 */
router.use('/assets', express.static(join(paths.public, 'assets')))
router.use('/javascripts', express.static(join(paths.public, 'javascripts')))
router.use('/stylesheets', express.static(join(paths.public, 'stylesheets')))

export default router
