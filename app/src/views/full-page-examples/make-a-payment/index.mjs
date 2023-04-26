import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

export default (app) => {
  app.post(
    '/full-page-examples/make-a-payment',
    [
      body('telephone-number')
        .exists()
        .not().isEmpty().withMessage('Enter an amount, in pounds')
    ],
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/make-a-payment/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/make-a-payment/confirm')
    }
  )
}
