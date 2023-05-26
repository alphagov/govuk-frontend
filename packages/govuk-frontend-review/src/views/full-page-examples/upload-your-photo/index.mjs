import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/upload-your-photo',
    [
      body('photo')
        .exists()
        .not().isEmpty().withMessage('Select a photo'),
      body('terms-and-conditions')
        .not().isEmpty().withMessage('Select I accept the terms and conditions')
    ],

    /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {void}
     */
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/upload-your-photo/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/upload-your-photo/confirm')
    }
  )
}
