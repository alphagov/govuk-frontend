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

module.exports = (app) => {
  app.post(
    '/full-page-examples/passport-details',
    [
      body('passport-number')
        .exists()
        .not().isEmpty().withMessage('Enter your passport number'),
      body('expiry-day')
        .exists()
        .not().isEmpty().withMessage('Enter your expiry day'),
      body('expiry-month')
        .exists()
        .not().isEmpty().withMessage('Enter your expiry month'),
      body('expiry-year')
        .exists()
        .not().isEmpty().withMessage('Enter your expiry year')
    ],
    (request, response) => {
      const errors = getErrors(validationResult(request))

      if (!errors) {
        return response.render('./full-page-examples/passport-details/confirm')
      }

      // If any of the date inputs error apply a general error.
      const expiryNamePrefix = 'expiry'
      const expiryErrors = Object.values(errors).filter(error => error.id.includes(expiryNamePrefix + '-'))
      if (expiryErrors) {
        const firstExpiryErrorId = expiryErrors[0].id
        // Get the first error message and merge it into a single error message.
        errors[expiryNamePrefix] = {
          id: expiryNamePrefix,
          href: '#' + firstExpiryErrorId
        }

        // Construct a single error message based on all three error messages.
        errors[expiryNamePrefix].text = 'Enter your expiry '
        if (expiryErrors.length === 3) {
          errors[expiryNamePrefix].text += 'date'
        } else {
          errors[expiryNamePrefix].text += expiryErrors.map(error => error.text.replace('Enter your expiry ', '')).join(' and ')
        }
      }

      let errorSummary = Object.values(errors)
      if (expiryErrors) {
        // Remove all other errors from the summary so we only have one message that links to the expiry input.
        errorSummary = errorSummary.filter(error => !error.id.includes(expiryNamePrefix + '-'))
      }

      response.render('./full-page-examples/passport-details/index', {
        errors,
        errorSummary,
        values: request.body // In production this should sanitized.
      })
    }
  )
}
