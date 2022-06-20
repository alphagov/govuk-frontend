import './vendor/polyfills/Array/prototype/indexOf'

/**
 * i18n support initialisation function
 *
 * @constructor
 * @param    {object}  options               - Options object.
 * @param    {string}  options.locale        - The locale to use, currently this is only used for pluralisation rules. If undefined, tries to use html[lang].
 * @param    {object}  options.translations  - Key-value pairs of the translation strings to use.
 */
function I18n (options) {
  options = options || {}

  // Get user-defined locale setting,
  // Otherwise, try and detect it from the document,
  // Otherwise, set to English
  this.locale = options.locale || document.documentElement.lang || 'en'

  // Define the separators used for placeholders.
  // Currently uses the same syntax as GOV.UK (e.g. %{keyName}).
  // e.g. https://github.com/alphagov/govuk_publishing_components/blob/22944a9efaea3ae495a518717415694c71cfdb35/config/locales/en.yml
  this.separators = ['%{', '}']

  // List of translations
  this.translations = options.translations
}

/**
 * The most used function - processes translation strings, determining which
 * plural forms to use and running placeholder replacement.
 *
 * ALL properties passed to `options` will be exposed as options for string
 * interpolation, but only `count` initiates special functionality.
 *
 * TODO: Do we want to put string interpolation options in their own object (e.g. `options.data`) to avoid potential conflict in future?
 * TODO: Do we need some context/gendered forms support? Not sure if anything currently in Frontend necessitates this.
 *
 * @param    {string}  lookupKey         - The lookup key of the string to use.
 * @param    {object}  options           - Options object.
 * @param    {number}  options.count     - Number used to determine which pluralisation to use.
 * @returns  {string}                    - The formatted translation string.
 */
I18n.prototype.t = function (lookupKey, options) {
  options = options || {}
  var outputString = lookupKey

  // Error if no lookup key has been provided
  // Otherwise assign the string to our processing variable
  if (!lookupKey) {
    console.log(new Error('i18n lookup key missing.'))
    return
  } else {
    outputString = this.translations[lookupKey]
  }

  // If the `count` option is set, determine which plural suffix is needed
  // In order of priority:
  // 1. Pluralised lookup key provided in translations
  // 2. Plural object fallback text
  // 3. String fallback text
  if (typeof options.count !== 'undefined') {
    var pluralSuffix = this.getPluralSuffix(options.count)
    var pluralLookupKey = lookupKey + '_' + pluralSuffix
    if (this.translations[pluralLookupKey]) {
      outputString = this.translations[pluralLookupKey]
    }
  }

  // Replace any placeholders in the string with the actual data
  if (outputString.match(new RegExp(this.separators[0] + '.+' + this.separators[1]))) {
    outputString = this.replacePlaceholders(outputString, options)
  }

  return outputString
}

/**
 * Ingests phrases containing placeholders and spits out the formatted phrase.
 *
 * @param    {string}  phrase          - The phrase containing the placeholder.
 * @param    {object}  placeholderMap  - Key-value pairs of placeholders and the values that replace them.
 */
I18n.prototype.replacePlaceholders = function (phrase, placeholderMap) {
  for (var key in placeholderMap) {
    var value = placeholderMap[key]

    // If the key is `count`, subject the value to number formatting
    // This is limiting, just so we don't accidentally format things like phone numbers
    if (this.hasIntlNumberFormatSupport() && key === 'count') {
      value = Intl.NumberFormat(this.locale).format(value)
    }

    // Perform the replacement
    phrase = phrase.replace(new RegExp(this.separators[0] + key + this.separators[1], 'g'), value)
  }
  return phrase
}

/**
 * Get the appropriate suffix for the plural form.
 *
 * The locale may include a regional indicator (such as en-GB), but we don't
 * usually care about this part, as pluralisation rules are usually the same
 * regardless of region. There are exceptions, however, (e.g. Portuguese) so
 * this searches by both the full and shortened locale codes, just to be sure.
 *
 * @param    {number}  count       - Number used to determine which pluralisation to use.
 * @returns  {string}              - The suffix associated with the correct pluralisation for this locale.
 */
