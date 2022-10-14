const express = require('express')

const configPaths = require('../../config/paths.js')
const router = express.Router()

/**
 * Sass docs latest release (when deployed)
 */
router.use('/', ({ app }, res, next) => {
  const { isDeployedToHeroku } = app.get('flags')

  if (isDeployedToHeroku) {
    return res.redirect('https://frontend.design-system.service.gov.uk/sass-api-reference/')
  }

  next()
})

/**
 * Add middleware
 */
router.use('/', express.static(configPaths.sassdoc))

module.exports = router
