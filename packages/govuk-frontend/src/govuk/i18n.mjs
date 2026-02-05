import { isObject } from './common/index.mjs'

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
   * @param {{ [key: string]: string | TranslationPluralForms }} translations - Key-value pairs of the translation strings to use.
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
   * @throws {Error} Options required for `%{}` placeholders
   */
  t(lookupKey, options) {
    if (!lookupKey) {
      // Print a console error if no lookup key has been provided
      throw new Error('i18n: lookup key missing')
    }

    // Fetch the translation for that lookup key
    let translation = this.translations[lookupKey]

    // If the `count` option is set, determine which plural suffix is needed and
    // change the lookupKey to match. We check to see if it's numeric instead of
    // falsy, as this could legitimately be 0.
    if (typeof options?.count === 'number' && isObject(translation)) {
      const translationPluralForm =
        translation[this.getPluralSuffix(lookupKey, options.count)]

      // Update translation with plural suffix
      if (translationPluralForm) {
        translation = translationPluralForm
      }
    }

    if (typeof translation === 'string') {
      // Check for %{} placeholders in the translation string
      if (/%{(\S+)}/.test(translation)) {
        if (!options) {
          throw new Error(
            'i18n: cannot replace placeholders in string if no option data provided'
          )
        }

        return this.replacePlaceholders(translation, options)
      }

      return translation
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
      /%{(\S+)}/g,

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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
    count = Number(count)
    if (!isFinite(count)) {
      return 'other'
    }

    // Fetch the translation for that lookup key
    const translation = this.translations[lookupKey]

    // Check to verify that all the requirements for Intl.PluralRules are met.
    // If so, we can use that instead of our custom implementation. Otherwise,
    // use the hardcoded fallback.
    const preferredForm = this.hasIntlPluralRulesSupport()
      ? new Intl.PluralRules(this.locale).select(count)
      : 'other'

    // Use the correct plural form if provided
    if (isObject(translation)) {
      if (preferredForm in translation) {
        return preferredForm
        // Fall back to `other` if the plural form is missing, but log a warning
        // to the console
      } else if ('other' in translation) {
        console.warn(
          `i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`
        )

        return 'other'
      }
    }

    // If the required `other` plural form is missing, all we can do is error
    throw new Error(
      `i18n: Plural form ".other" is required for "${this.locale}" locale`
    )
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
