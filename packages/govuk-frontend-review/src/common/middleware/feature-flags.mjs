import express from 'express'

const router = express.Router()

const FEATURE_NAME = 'rebrand'
const COOKIE_NAME = `use_old_brand`

/**
 * Control old brand cookie setting and unsetting
 *
 * Sets the old brand cookie if unsetRebrand is present in request body,
 * otherwise unsets the cookie, then redirects.
 */
router.post(`/unset-${FEATURE_NAME}`, (req, res) => {
  const queryName = `unset${FEATURE_NAME.charAt(0).toUpperCase() + FEATURE_NAME.slice(1)}`

  if (queryName in req.body) {
    const maxAgeInDays = 28

    res.cookie(COOKIE_NAME, 'true', {
      maxAge: maxAgeInDays * 24 * 60 * 60 * 1000,
      httpOnly: true
    })
  } else {
    res.clearCookie(COOKIE_NAME)
  }

  res.redirect(req.header('Referer') ?? '/')
})

/**
 * Set local variables for controlling the feature flag system
 *
 * - useRebrand is set first using the recolourOverride query and then the cookie
 * - showAllFlagStates is set via the query of the same name
 */
router.use((req, res, next) => {
  const localVarName = `use${FEATURE_NAME.charAt(0).toUpperCase() + FEATURE_NAME.slice(1)}`
  const overrideQuery = `${FEATURE_NAME}Override`
  const env = req.app.get('nunjucksEnv')

  res.locals[localVarName] =
    overrideQuery in req.query
      ? req.query[overrideQuery] === 'true'
      : req.cookies?.[COOKIE_NAME] !== 'true'
  res.locals.showAllFlagStates = 'showAllFlagStates' in req.query

  res.locals.exampleStates = res.locals.showAllFlagStates
    ? [true, false]
    : [res.locals.useRebrand]

  // set the govukRebrand global
  env?.addGlobal('govukRebrand', res.locals[localVarName])

  next()
})

export default router
