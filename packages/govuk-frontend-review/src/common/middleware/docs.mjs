import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import express from 'express'

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
  const { isDeployedToHeroku } =
    /** @type {import('../../app.mjs').FeatureFlags} */ (app.get('flags'))

  if (isDeployedToHeroku) {
    return res.redirect(
      'https://frontend.design-system.service.gov.uk/sass-api-reference/'
    )
  }

  next()
})

/**
 * Add middleware
 */
router.use('/sass', express.static(join(paths.app, 'dist/docs/sassdoc')))
router.use('/javascript', express.static(join(paths.app, 'dist/docs/jsdoc')))
router.use('/stats', express.static(join(paths.stats, 'dist')))

export default router
