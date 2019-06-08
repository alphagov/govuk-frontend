const { body, validationResult } = require('express-validator/check')
const { formatValidationErrors } = require('../../../utils.js')

module.exports = (app) => {
  app.post(
    '/full-page-examples/upload-your-photo',
    [
      body('photo')
        .exists()
        .not().isEmpty().withMessage('Select a photo'),
      body('terms-and-conditions')
        .exists()
        .not().isEmpty().withMessage('Select I accept the terms and conditions')
    ],
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
