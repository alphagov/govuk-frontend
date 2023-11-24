import express from 'express'
import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post(
  '/what-is-your-nationality',

  body('confirm-nationality').custom((value, { req }) => {
    // See https://github.com/express-validator/express-validator/pull/658
    const cannotProvideNationality =
      !!req.body['details-cannot-provide-nationality']
    // If the user cannot provide their nationality and has given us separate details
    // then do not show an error for the nationality fields.
    if (cannotProvideNationality) {
      return true
    }
    if (!value) {
      throw new Error('Select your nationality or nationalities')
    }
    return true
  }),

  body('country-name').custom((value, { req }) => {
    // See https://github.com/express-validator/express-validator/pull/658
    const confirmedNationality = req.body['confirm-nationality'] || []
    // If the other country option is selected and there's no value.
    if (confirmedNationality.includes('other-country-nationality') && !value) {
      throw new Error('Enter your country')
    }
    return true
  }),

  (req, res) => {
    const viewPath = './full-page-examples/what-is-your-nationality'
    const errors = formatValidationErrors(validationResult(req))

    if (!errors) {
      return res.render(`${viewPath}/confirm`)
    }

    res.render(`${viewPath}/index`, {
      errors,
      errorSummary: Object.values(errors),
      values: req.body // In production this should sanitized.
    })
  }
)

export default router
