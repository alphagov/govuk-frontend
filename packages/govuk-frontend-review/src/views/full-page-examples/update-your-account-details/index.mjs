import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post(
  '/update-your-account-details',

  body('email')
    .notEmpty()
    .withMessage('Enter your email address')
    .isEmail()
    .withMessage(
      'Enter an email address in the correct format, like name@example.com'
    ),

  body('password').notEmpty().withMessage('Enter your password'),

  (req, res) => {
    const { example } = res.locals

    const viewPath = `./full-page-examples/${example.path}`
    const errors = formatValidationErrors(validationResult(req))

    if (!errors) {
      return res.render(`${viewPath}/confirm`)
    }

    res.render(`${viewPath}/index`, {
      errors,
      errorSummary: Object.values(errors),
      values: matchedData(req, { onlyValidData: false }) // In production this should sanitized.
    })
  }
)

export default router
