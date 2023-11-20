/**
 * Internal support for selecting messages to render, with placeholder
 * interpolation and locale-aware number formatting and pluralisation
 *
 * @internal
 */
export class I18n {
  translations
  locale

  /**
   * @internal
   * @param {{ [key: string]: unknown }} translations - Key-value pairs of the translation strings to use.
   * @param {object} [config] - Configuration options for the function.
   * @param {string | null} [config.locale] - An overriding locale for the PluralRules functionality.
   */
  constructor(translations = {}, config = {}) {
    // Make list of translations available throughout function
    this.translations = translations

    // The locale to use for PluralRules and NumberFormat
    this.locale = config.locale ?? (document.documentElement.lang || 'en')
  }

  /**
   * The most used function - takes the key for a given piece of UI text and
   * returns the appropriate string.
   *
   * @internal
   * @param {string} lookupKey - The lookup key of the string to use.
   * @param {{ [key: string]: unknown }} [options] - Any options passed with the translation string, e.g: for string interpolation.
   * @returns {string} The appropriate translation string.
   * @throws {Error} Lookup key required
   * @throws {Error} Options required for `${}` placeholders
   */
  t(lookupKey, options) {
    if (!lookupKey) {
      // Print a console error if no lookup key has been provided
      throw new Error('i18n: lookup key missing')
    }

    // If the `count` option is set, determine which plural suffix is needed and
    // change the lookupKey to match. We check to see if it's numeric instead of
    // falsy, as this could legitimately be 0.
    if (typeof options?.count === 'number') {
      // Get the plural suffix
      lookupKey = `${lookupKey}.${this.getPluralSuffix(
        lookupKey,
        options.count
      )}`
    }

    // Fetch the translation string for that lookup key
    const translationString = this.translations[lookupKey]

    if (typeof translationString === 'string') {
      // Check for ${} placeholders in the translation string
      if (translationString.match(/%{(.\S+)}/)) {
        if (!options) {
          throw new Error(
            'i18n: cannot replace placeholders in string if no option data provided'
          )
        }

        return this.replacePlaceholders(translationString, options)
      }

      return translationString
    }

    // If the key wasn't found in our translations object,
    // return the lookup key itself as the fallback
    return lookupKey
  }

