const { body, validationResult } = require('express-validator')
const { formatValidationErrors } = require('../../../utils.js')

module.exports = (app) => {
  app.post(
    '/full-page-examples/what-is-your-address',
    [
      body('address-line-1')
        .exists()
        .not().isEmpty().withMessage('Enter your building and street'),
      body('address-town')
        .exists()
        .not().isEmpty().withMessage('Enter your town and city'),
      body('address-county')
        .exists()
        .not().isEmpty().withMessage('Enter your county'),
      body('address-postcode')
        .exists()
        .not().isEmpty().withMessage('Enter your postcode')
    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/what-is-your-address/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/what-is-your-address/confirm')
    }
  )
}
