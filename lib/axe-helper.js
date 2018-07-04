const { configureAxe } = require('jest-axe')

const axe = configureAxe({
  rules: {
    // As we're testing incomplete HTML fragments, we don't expect there to be a
    // skip link.
    'skip-link': { enabled: false }
  }
})

module.exports = axe
