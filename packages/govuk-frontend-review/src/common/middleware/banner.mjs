import express from 'express'

const router = express.Router()

const BANNER_COOKIE_NAME = 'dismissed-app-banner'

/**
 * Show app banner based on cookie or query
 */
router.use((req, res, next) => {
  const { query, cookies } = req

  if ('hide-banner' in query) {
    res.locals.shouldShowAppBanner = false
    return next()
  }

  const cookie = cookies?.[BANNER_COOKIE_NAME]

  if (cookie === 'yes') {
    res.locals.shouldShowAppBanner = false
    return next()
  }

  res.locals.shouldShowAppBanner = true

  next()
})

/**
 * Save and redirect when app banner dismissed
 */
router.post('/hide-banner', (req, res) => {
  const maxAgeInDays = 28
  res.cookie(BANNER_COOKIE_NAME, 'yes', {
    maxAge: maxAgeInDays * 24 * 60 * 60 * 1000,
    httpOnly: true
  })
  // Redirect to where the user POSTed from.
  const previousURL = req.header('Referer') || '/'
  res.redirect(previousURL)
})

export default router
