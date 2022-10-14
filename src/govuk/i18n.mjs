/**
 * i18n support initialisation function
 *
 * @constructor
 * @param  {Object}  translations   - Key-value pairs of the translation strings to use.
 * @param  {Object}  config         - Configuration options for the function.
 * @param  {String}  config.locale  - An overriding locale for the PluralRules functionality.
 */
export function I18n (translations, config) {
  config = config || {}

  // Make list of translations available throughout function
  this.translations = translations || {}

  // The locale to use for PluralRules and NumberFormat
  this.locale = config.locale || document.documentElement.lang || 'en'
}

/**
 * The most used function - takes the key for a given piece of UI text and
 * returns the appropriate string.
 *
 * @param    {String}  lookupKey  - The lookup key of the string to use.
 * @param    {Object}  options    - Any options passed with the translation string, e.g: for string interpolation.
 * @returns  {String}             - The appropriate translation string.
 */
I18n.prototype.t = function (lookupKey, options) {
  if (!lookupKey) {
    // Print a console error if no lookup key has been provided
    throw new Error('i18n: lookup key missing')
  }

  // If the `count` option is set, determine which plural suffix is needed and
  // change the lookupKey to match. We check to see if it's undefined instead of
  // falsy, as this could legitimately be 0.
  if (options && typeof options.count !== 'undefined') {
    // Get the plural suffix
    var pluralSuffix = this.getPluralSuffix(options.count)

    // Overwrite our existing lookupKey
    lookupKey = lookupKey + '.' + pluralSuffix

    // Throw an error if this new key doesn't exist
    if (!(lookupKey in this.translations)) {
      throw new Error('i18n: Plural form ".' + pluralSuffix + '" is required for "' + this.locale + '" locale')
    }
  }

  if (lookupKey in this.translations) {
    // Fetch the translation string for that lookup key
    var translationString = this.translations[lookupKey]

    // Check for ${} placeholders in the translation string
    if (translationString.match(/%{(.\S+)}/)) {
      if (!options) {
        throw new Error('i18n: cannot replace placeholders in string if no option data provided')
      }

      return this.replacePlaceholders(translationString, options)
    } else {
      return translationString
    }
  } else {
    // If the key wasn't found in our translations object,
    // return the lookup key itself as the fallback
    return lookupKey
  }
}

/**
 * Takes a translation string with placeholders, and replaces the placeholders
 * with the provided data
 *
 * @param    {String}  translationString  - The translation string
 * @param    {Object}  options    - Any options passed with the translation string, e.g: for string interpolation.
 * @returns  {String}             - The translation string to output, with ${} placeholders replaced
 */
I18n.prototype.replacePlaceholders = function (translationString, options) {
  // eslint-disable-next-line prefer-regex-literals
  var placeholderRegex = RegExp(/%{(.\S+)}/, 'g')
  var placeholderMatch

  // Use `exec` for fetching regex matches, as matchAll() is not supported in IE
  while ((placeholderMatch = placeholderRegex.exec(translationString)) !== null) {
    var placeholderIncludingBraces = placeholderMatch[0]
    var placeholderKey = placeholderMatch[1]
    if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
      var placeholderValue = options[placeholderKey]

      // If a user has passed `false` as the value for the placeholder
      // treat it as though the value should not be displayed
      if (placeholderValue === false) {
        translationString = translationString.replace(placeholderIncludingBraces, '')
      }

      // If the placeholder's value is a number, localise the number formatting
      if (typeof placeholderValue === 'number' && this.hasIntlNumberFormatSupport()) {
        placeholderValue = new Intl.NumberFormat(this.locale).format(placeholderValue)
      }

      translationString = translationString.replace(placeholderIncludingBraces, placeholderValue)
    } else {
      throw new Error('i18n: no data found to replace ' + placeholderMatch[0] + ' placeholder in string')
    }
  }

  return translationString
}

/**
 * Check to see if the browser supports Intl and Intl.PluralRules.
 *
 * It requires all conditions to be met in order to be supported:
 * - The browser supports the Intl class (true in IE11)
 * - The implementation of Intl supports PluralRules (NOT true in IE11)
 * - The browser/OS has plural rules for the current locale (browser dependent)
 *
 * @returns  {boolean}  - Returns true if all conditions are met. Returns false otherwise.
 */
