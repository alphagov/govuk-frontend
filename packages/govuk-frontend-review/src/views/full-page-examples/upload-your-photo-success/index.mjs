import express from 'express'
import { body, matchedData, validationResult } from 'express-validator'
import multer from 'multer'

import { formatValidationErrors } from '../../../utils.mjs'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/upload-your-photo-success',

  upload.single('photo'),

  body('photo').custom((value, { req }) => {
    const { file } = req
    if (!file) {
      throw new Error('Select a photo')
    }
    if (!file.mimetype.startsWith('image')) {
      throw new Error('Your photo must be an image')
    }
    if (file.size >= 10 * 1000000) {
      throw new Error('Your photo must be smaller than 10MB')
    }
    return true
  }),

  body('terms-and-conditions')
    .notEmpty()
    .withMessage('Select I accept the terms and conditions'),

  (req, res) => {
    const { example } = res.locals

    const viewPath = `./full-page-examples/${example.path}`
    const errors = formatValidationErrors(validationResult(req))

    const { file } = req
    if (file) {
      console.log('Uploaded file information:')
      delete file.buffer
      console.table(file)
    }

    res.render(`${viewPath}/index`, {
      file,
      errors,
      errorSummary: errors ? Object.values(errors) : null,
      values: matchedData(req, { onlyValidData: false }) // In production this should sanitized.
    })
  }
)

export default router
