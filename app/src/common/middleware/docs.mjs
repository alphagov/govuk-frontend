import { join } from 'path'

import express from 'express'

import { paths } from '../../../../config/index.js'

const router = express.Router()

/**
 * Sass docs have moved
 */
router.get('/', (req, res) => {
  return res.redirect('./sass')
})

/**
 * Sass docs latest release (when deployed)
 */
router.use('/sass', ({ app }, res, next) => {
  const { isDeployedToHeroku } = app.get('flags')

  if (isDeployedToHeroku) {
    return res.redirect('https://frontend.design-system.service.gov.uk/sass-api-reference/')
  }

  next()
})

/**
 * Add middleware
 */
router.use('/sass', express.static(join(paths.app, 'dist/docs/sassdoc')))
router.use('/javascript', express.static(join(paths.app, 'dist/docs/jsdoc')))

export default router
