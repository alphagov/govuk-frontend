import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/how-do-you-want-to-sign-in',

    body('sign-in')
      .not()
      .isEmpty()
      .withMessage('Select how you want to sign in'),

    (req, res) => {
      const errors = formatValidationErrors(validationResult(req))
      if (errors) {
        return res.render(
          './full-page-examples/how-do-you-want-to-sign-in/index',
          {
            errors,
            errorSummary: Object.values(errors),
            values: req.body // In production this should sanitized.
          }
        )
      }
      res.render('./full-page-examples/how-do-you-want-to-sign-in/confirm')
    }
  )
}
