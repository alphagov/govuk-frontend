import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/have-you-changed-your-name',

    body('changed-name')
      .not()
      .isEmpty()
      .withMessage('Select if you have changed your name'),

    (req, res) => {
      const errors = formatValidationErrors(validationResult(req))
      if (errors) {
        return res.render(
          './full-page-examples/have-you-changed-your-name/index',
          {
            errors,
            errorSummary: Object.values(errors),
            values: req.body // In production this should sanitized.
          }
        )
      }
      res.render('./full-page-examples/have-you-changed-your-name/confirm')
    }
  )
}
