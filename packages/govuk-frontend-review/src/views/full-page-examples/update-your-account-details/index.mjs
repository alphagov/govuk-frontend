import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/update-your-account-details',

    body('email')
      .exists()
      .isEmail()
      .withMessage(
        'Enter an email address in the correct format, like name@example.com'
      )
      .not()
      .isEmpty()
      .withMessage('Enter your email address'),

    body('password')
      .exists()
      .not()
      .isEmpty()
      .withMessage('Enter your password'),

    (req, res) => {
      const errors = formatValidationErrors(validationResult(req))

      if (!errors) {
        return res.render(
          './full-page-examples/update-your-account-details/confirm'
        )
      }

      res.render('./full-page-examples/update-your-account-details/index', {
        errors,
        errorSummary: Object.values(errors),
        values: req.body // In production this should sanitized.
      })
    }
  )
}
