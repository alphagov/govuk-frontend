const express = require('express')
const formController = express.Router()
const { body, validationResult } = require('express-validator/check')

// To make it easier to use in the view, might be nicer as a Nunjucks function
function getErrors (errorsInstance) {
  if (errorsInstance.isEmpty()) {
    return false
  }
  const errors = errorsInstance.array()
  const formattedErrors = {}
  errors.forEach(error => {
    formattedErrors[error.param] = {
      id: error.param,
      href: '#' + error.param,
      value: error.value,
      text: error.msg
    }
  })
  return formattedErrors
}

formController.post('/update-your-account-details',
  [
    body('email')
      .exists()
      .not().isEmpty().withMessage('Enter your email address'),
    body('password')
      .exists()
      .not().isEmpty().withMessage('Enter your password')
  ],
  (request, response) => {
    const errors = getErrors(validationResult(request))

    if (!errors) {
      return response.render('./full-page-examples/update-your-account-details/confirm')
    }

    response.render('./full-page-examples/update-your-account-details/index', {
      errors,
      errorSummary: Object.values(errors),
      values: request.body // In production this should sanitized.
    })
  }
)

module.exports = formController
