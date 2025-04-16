const { addFunction } = require('govuk-prototype-kit').views
const config = require('govuk-prototype-kit/lib/config.js').getConfig(null)

addFunction('govukRebrand', () => config.rebrand ?? false)
