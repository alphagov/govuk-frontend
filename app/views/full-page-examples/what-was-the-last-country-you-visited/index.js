const express = require('express')
const formController = express.Router()
const { body, validationResult } = require('express-validator/check')
const { formatValidationErrors } = require('../../../utils.js')

formController.post('/what-was-the-last-country-you-visited',
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

module.exports = formController
