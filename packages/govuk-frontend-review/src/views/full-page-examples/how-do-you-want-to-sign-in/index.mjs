import { body, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

/**
 * @param {import('express').Application} app
 */
export default (app) => {
  app.post(
    '/full-page-examples/how-do-you-want-to-sign-in',
    [
      body('sign-in')
        .not().isEmpty().withMessage('Select how you want to sign in')
    ],

    /**
     * @param {import('express').Request} request
     * @param {import('express').Response} response
     * @returns {void}
     */
    (request, response) => {
      const errors = formatValidationErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/how-do-you-want-to-sign-in/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/how-do-you-want-to-sign-in/confirm')
    }
  )
}
