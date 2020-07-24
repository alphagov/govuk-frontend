const { configureAxe } = require('jest-axe')

// As we're testing incomplete HTML fragments, we don't expect there to be a
// skip link, or for them to be contained within landmarks.
const axe = configureAxe({
  rules: {
    'skip-link': { enabled: false },
    region: { enabled: false }
  }
})

module.exports = axe
