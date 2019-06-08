const { body, validationResult } = require('express-validator/check')
const { formatValidationErrors } = require('../../../utils.js')

module.exports = (app) => {
  app.post(
    '/full-page-examples/what-is-your-nationality',
    [
      body('confirm-nationality')
        .custom((value, { req: request }) => {
          // See https://github.com/express-validator/express-validator/pull/658
          const cannotProvideNationality = !!request.body['details-cannot-provide-nationality']
          // If the user cannot provide their nationality and has given us separate details
          // then do not show an error for the nationality fields.
          if (cannotProvideNationality) {
            return true
          }
          if (!value) {
            throw new Error('Select your nationality or nationalities')
          }
          return true
        }),
      body('country-name')
        .custom((value, { req: request }) => {
          // See https://github.com/express-validator/express-validator/pull/658
          const confirmedNationality = request.body['confirm-nationality'] || []
          // If the other country option is selected and there's no value.
          if (
            confirmedNationality.includes('other-country-nationality') &&
              !value
          ) {
            throw new Error('Enter your country')
          }
          return true
        })
    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/what-is-your-nationality/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/what-is-your-nationality/confirm')
    }
  )
}
