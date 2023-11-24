import express from 'express'
import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

router.post(
  '/update-your-account-details',

  body('email')
    .exists()
    .isEmail()
    .withMessage(
      'Enter an email address in the correct format, like name@example.com'
    )
    .not()
    .isEmpty()
    .withMessage('Enter your email address'),

  body('password').exists().not().isEmpty().withMessage('Enter your password'),

  (req, res) => {
    const viewPath = './full-page-examples/update-your-account-details'
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
