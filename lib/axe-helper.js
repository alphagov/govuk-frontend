const { configureAxe } = require('jest-axe')

const axe = configureAxe({
  rules: {
    // As we're testing incomplete HTML fragments, we don't expect there to be a
    // skip link, nor for everything to be contained within landmarks.
    'skip-link': { enabled: false },
    region: { enabled: false }
  }
})

module.exports = axe