I18n.prototype.hasIntlPluralRulesSupport = function () {
  return Boolean(window.Intl && ('PluralRules' in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length))
}

/**
 * Check to see if the browser supports Intl and Intl.NumberFormat.
 *
 * It requires all conditions to be met in order to be supported:
 * - The browser supports the Intl class (true in IE11)
 * - The implementation of Intl supports NumberFormat (also true in IE11)
 * - The browser/OS has number formatting rules for the current locale (browser dependent)
 *
 * @returns  {boolean}  - Returns true if all conditions are met. Returns false otherwise.
 */
I18n.prototype.hasIntlNumberFormatSupport = function () {
  return Boolean(window.Intl && ('NumberFormat' in window.Intl && Intl.NumberFormat.supportedLocalesOf(this.locale).length))
}

/**
 * Get the appropriate suffix for the plural form.
 *
 * @param    {number}  count       - Number used to determine which pluralisation to use.
 * @returns  {string}              - The suffix associated with the correct pluralisation for this locale.
 */
I18n.prototype.getPluralSuffix = function (count) {
  // Validate that the number is actually a number.
  //
  // Number(count) will turn anything that can't be converted to a Number type
  // into 'NaN'. isFinite filters out NaN, as it isn't a finite number.
  count = Number(count)
  if (!isFinite(count)) { return 'other' }

  // Check to verify that all the requirements for Intl.PluralRules are met.
  // If so, we can use that instead of our custom implementation. Otherwise,
  // use the hardcoded fallback.
  if (this.hasIntlPluralRulesSupport()) {
    return new Intl.PluralRules(this.locale).select(count)
  } else {
    return this.selectPluralRuleFromFallback(count)
  }
}

/**
 * Get the plural rule using our fallback implementation
 *
 * This is split out into a separate function to make it easier to test the
 * fallback behaviour in an environment where Intl.PluralRules exists.
 *
 * @param {Number} count - Number used to determine which pluralisation to use.
 * @returns {string} - The suffix associated with the correct pluralisation for this locale.
 */
I18n.prototype.selectPluralRuleFromFallback = function (count) {
  // Currently our custom code can only handle positive integers, so let's
  // make sure our number is one of those.
  count = Math.abs(Math.floor(count))

  var ruleset = this.getPluralRulesForLocale()

  if (ruleset) {
    return this.pluralRules[ruleset](count)
  }

  return 'other'
}

/**
 * Work out which pluralisation rules to use for the current locale
 *
 * The locale may include a regional indicator (such as en-GB), but we don't
 * usually care about this part, as pluralisation rules are usually the same
 * regardless of region. There are exceptions, however, (e.g. Portuguese) so
 * this searches by both the full and shortened locale codes, just to be sure.
 *
 * @returns {string} - The name of the pluralisation rule to use (a key for one
 *   of the functions in this.pluralRules)
 */
I18n.prototype.getPluralRulesForLocale = function () {
  var locale = this.locale
  var localeShort = locale.split('-')[0]

  // Look through the plural rules map to find which `pluralRule` is
  // appropriate for our current `locale`.
  for (var pluralRule in this.pluralRulesMap) {
    if (Object.prototype.hasOwnProperty.call(this.pluralRulesMap, pluralRule)) {
      var languages = this.pluralRulesMap[pluralRule]
      if (languages.indexOf(locale) > -1 || languages.indexOf(localeShort) > -1) {
        return pluralRule
      }
    }
  }
}

