/**
 * i18n support initialisation function
 *
 * @constructor
 * @param    {object}  options               - Options object.
 * @param    {string}  options.locale        - The locale to use, currently this is only used for pluralisation rules. If undefined, tries to use html[lang].
 * @param    {object}  options.translations  - Key-value pairs of the translation strings to use.
 * @param    {array}   options.separators    - An array of two items matching the start and end strings to search for when performing interpolation. Defaults to ['%{', '}']
 */
function i18n (options) {
  options = options || {}

  // Get user-defined locale setting,
  // otherwise try and detect it from the document,
  // otherwise set to English
  this.locale = options.locale || document.documentElement.lang || 'en'

  // Get user-defined interpolation separators,
  // otherwise, use the same Ruby-like syntax as GOV.UK (e.g. %{keyName})
  // e.g. https://github.com/alphagov/govuk_publishing_components/blob/22944a9efaea3ae495a518717415694c71cfdb35/config/locales/en.yml
  this.separators = options.separators && options.separators.length === 2
    ? options.separators
    : ['%{', '}']

  // Flatten the list of translations
  this.translations = this.flatten(options.translations)
}

/**
 * The most used function - looks up translation strings and sorts what operations to perform on them.
 *
 * ALL properties passed to `options` will be exposed as options for string interpolation,
 * but only `count` and `fallback` initiate special functionality.
 *
 * TODO: Add pluralisation support for fallback strings.
 * TODO: Do we want to put string interpolation options in their own object (e.g. `options.data`) to avoid potential conflict in future?
 * TODO: Do we need some context/gendered forms support? Not sure if anything currently in Frontend necessitates this.
 *
 * @param    {string}  lookupKey         - The lookup key of the string to obtain
 * @param    {object}  options           - Options object.
 * @param    {number}  options.count     - Number used to determine which pluralisation to use.
 * @param    {string}  options.fallback  - Fallback string to use if a string associated with the key could not be found.
 * @returns  {string}                    - The formatted, localised string.
 */
i18n.prototype.t = function (lookupKey, options) {
  options = options || {}

  // If the `count` option is set, get the lookup key for the appropriate plural
  lookupKey = (typeof options.count !== 'undefined')
    ? this.getPluralKey(lookupKey, options.count)
    : lookupKey

  // Get the string from the translations object,
  // otherwise use the fallback, if one is defined,
  // otherwise just output the key name (better than nothing!)
  var outputString = this.translations[lookupKey] || options.fallback || lookupKey

  // Replace any placeholders in the string with the actual data
  outputString = this.replacePlaceholders(outputString, options)

  return outputString
}

/**
 * Ingests phrases containing placeholders and spits out the formatted phrase.
 *
 * @param    {string}  phrase          - The phrase containing the placeholder.
 * @param    {object}  placeholderMap  - Key-value pairs of objects to be swapped out
 */
i18n.prototype.replacePlaceholders = function (phrase, placeholderMap) {
  for (var key in placeholderMap) {
    phrase = phrase.replaceAll(this.separators[0] + key + this.separators[1], placeholderMap[key])
  }
  return phrase
}

/**
 * Recursively flattens nested objects, whilst maintaining the parent key name on the flattened list.
 *
 * For example, this structure:
 * {
 *   "hello": "Hello %{name}",
 *   "member_area": {
 *     "log_in": "Log in",
 *     "register": "Register account"
 *   }
 * }
 *
 * Will be flattened to this:
 * {
 *   "hello": "Hello %{name}",
 *   "member_area.log_in": "Log in",
 *   "member_area.register": "Register account"
 * }
 *
 * @param    {object} translationsObject  - A (potentially nested) object of translation key-value pairs.
 * @returns  {object}                     - A single level "flattened" object of translation key-value pairs.
 */
i18n.prototype.flatten = function (translationsObject) {
  var flattenedObject = {}
  var flattenLoop = function (translations, prefix) {
    Object.keys(translations).forEach(function (key) {
      var phrase = translations[key]
      var prefixedKey = prefix ? prefix + '.' + key : key
      if (typeof phrase === 'object') {
        flattenLoop(phrase, prefixedKey)
      } else {
        flattenedObject[prefixedKey] = phrase
      }
    })
  }
  flattenLoop(translationsObject)
  return flattenedObject
}

/**
 * Get the appropriate lookup key for the plural form by appending a suffix to the base key.
 *
 * The locale may include a regional indicator (such as en-GB), but we don't *usually* care about this part,
 * as pluralisation rules are *usually* the same regardless of region. There are exceptions, however, (e.g.
 * Portuguese) so this searches by the full version first and the short version, just to be sure.
 *
 * @param    {string}  lookupKey  - The lookup key of the string to search for.
 * @param    {number}  count      - Number used to determine which pluralisation to use.
 * @returns  {string}             - The lookup key needed to obtain the correct pluralisation.
 */
i18n.prototype.getPluralKey = function (lookupKey, count) {
  var locale = this.locale
  var localeShort = (locale.length > 2) ? locale.substring(0, 2) : locale
  var keySuffix = 'other'

  for (var pluralRule in this.pluralRulesMap) {
    if (Object.prototype.hasOwnProperty.call(this.pluralRulesMap, pluralRule)) {
      var languages = this.pluralRulesMap[pluralRule]
      if (languages.includes(locale) || languages.includes(localeShort)) {
        keySuffix = this.pluralRules[pluralRule](count)
        break
      }
    }
  }
  return lookupKey + '_' + keySuffix
}

/**
 * Different pluralisation rule sets
 *
 * Returns the appropriate key for the plural form, if necessary, by appending a suffix to the base key.
 * Possible suffixes: 'zero', 'one', 'two', 'few', 'many', 'other' (the actual meaning of each differs per locale).
 * In most situations, 'other' should exist if any of the other options exist.
 * https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html
 *
 * @param    {number}  n  - The `count` number being passed through. This must be a positive integer. Negative numbers and decimals aren't accounted for.
 * @returns  {string}     - The string that needs to be suffixed to the key (without separator).
 */
i18n.prototype.pluralRules = {
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
 * Note: These groups are named for the most dominant or recognisable language that uses each system.
 * The groupings do not imply that the languages are related to one another. Many languages have evolved the same systems independently of one another.
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
i18n.prototype.pluralRulesMap = {
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

export default i18n
