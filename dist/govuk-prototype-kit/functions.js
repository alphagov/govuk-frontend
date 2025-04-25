const { addFunction } = require('govuk-prototype-kit').views
const config = require('govuk-prototype-kit/lib/config.js').getConfig()

/**
 * Adds a global function to the nunjucks env of prototypes to define the state
 * of `govukRebrand`.
 *
 * Only applies the rebrand if the following is present in a user's prototype config:
 *
 * ```json
 * "plugins": {
 *  "govuk-frontend": {
 *    "rebrand": true
 *  }
 * }
 * ```
 *
 * Firstly checks if `config` is present, then steps through each required param to
 * check that they're present, then returns the state of `rebrand`. If any of
 * the params aren't present or `rebrand` is falsey, return a falsey value.
 *
 * We check that `config` is present first because `getConfig` by default swallows
 * the error if ./app/config.json isn't present so this makes sure that a user's
 * prototype still runs even if their config doesn't exist for some reason
 */
addFunction('govukRebrand', () => config?.plugins?.['govuk-frontend']?.rebrand)