  /**
   * Takes a translation string with placeholders, and replaces the placeholders
   * with the provided data
   *
   * @internal
   * @param {string} translationString - The translation string
   * @param {{ [key: string]: unknown }} options - Any options passed with the translation string, e.g: for string interpolation.
   * @returns {string} The translation string to output, with $\{\} placeholders replaced
   */
  replacePlaceholders(translationString, options) {
    const formatter = Intl.NumberFormat.supportedLocalesOf(this.locale).length
      ? new Intl.NumberFormat(this.locale)
      : undefined

    return translationString.replace(
      /%{(.\S+)}/g,

      /**
       * Replace translation string placeholders
       *
       * @internal
       * @param {string} placeholderWithBraces - Placeholder with braces
       * @param {string} placeholderKey - Placeholder key
       * @returns {string} Placeholder value
       */
      function (placeholderWithBraces, placeholderKey) {
        if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
          const placeholderValue = options[placeholderKey]

          // If a user has passed `false` as the value for the placeholder
          // treat it as though the value should not be displayed
          if (
            placeholderValue === false ||
            (typeof placeholderValue !== 'number' &&
              typeof placeholderValue !== 'string')
          ) {
            return ''
          }

          // If the placeholder's value is a number, localise the number formatting
          if (typeof placeholderValue === 'number') {
            return formatter
              ? formatter.format(placeholderValue)
              : `${placeholderValue}`
          }

          return placeholderValue
        }

        throw new Error(
          `i18n: no data found to replace ${placeholderWithBraces} placeholder in string`
        )
      }
    )
  }

  /**
   * Check to see if the browser supports Intl.PluralRules
   *
   * It requires all conditions to be met in order to be supported:
   * - The implementation of Intl supports PluralRules (NOT true in Safari 10–12)
   * - The browser/OS has plural rules for the current locale (browser dependent)
   *
   * {@link https://browsersl.ist/#q=supports+es6-module+and+not+supports+intl-pluralrules}
   *
   * @internal
   * @returns {boolean} Returns true if all conditions are met. Returns false otherwise.
   */
  hasIntlPluralRulesSupport() {
    return Boolean(
      'PluralRules' in window.Intl &&
        Intl.PluralRules.supportedLocalesOf(this.locale).length
    )
  }

  /**
   * Get the appropriate suffix for the plural form.
   *
   * Uses Intl.PluralRules (or our own fallback implementation) to get the
   * 'preferred' form to use for the given count.
   *
   * Checks that a translation has been provided for that plural form – if it
   * hasn't, it'll fall back to the 'other' plural form (unless that doesn't exist
   * either, in which case an error will be thrown)
   *
   * @internal
   * @param {string} lookupKey - The lookup key of the string to use.
   * @param {number} count - Number used to determine which pluralisation to use.
   * @returns {PluralRule} The suffix associated with the correct pluralisation for this locale.
   * @throws {Error} Plural form `.other` required when preferred plural form is missing
   */
  getPluralSuffix(lookupKey, count) {
    // Validate that the number is actually a number.
    //
    // Number(count) will turn anything that can't be converted to a Number type
    // into 'NaN'. isFinite filters out NaN, as it isn't a finite number.
    count = Number(count)
    if (!isFinite(count)) {
      return 'other'
    }

    // Check to verify that all the requirements for Intl.PluralRules are met.
    // If so, we can use that instead of our custom implementation. Otherwise,
    // use the hardcoded fallback.
    const preferredForm = this.hasIntlPluralRulesSupport()
      ? new Intl.PluralRules(this.locale).select(count)
      : this.selectPluralFormUsingFallbackRules(count)

    // Use the correct plural form if provided
    if (`${lookupKey}.${preferredForm}` in this.translations) {
      return preferredForm
      // Fall back to `other` if the plural form is missing, but log a warning
      // to the console
    } else if (`${lookupKey}.other` in this.translations) {
      console.warn(
        `i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`
      )

      return 'other'
    }

    // If the required `other` plural form is missing, all we can do is error
    throw new Error(
      `i18n: Plural form ".other" is required for "${this.locale}" locale`
    )
  }

  /**
   * Get the plural form using our fallback implementation
   *
   * This is split out into a separate function to make it easier to test the
   * fallback behaviour in an environment where Intl.PluralRules exists.
   *
   * @internal
   * @param {number} count - Number used to determine which pluralisation to use.
   * @returns {PluralRule} The pluralisation form for count in this locale.
   */
  selectPluralFormUsingFallbackRules(count) {
    // Currently our custom code can only handle positive integers, so let's
    // make sure our number is one of those.
    count = Math.abs(Math.floor(count))

    const ruleset = this.getPluralRulesForLocale()

    if (ruleset) {
      return I18n.pluralRules[ruleset](count)
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
   * @internal
   * @returns {string | undefined} The name of the pluralisation rule to use (a key for one
   *   of the functions in this.pluralRules)
   */
  getPluralRulesForLocale() {
    const localeShort = this.locale.split('-')[0]

    // Look through the plural rules map to find which `pluralRule` is
    // appropriate for our current `locale`.
    for (const pluralRule in I18n.pluralRulesMap) {
      const languages = I18n.pluralRulesMap[pluralRule]
      if (languages.includes(this.locale) || languages.includes(localeShort)) {
        return pluralRule
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
   * {@link https://github.com/alphagov/govuk-frontend/blob/spike-i18n-support/src/govuk/i18n.mjs}
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
   *
   * @internal
   * @type {{ [key: string]: string[] }}
   */
  static pluralRulesMap = {
    arabic: ['ar'],
    chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
    french: ['hy', 'bn', 'fr', 'gu', 'hi', 'fa', 'pa', 'zu'],
    german: [
      'af',
      'sq',
      'az',
      'eu',
      'bg',
      'ca',
      'da',
      'nl',
      'en',
      'et',
      'fi',
      'ka',
      'de',
      'el',
      'hu',
      'lb',
      'no',
      'so',
      'sw',
      'sv',
      'ta',
      'te',
      'tr',
      'ur'
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
   * {@link https://cldr.unicode.org/index/cldr-spec/plural-rules}
   *
   * The count must be a positive integer. Negative numbers and decimals aren't accounted for
   *
   * @internal
   * @type {{ [key: string]: (count: number) => PluralRule }}
   */
  static pluralRules = {
    /* eslint-disable jsdoc/require-jsdoc */
    arabic(n) {
      if (n === 0) {
        return 'zero'
      }
      if (n === 1) {
        return 'one'
      }
      if (n === 2) {
        return 'two'
      }
      if (n % 100 >= 3 && n % 100 <= 10) {
        return 'few'
      }
      if (n % 100 >= 11 && n % 100 <= 99) {
        return 'many'
      }
      return 'other'
    },
    chinese() {
      return 'other'
    },
    french(n) {
      return n === 0 || n === 1 ? 'one' : 'other'
    },
    german(n) {
      return n === 1 ? 'one' : 'other'
    },
    irish(n) {
      if (n === 1) {
        return 'one'
      }
      if (n === 2) {
        return 'two'
      }
      if (n >= 3 && n <= 6) {
        return 'few'
      }
      if (n >= 7 && n <= 10) {
        return 'many'
      }
      return 'other'
    },
    russian(n) {
      const lastTwo = n % 100
      const last = lastTwo % 10
      if (last === 1 && lastTwo !== 11) {
        return 'one'
      }
      if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
        return 'few'
      }
      if (
        last === 0 ||
        (last >= 5 && last <= 9) ||
        (lastTwo >= 11 && lastTwo <= 14)
      ) {
        return 'many'
      }
      // Note: The 'other' suffix is only used by decimal numbers in Russian.
      // We don't anticipate it being used, but it's here for consistency.
      return 'other'
    },
    scottish(n) {
      if (n === 1 || n === 11) {
        return 'one'
      }
      if (n === 2 || n === 12) {
        return 'two'
      }
      if ((n >= 3 && n <= 10) || (n >= 13 && n <= 19)) {
        return 'few'
      }
      return 'other'
    },
    spanish(n) {
      if (n === 1) {
        return 'one'
      }
      if (n % 1000000 === 0 && n !== 0) {
        return 'many'
      }
      return 'other'
    },
    welsh(n) {
      if (n === 0) {
        return 'zero'
      }
      if (n === 1) {
        return 'one'
      }
      if (n === 2) {
        return 'two'
      }
      if (n === 3) {
        return 'few'
      }
      if (n === 6) {
        return 'many'
      }
      return 'other'
    }
    /* eslint-enable jsdoc/require-jsdoc */
  }
}

/**
 * Plural rule category mnemonic tags
 *
 * @internal
 * @typedef {'zero' | 'one' | 'two' | 'few' | 'many' | 'other'} PluralRule
 */

/**
 * Translated message by plural rule they correspond to.
 *
 * Allows to group pluralised messages under a single key when passing
 * translations to a component's constructor
 *
 * @internal
 * @typedef {object} TranslationPluralForms
 * @property {string} [other] - General plural form
 * @property {string} [zero] - Plural form used with 0
 * @property {string} [one] - Plural form used with 1
 * @property {string} [two] - Plural form used with 2
 * @property {string} [few] - Plural form used for a few
 * @property {string} [many] - Plural form used for many
 */
