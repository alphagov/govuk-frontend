const { body, validationResult } = require('express-validator/check')
const { formatValidationErrors } = require('../../../utils.js')

module.exports = (app) => {
  app.post(
    '/full-page-examples/applicant-details',
    [
      body('full-name')
        .exists()
        .not().isEmpty().withMessage('Enter your full name'),
      body('dob-day')
        .exists()
        .not().isEmpty().withMessage('Enter your date of birth day'),
      body('dob-month')
        .exists()
        .not().isEmpty().withMessage('Enter your date of birth month'),
      body('dob-year')
        .exists()
        .not().isEmpty().withMessage('Enter your date of birth year')
    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))

      if (!errors) {
        return response.render('./full-page-examples/applicant-details/confirm')
      }

      // If any of the date inputs error apply a general error.
      const dobNamePrefix = 'dob'
      const dobErrors = Object.values(errors).filter(error => error.id.includes(dobNamePrefix + '-'))
      if (dobErrors) {
        const firstdobErrorId = dobErrors[0].id
        // Get the first error message and merge it into a single error message.
        errors[dobNamePrefix] = {
          id: dobNamePrefix,
          href: '#' + firstdobErrorId
        }

        // Construct a single error message based on all three error messages.
        errors[dobNamePrefix].text = 'Enter your date of birth '
        if (dobErrors.length === 3) {
          errors[dobNamePrefix].text += 'date'
        } else {
          errors[dobNamePrefix].text += dobErrors.map(error => error.text.replace('Enter your date of birth ', '')).join(' and ')
        }
      }

      let errorSummary = Object.values(errors)
      if (dobErrors) {
        // Remove all other errors from the summary so we only have one message that links to the dob input.
        errorSummary = errorSummary.filter(error => !error.id.includes(dobNamePrefix + '-'))
      }

      response.render('./full-page-examples/applicant-details/index', {
        errors,
        errorSummary,
        values: request.body // In production this should sanitized.
      })
    }
  )
}
