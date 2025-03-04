import express from 'express'

import featureFlags from '../lib/feature-flags.json' with { type: 'json' }

const router = express.Router()

router.use((req, res, next) => {
  // If we have the expected query param in the URL handle the cookie setting

  for (const flag of featureFlags) {
    if (req.method === 'GET' && flag.param in req.query) {
      if (req.query[flag.param] === 'true') {
        const maxAgeInDays = 28

        res.cookie(flag.cookieName, 'yes', {
          maxAge: maxAgeInDays * 24 * 60 * 60 * 1000,
          httpOnly: true
        })
      } else {
        res.clearCookie(flag.cookieName)
      }

      const urlWithoutQueryString = req.url.split('?')[0]
      return res.redirect(urlWithoutQueryString)
    }
  }

  // Let express carry on and  handle the request as usual
  next()
})

router.use((req, res, next) => {
  res.locals.featureFlagStates = {}

  for (const flag of featureFlags) {
    if (`${flag.param}Override` in req.query) {
      res.locals.featureFlagStates[flag.param] =
        req.query[`${flag.param}Override`] !== 'false'
    } else {
      res.locals.featureFlagStates[flag.param] =
        req.cookies?.[flag.cookieName] === 'yes'
    }
  }
  next()
})

router.use((req, res, next) => {
  res.locals.showAllFlagStates =
    'showAllFlagStates' in req.query && req.query.showAllFlagStates === 'true'
  next()
})

export default router
