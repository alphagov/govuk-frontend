/**
 * All-in-one localisation string function
 * @constructor
 * @param    {string}  key                       - The 'key' that the localisation string is trying to use
 * @param    {object}  options                   - Options for how to handle or interpret the localisation string
 * @property {boolean} options.enableParserLogic - Whether to enable more complex (and computationally-heavy) parsing
 * @property {string}  options.fallback          - The string to use if one can't be found in the i18n object
 * @property {object}  options.placeholders      - Key-value pairs of string replacements to make
 * @return   {string}                            - The resulting string after it has been parsed
 */
function i18n (key, options) {
  // Pre-flight check - make sure key exists
  if (!key) {
    console.error(new Error('i18n key missing.'))
  }

  // Default options
  var defaultOptions = {
    enableParserLogic: false,
    fallback: key,
    placeholders: {}
  }

  // Create options object
  options = typeof options === 'undefined' ? {} : options
  options = Object.assign({}, defaultOptions, options)

  // Pre-flight check - get the GOVUKFrontend.i18n object if it exists,
  // otherwise set an empty object
  var i18nOverrides = typeof window.GOVUKFrontend.i18n === 'undefined' ? {} : window.GOVUKFrontend.i18n

  // Find the string. Operates in this order of priority:
  // 1. Look for a property in the GOVUKFrontend.i18n object
  // 2. Otherwise, use the fallback string
  var formattedString = (i18nOverrides[key]) ? i18nOverrides[key] : options.fallback

  // If any placeholders are defined, find and replace them
  if (options.placeholders.length) {
    formattedString = this.replacePlaceholders(formattedString, options.placeholders)
  }

  return formattedString
}

i18n.prototype.replacePlaceholders = function (string, placeholderMap) {
  // %{keyName} is the format used in GOV.UK's locale files
  // Seemed sensible to keep it consistent
  // https://github.com/alphagov/govuk_publishing_components/blob/22944a9efaea3ae495a518717415694c71cfdb35/config/locales/en.yml
  for (var key in placeholderMap) {
    string = string.replaceAll('%{' + key + '}', placeholderMap[key])
  }
  return string
}

i18n.prototype.runParserLogic = function (string) {
  // Scratch notes on potential parser logic
  // Cribbed from banana-i18n: https://github.com/wikimedia/banana-i18n/blob/master/src/emitter.js
  //
  // PLURALS: %{#plural: number | singular | plural1 | plural2 ... }
  // e.g. "I have %{num} %{#plural:%{num}|cat|cats}." => "I have 1 cat.", "I have 8 cats."
  // — Other languages can have several plural forms (e.g. Arabic has six), we need to handle that.
  //
  // GENDERED FORMS: %{#gender: gender | masculine | feminine | neutral }
  // e.g. "Do you have %{#gender:%{gender}|his|her|their} number?" => "Do you have her number?"
  //
  // GRAMMAR:
  // — Some languages (e.g. Finnish) have words that are modified according to the grammar of the statement.
  // — These differences are entirely locale specific, and can only really be handled by having JS specific to the locale.
  return string
}

export default i18n
