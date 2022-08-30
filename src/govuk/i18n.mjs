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
 * @returns  {String}             - The appropriate translation string.
 */
I18n.prototype.t = function (lookupKey) {
  if (!lookupKey) {
    // Print a console error if no lookup key has been provided
    throw new Error('i18n lookup key missing.')
  } else if (lookupKey in this.translations) {
    // Return the translation string if it exists in the object
    return this.translations[lookupKey]
  } else {
    // Otherwise, return the lookup key itself as the fallback
    return lookupKey
  }
}

export default I18n
