import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

export default (app) => {
  app.post(
    '/full-page-examples/will-you-be-travelling-to-any-of-these-countries',
    [
      body('countries')
        .custom((value, { req: request }) => {
          // See https://github.com/express-validator/express-validator/pull/658
          const cannotProvideNationality = !!request.body['details-cannot-provide-nationality']
          // If the user cannot provide their nationality and has given us separate details
          // then do not show an error for the nationality fields.
          if (cannotProvideNationality) {
            return true
          }
          if (!value) {
            throw new Error('Select countries you will be travelling to, or select ‘No, I will not be travelling to any of these countries’')
          }
          return true
        })
    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/will-you-be-travelling-to-any-of-these-countries/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/will-you-be-travelling-to-any-of-these-countries/confirm')
    }
  )
}