/**
 * Map of plural rules to languages where those rules apply.
 *
 * Note: These groups are named for the most dominant or recognisable language
 * that uses each system. The groupings do not imply that the languages are
 * related to one another. Many languages have evolved the same systems
 * independently of one another.
 *
 * Code to support more languages can be found in the i18n spike:
 * https://github.com/alphagov/govuk-frontend/blob/spike-i18n-support/src/govuk/i18n.mjs
 *
 * Languages currently supported:
 *
 * Arabic: Arabic (ar)
 * Chinese: Burmese (my), Chinese (zh), Indonesian (id), Japanese (ja),
 *   Javanese (jv), Korean (ko), Malay (ms), Thai (th), Vietnamese (vi)
 * French: Armenian (hy), Bangla (bn), French (fr), Gujarati (gu), Hindi (hi),
 *   Persian Farsi (fa), Punjabi (pa), Zulu (zu)
 * German: Afrikaans (af), Albanian (sq), Azerbaijani (az), Basque (eu),
 *   Bulgarian (bg), Catalan (ca), Danish (da), Dutch (nl), English (en),
 *   Estonian (et), Finnish (fi), Georgian (ka), German (de), Greek (el),
 *   Hungarian (hu), Luxembourgish (lb), Norwegian (no), Somali (so),
 *   Swahili (sw), Swedish (sv), Tamil (ta), Telugu (te), Turkish (tr),
 *   Urdu (ur)
 * Irish: Irish Gaelic (ga)
 * Russian: Russian (ru), Ukrainian (uk)
 * Scottish: Scottish Gaelic (gd)
 * Spanish: European Portuguese (pt-PT), Italian (it), Spanish (es)
 * Welsh: Welsh (cy)
 */
I18n.prototype.pluralRulesMap = {
  arabic: ['ar'],
  chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
  french: ['hy', 'bn', 'fr', 'gu', 'hi', 'fa', 'pa', 'zu'],
  german: [
    'af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka',
    'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'
  ],
  irish: ['ga'],
  russian: ['ru', 'uk'],
  scottish: ['gd'],
  spanish: ['pt-PT', 'it', 'es'],
  welsh: ['cy']
}

/**
 * Different pluralisation rule sets
 *
 * Returns the appropriate suffix for the plural form associated with `n`.
 * Possible suffixes: 'zero', 'one', 'two', 'few', 'many', 'other' (the actual
 * meaning of each differs per locale). 'other' should always exist, even in
 * languages without plurals, such as Chinese.
 * https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html
 *
 * @param    {number}  n  - The `count` number being passed through. This must be a positive integer. Negative numbers and decimals aren't accounted for.
 * @returns  {string}     - The string that needs to be suffixed to the key (without separator).
 */
I18n.prototype.pluralRules = {
  arabic: function (n) {
    if (n === 0) { return 'zero' }
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    if (n % 100 >= 3 && n % 100 <= 10) { return 'few' }
    if (n % 100 >= 11 && n % 100 <= 99) { return 'many' }
    return 'other'
  },
  chinese: function () {
    return 'other'
  },
  french: function (n) {
    return n === 0 || n === 1 ? 'one' : 'other'
  },
  german: function (n) {
    return n === 1 ? 'one' : 'other'
  },
  irish: function (n) {
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    if (n >= 3 && n <= 6) { return 'few' }
    if (n >= 7 && n <= 10) { return 'many' }
    return 'other'
  },
  russian: function (n) {
    var lastTwo = n % 100
    var last = lastTwo % 10
    if (last === 1 && lastTwo !== 11) { return 'one' }
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) { return 'few' }
    if (last === 0 || (last >= 5 && last <= 9) || (lastTwo >= 11 && lastTwo <= 14)) { return 'many' }
    // Note: The 'other' suffix is only used by decimal numbers in Russian.
    // We don't anticipate it being used, but it's here for consistency.
    return 'other'
  },
  scottish: function (n) {
    if (n === 1 || n === 11) { return 'one' }
    if (n === 2 || n === 12) { return 'two' }
    if ((n >= 3 && n <= 10) || (n >= 13 && n <= 19)) { return 'few' }
    return 'other'
  },
  spanish: function (n) {
    if (n === 1) { return 'one' }
    if (n % 1000000 === 0 && n !== 0) { return 'many' }
    return 'other'
  },
  welsh: function (n) {
    if (n === 0) { return 'zero' }
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    if (n === 3) { return 'few' }
    if (n === 6) { return 'many' }
    return 'other'
  }
}

/**
 * Associates translated messages to plural type they correspond to.
 *
 * Allows to group pluralised messages under a single key when passing
 * translations to a component's constructor
 *
 * @typedef {object} PluralisedTranslation
 * @property {string} other
 * @property {string} [zero]
 * @property {string} [one]
 * @property {string} [two]
 * @property {string} [few]
 * @property {string} [many]
 */
