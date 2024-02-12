import express from 'express'

const router = express.Router()

router.post(
  '/upload-your-photo-success',

  (req, res) => {
    const { example } = res.locals

    const viewPath = `./full-page-examples/${example.path}`

    res.render(`${viewPath}/index`, {
      isSuccess: true
    })
  }
)

export default router
