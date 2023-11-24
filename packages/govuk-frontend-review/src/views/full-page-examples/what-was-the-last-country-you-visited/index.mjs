import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/what-was-the-last-country-you-visited',

    body('last-visited-country')
      .exists()
      .not()
      .isEmpty()
      .withMessage('Enter the last country you visited'),

    (req, res) => {
      const errors = formatValidationErrors(validationResult(req))
      if (errors) {
        return res.render(
          './full-page-examples/what-was-the-last-country-you-visited/index',
          {
            errors,
            errorSummary: Object.values(errors),
            values: req.body // In production this should sanitized.
          }
        )
      }
      res.render(
        './full-page-examples/what-was-the-last-country-you-visited/confirm'
      )
    }
  )
}
