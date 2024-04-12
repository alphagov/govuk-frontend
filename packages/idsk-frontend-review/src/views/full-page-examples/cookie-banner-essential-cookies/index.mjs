import express from 'express'

const router = express.Router()

router.post('/cookie-banner-essential-cookies', (req, res) => {
  const { example } = res.locals

  const viewPath = `./full-page-examples/${example.path}`

  res.render(`${viewPath}/index`, {
    cookies: req.body.cookies
  })
})

export default router
