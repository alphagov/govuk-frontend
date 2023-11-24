import express from 'express'

const router = express.Router()

const BANNER_COOKIE_NAME = 'dismissed-app-banner'

/**
 * Show app banner based on cookie or query
 */
router.use((req, res, next) => {
  const { query, cookies } = req

  res.locals.shouldShowAppBanner = !(
    cookies?.[BANNER_COOKIE_NAME] === 'yes' || 'hide-banner' in query
  )

  next()
})

/**
 * Save and redirect when app banner dismissed
 */
router.post('/hide-banner', (req, res) => {
  const maxAgeInDays = 28
  const redirectURL = req.header('Referer')

  res.cookie(BANNER_COOKIE_NAME, 'yes', {
    maxAge: maxAgeInDays * 24 * 60 * 60 * 1000,
    httpOnly: true
  })

  // Redirect to where the user POSTed from
  // or default to the Review app home page
  res.redirect(redirectURL ?? '/')
})

export default router