I18n.prototype.getPluralSuffix = function (count) {
  var locale = this.locale
  var localeShort = (locale.length > 2) ? locale.substring(0, 2) : locale
  var keySuffix = 'other'

  // Validate that the number is actually a number.
  //
  // Number(count) will turn anything that can't be converted to a Number type
  // into 'NaN'. isFinite filters out NaN, as it isn't a finite number.
  count = Number(count)
  if (!isFinite(count)) { return keySuffix }

  // Check to verify that all the requirements for Intl.PluralRules are met.
  // If so, we can use that instead of our custom implementation. Otherwise,
  // use the hardcoded fallback.
  if (this.hasIntlPluralRulesSupport()) {
    var pluralRules = new Intl.PluralRules(this.locale)
    keySuffix = pluralRules.select(count)
  } else {
    // Currently we only have code to handle positive integers, so let's make sure
    // our number is one of those.
    count = Math.abs(Math.floor(count))

    // Look through the plural rules map to find which `pluralRule` is appropriate
    // for our current `locale`.
    for (var pluralRule in this.pluralRulesMap) {
      if (Object.prototype.hasOwnProperty.call(this.pluralRulesMap, pluralRule)) {
        var languages = this.pluralRulesMap[pluralRule]
        if (languages.indexOf(locale) > -1 || languages.indexOf(localeShort) > -1) {
          keySuffix = this.pluralRules[pluralRule](count)
          break
        }
      }
    }
  }

  return keySuffix
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
  belarusian: function (n) {
    var lastTwo = n % 100
    var last = lastTwo % 10
    if (last === 1 && lastTwo !== 11) { return 'one' }
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) { return 'few' }
    if (last === 0 || (last >= 5 && last <= 9) || (lastTwo >= 11 && lastTwo <= 14)) { return 'many' }
    return 'other'
  },
  chinese: function () {
    return 'other'
  },
  cornish: function (n) {
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    return 'other'
  },
  czech: function (n) {
    if (n === 1) { return 'one' }
    if (n >= 2 && n <= 4) { return 'few' }
    return 'other'
  },
  french: function (n) {
    return n === 0 || n === 1 ? 'one' : 'other'
  },
  german: function (n) {
    return n === 1 ? 'one' : 'other'
  },
  hebrew: function (n) {
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    if (n % 10 === 0 && !(n >= 0 && n <= 10)) { return 'many' }
    return 'other'
  },
  icelandic: function (n) {
    return n % 10 === 1 && n % 100 !== 11 ? 'one' : 'other'
  },
  irish: function (n) {
    if (n === 1) { return 'one' }
    if (n === 2) { return 'two' }
    if (n >= 3 && n <= 6) { return 'few' }
    if (n >= 7 && n <= 10) { return 'many' }
    return 'other'
  },
  latvian: function (n) {
    if (n % 10 === 0 || (n % 100 >= 11 && n % 100 <= 19)) { return 'zero' }
    if (n % 10 === 1 && n % 100 !== 11) { return 'one' }
    return 'other'
  },
  lithuanian: function (n) {
    var lastTwo = n % 100
    var last = lastTwo % 10
    if (last === 1 && !(lastTwo >= 11 && lastTwo <= 19)) { return 'one' }
    if (last >= 2 && last <= 9 && !(lastTwo >= 11 && lastTwo <= 19)) { return 'few' }
    return 'other'
  },
  polish: function (n) {
    if (n === 1) { return 'one' }
    var lastTwo = n % 100
    var last = lastTwo % 10
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) { return 'few' }
    if (last === 0 || last === 1 || (last >= 5 && last <= 9) || (lastTwo >= 12 && lastTwo <= 14)) { return 'many' }
    return 'other'
  },
  romanian: function (n) {
    if (n === 1) { return 'one' }
    if (n === 0 || (n % 100 >= 2 && n % 100 <= 19)) { return 'few' }
    return 'other'
  },
  russian: function (n) {
    var lastTwo = n % 100
    var last = lastTwo % 10
    if (last === 1 && lastTwo !== 11) { return 'one' }
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) { return 'few' }
    if (last === 0 || (last >= 5 && last <= 9) || (lastTwo >= 11 && lastTwo <= 14)) { return 'many' }
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
 * Map of plural rules to languages where those rules apply.
 *
 * Note: These groups are named for the most dominant or recognisable language
 * that uses each system. The groupings do not imply that the languages are
 * related to one another. Many languages have evolved the same systems
 * independently of one another.
 *
 * Spreadsheet of which languages require which plural forms:
 * https://docs.google.com/spreadsheets/d/1sFMhSX-ma7-_myYoRGh6DboHfN0xuN-1VRJ0ClVvNa8/edit
 *
 * Currently supported:
 * Arabic: Arabic (ar)
 * Belarusian: Belarusian (be)
 * Chinese: Burmese (my), Chinese (zh), Indonesian (id), Japanese (ja), Javanese (jv), Korean (ko), Malay (ms), Thai (th), Vietnamese (vi)
 * Cornish: Cornish (kw)
 * Czech: Czech (cs)
 * French: Armenian (hy), French (fr), Hindi (hi), Persian Farsi (fa), Punjabi (pa), Zulu (zu)
 * German: Afrikaans (af), Albanian (sq), Azerbaijani (az), Basque (eu), Bulgarian (bg), Catalan (ca), Danish (da), Dutch (nl), English (en), Estonian (et), Finnish (fi), Georgian (ka), German (de), Greek (el), Hungarian (hu), Luxembourgish (lb), Norwegian (no), Somali (so), Swahili (sw), Swedish (sv), Tamil (ta), Telugu (te), Turkish (tr), Urdu (ur)
 * Hebrew: Hebrew (he)
 * Icelandic: Icelandic (is), Macedonian (mk)
 * Irish: Irish Gaelic (ga)
 * Latvian: Latvian (lv)
 * Lithuanian: Lithuanian (lt)
 * Polish: Bosnian (bs), Croatian (hr), Polish (pl)
 * Romanian: Romanian (ro)
 * Russian: Russian (ru), Ukrainian (uk)
 * Scottish: Scottish Gaelic (gd)
 * Spanish: European Portuguese (pt-PT), Italian (it), Spanish (es)
 * Welsh: Welsh (cy)
 */
I18n.prototype.pluralRulesMap = {
  arabic: ['ar'],
  belarusian: ['be'],
  chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
  cornish: ['kw'],
  czech: ['cs'],
  french: ['hy', 'fr', 'hi', 'fa', 'pa', 'zu'],
  german: ['af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka', 'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'],
  hebrew: ['he'],
  icelandic: ['is', 'mk'],
  irish: ['ga'],
  latvian: ['lv'],
  lithuanian: ['lt'],
  polish: ['bs', 'hr', 'pl'],
  romanian: ['ro'],
  russian: ['ru', 'uk'],
  scottish: ['gd'],
  spanish: ['pt-PT', 'it', 'es'],
  welsh: ['cy']
}

export default I18n
