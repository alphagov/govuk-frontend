/**
 * i18n support initialisation function
 *
 * @constructor
 * @param    {Object}  translations  - Key-value pairs of the translation
                                       strings to use.
 */
function I18n (translations) {
  // Make list of translations available throughout function
  this.translations = translations || {}
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
    throw new Error('i18n lookup key missing.')
  } else if (lookupKey in this.translations) {
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
    // Otherwise, return the lookup key itself as the fallback
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
  var placeholderRegex = RegExp(/%{(.\S+)}/, 'g')
  var placeholderMatch

  // Use `exec` for fetching regex matches, as matchAll() is not supported in IE
  while ((placeholderMatch = placeholderRegex.exec(translationString)) !== null) {
    var placeholderIncludingBraces = placeholderMatch[0]
    var placeholderKey = placeholderMatch[1]
    if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
      // If a user has passed `false` as the value for the placeholder
      // treat it as though the value should not be displayed
      if (options[placeholderKey] === false) {
        translationString = translationString.replace(placeholderIncludingBraces, '')
      }

      translationString = translationString.replace(placeholderIncludingBraces, options[placeholderKey])
    } else {
      throw new Error('i18n: no data found to replace ' + placeholderMatch[0] + ' placeholder in string')
    }
  }

  return translationString
}

export default I18n
