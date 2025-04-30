const { addFunction } = require('govuk-prototype-kit').views
const config = require('govuk-prototype-kit/lib/config.js').getConfig()

/**
 * Adds a global function to the nunjucks env of prototypes to define the state
 * of `govukRebrand`.
 *
 * Only applies the rebrand if the following is present in a user's prototype config:
 *
 * "plugins": {
 *  "govuk-frontend": {
 *    "rebrand": true
 *  }
 * }
 *
 * Steps through each required param to check that they're present, then returns
 * the state of `rebrand`. If any of the params aren't present or `rebrand` is
 * falsey, return a falsey value.
 *
 * We're finicky about checking each param because, besides the fact that we don't
 * know if each param might be present, `getConfig` by default swallows the error
 * if ./app/config.json isn't present so this makes sure that a user's prototype
 * still runs even if their config doesn't exist for some reason.
 */
addFunction('govukRebrand', () => config?.plugins?.['govuk-frontend']?.rebrand)
