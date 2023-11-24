import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/what-is-your-postcode',

    body('address-postcode')
      .exists()
      .not()
      .isEmpty()
      .withMessage('Enter your home postcode'),

    (req, res) => {
      const errors = formatValidationErrors(validationResult(req))
      if (errors) {
        return res.render('./full-page-examples/what-is-your-postcode/index', {
          errors,
          errorSummary: Object.values(errors),
          values: req.body // In production this should sanitized.
        })
      }
      res.render('./full-page-examples/what-is-your-postcode/confirm')
    }
  )
}
