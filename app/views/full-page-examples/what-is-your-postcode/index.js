const express = require('express')
const formController = express.Router()
const { body, validationResult } = require('express-validator/check')
const { formatValidationErrors } = require('../../../utils.js')

formController.post('/what-is-your-postcode',
  [
    body('address-postcode')
      .exists()
      .not().isEmpty().withMessage('Enter your home postcode')
  ],
  (request, response) => {
    const errors = formatValidationErrors(validationResult(request))
    if (errors) {
      return response.render('./full-page-examples/what-is-your-postcode/index', {
        errors,
        errorSummary: Object.values(errors),
        values: request.body // In production this should sanitized.
      })
    }
    response.render('./full-page-examples/what-is-your-postcode/confirm')
  }
)

module.exports = formController
