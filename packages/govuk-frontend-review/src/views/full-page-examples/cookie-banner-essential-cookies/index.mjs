import express from 'express'

const router = express.Router()

router.post('/cookie-banner-essential-cookies', (req, res) => {
  res.render('./full-page-examples/update-your-account-details/confirm', {
    cookies: req.body.cookies
  })
})

export default router
