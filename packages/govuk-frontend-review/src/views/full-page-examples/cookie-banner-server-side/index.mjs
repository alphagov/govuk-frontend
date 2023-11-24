import express from 'express'

const router = express.Router()

router.post('/cookie-banner-server-side', (req, res) => {
  res.render('./full-page-examples/cookie-banner-server-side/index', {
    cookies: req.body.cookies
  })
})

export default router
