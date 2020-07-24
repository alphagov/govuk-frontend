const { body, validationResult } = require('express-validator')
const { formatValidationErrors } = require('../../../utils.js')

module.exports = (app) => {
  app.post(
    '/full-page-examples/what-was-the-last-country-you-visited',
    [
      body('last-visited-country')
        .exists()
        .not().isEmpty().withMessage('Enter the last country you visited')
    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/what-was-the-last-country-you-visited/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/what-was-the-last-country-you-visited/confirm')
    }
  )
}
