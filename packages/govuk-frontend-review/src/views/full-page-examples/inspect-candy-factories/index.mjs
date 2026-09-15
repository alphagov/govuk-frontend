import { join } from 'path'

import { paths } from '@govuk-frontend/config'
import { getListing } from '@govuk-frontend/lib/files'
import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()
const mockServiceSlug = 'src/views/full-page-examples/inspect-candy-factories'
const pages = await getListing(join(paths.app, `${mockServiceSlug}/*.njk`))
// Build strict list of pages in the service to help us sanitise user input
// when getting pages
const servicePages = pages.map((page) => {
  return page
    .substring(page.lastIndexOf(`${mockServiceSlug}/`), page.indexOf('.njk'))
    .replace(`${mockServiceSlug}/`, '')
})

router.get('/inspect-candy-factories/:slug', (req, res, next) => {
  // Match slug to page list and abort route if it's not an existing page
  const page = servicePages.find(
    (servicePage) => servicePage === req.params.slug
  )

  if (!page) {
    return next()
  }

  res.render(`full-page-examples/inspect-candy-factories/${page}`, {
    queryData: req.query
  })
})

// List of pages that require validation for post routes
// Include option to render an interruption page with a function specifying
// the condition to check the interruption page for
const formPages = [
  {
    name: 'name',
    validation: body('name').notEmpty().withMessage('Enter your name'),
    nextPage: 'age'
  },
  {
    name: 'age',
    validation: body('age')
      .notEmpty()
      .withMessage('Enter your age')
      .isNumeric()
      .withMessage('Enter a number'),
    interruption: {
      check: (number) => number < 18,
      page: 'check-age'
    },
    nextPage: 'photo'
  },
  {
    name: 'photo',
    validation: body('photo').notEmpty().withMessage('Upload your photo'),
    nextPage: 'check-answers'
  }
]

for (const page of formPages) {
  router.post(
    `/inspect-candy-factories/${page.name}`,
    page.validation,
    (req, res) => {
      const errors = formatValidationErrors(validationResult(req))

      if (!errors) {
        if (page.interruption && page.interruption.check(req.body[page.name])) {
          return res.redirect(
            303,
            `/full-page-examples/inspect-candy-factories/${page.interruption.page}?${page.name}=${req.body[page.name]}`
          )
        }

        return res.redirect(
          303,
          `/full-page-examples/inspect-candy-factories/${page.nextPage}`
        )
      }

      res.render(`full-page-examples/inspect-candy-factories/${page.name}`, {
        errors,
        errorSummary: Object.values(errors),
        values: matchedData(req, { onlyValidData: false }) // In production this should sanitized.
      })
    }
  )
}

export default router
