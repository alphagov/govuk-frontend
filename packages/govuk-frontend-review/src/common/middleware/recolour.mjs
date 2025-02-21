import express from 'express'

const router = express.Router()

const RECOLOUR_COOKIE_NAME = 'use-recolour'

router.use((req, res, next) => {
  const { cookies } = req

  res.locals.useRecolourClass = cookies?.[RECOLOUR_COOKIE_NAME] === 'yes'
  res.locals.pizza = cookies

  next()
})

router.get('/recolour-on', (req, res) => {
  const maxAgeInDays = 28
  const redirectURL = req.header('Referer')

  res.cookie(RECOLOUR_COOKIE_NAME, 'yes', {
    maxAge: maxAgeInDays * 24 * 60 * 60 * 1000,
    httpOnly: true
  })

  // Redirect to where the user POSTed from
  // or default to the Review app home page
  res.redirect(redirectURL ?? '/')
})

router.get('/recolour-off', (req, res) => {
  const redirectURL = req.header('Referer')

  res.clearCookie(RECOLOUR_COOKIE_NAME)

  res.redirect(redirectURL ?? '/')
})

export default router
