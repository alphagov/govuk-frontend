import express from 'express'

const router = express.Router()

// List of currently available flags. Used to name the associated flags.
// Best kept to a single word.
//
// e.g. 'example' will become:
// - 'use_example' for the cookie and query string name
// - 'override_example' for the override query name
// - 'govukExample' for the Nunjucks environment global
const availableFeatureFlags = ['rebrand', 'test']

/**
 * Control feature flag cookie setting and unsetting
 *
 * If `setFeatureFlags` is present in request body, it will loop through the
 * list of available flags, enabling the flag where included in
 * `setFeatureFlags` and disabling it otherwise. If the query isn't in the
 * request body, all flags are unset. It then redirects back to the referrer.
 */
router.post('/set-feature-flags', (req, res) => {
  const queryName = 'setFeatureFlags'

  if (queryName in req.body) {
    const maxAgeInDays = 28
    let setFlags = req.body[queryName]

    // Form data can be provided in two ways:
    // - a string with the name of a single flag
    // - an array of strings with the names of flags

    // If we get a string, turn it into a single value array for the next step
    if (typeof setFlags === 'string') {
      setFlags = [setFlags]
    }

    // Loop through all possible feature flags.
    // If each id in the `setFlags` array, enable the cookie, otherwise, clear the cookie
    availableFeatureFlags.forEach((flag) => {
      if (setFlags.includes(flag)) {
        res.cookie(`use_${flag}`, 'true', {
          maxAge: maxAgeInDays * 86400000, // 1 day in milliseconds
          httpOnly: true
        })
      } else {
        res.clearCookie(`use_${flag}`)
      }
    })
  } else {
    // req.body is empty or missing the key we want, in which case we can
    // consider all flags to be unchecked
    availableFeatureFlags.forEach((flag) => {
      res.clearCookie(`use_${flag}`)
    })
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
  availableFeatureFlags.forEach((flag) => {
    const queryFlagName = `use_${flag}`
    const queryOverrideName = `override_${flag}`

    const env = req.app.get('nunjucksEnv')

    res.locals[queryFlagName] =
      queryOverrideName in req.query
        ? req.query[queryOverrideName] === 'true'
        : req.cookies?.[queryFlagName] === 'true'

    // Set the flag as a Nunjucks global
    // CamelCased with `govuk` prefix e.g. `govukExample`
    env?.addGlobal(
      `govuk${flag.charAt(0).toUpperCase() + flag.slice(1)}`,
      res.locals[queryFlagName]
    )
  })

  // TODO: Commented out as this seems to be based on a binary system:
  // `true` refers to all examples with the rebrand flag set and `false`
  // refers to all other examples. This probably needs to be entirely rewritten
  // to support multiple feature flags.

  // Check for existence of `showAllFlagStates` in query body
  // res.locals.showAllFlagStates = 'showAllFlagStates' in req.query

  // If `showAllFlagStates` is true, render all examples, otherwise …?
  // res.locals.exampleStates = res.locals.showAllFlagStates
  //   ? [true, false]
  //   : []

  next()
})

export default router
