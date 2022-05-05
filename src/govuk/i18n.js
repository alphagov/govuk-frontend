import Polyglot from './vendor/Polyglot'
// import Polyglot from '../../node_modules/node-polyglot/index.js'
// var Polyglot = require('node-polyglot')

// The default strings for each key
// These are used if no override has been specified
// var defaultLabels = {
//   accordion: {
//     hideAllSections: 'Hide all sections',
//     showAllSections: 'Show all sections',
//     hideThisSection: 'Hide<span class="govuk-visually-hidden"> this section</span>',
//     showThisSection: 'Show<span class="govuk-visually-hidden"> this section</span>'
//   }
// }

var I18n = new Polyglot({
  // locale is *only* used for determining which plural rules apply, not what translation strings are used.
  // A selection of plural rules are included in Polyglot, though custom ones can be made using the `pluralRules` param
  // https://github.com/airbnb/polyglot.js#custom-pluralization-rules
  // TODO: Do we need some way of overriding this?
  locale: document.documentElement.lang,
  // An object containing the phrases that we should use
  phrases: (window.GOVUKFrontendI18n) ? window.GOVUKFrontendI18n : {}
})

export default I18n
