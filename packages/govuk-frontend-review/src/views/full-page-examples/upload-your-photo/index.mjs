import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/upload-your-photo',

    body('photo').exists().not().isEmpty().withMessage('Select a photo'),

    body('terms-and-conditions')
      .not()
      .isEmpty()
      .withMessage('Select I accept the terms and conditions'),

    (req, res) => {
      const viewPath = './full-page-examples/upload-your-photo'
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
}
