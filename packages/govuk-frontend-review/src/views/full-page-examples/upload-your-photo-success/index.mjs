import express from 'express'

const router = express.Router()

router.post(
  '/upload-your-photo-success',

  (req, res) => {
    res.render('./full-page-examples/upload-your-photo-success/index', {
      isSuccess: true
    })
  }
)

export default router
