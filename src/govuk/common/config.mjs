/**
 * Config
 */
class Config {
  configObject = {}

  /**
   * Config flattening function
   *
   * Takes any number of objects, flattens them into namespaced key-value pairs,
   * (e.g. {'i18n.showSection': 'Show section'}) and combines them together, with
   * greatest priority on the LAST item passed in.
   *
   * @returns {Object<string, unknown>} A flattened object of key-value pairs.
   */
  constructor (/* configObject1, configObject2, ...configObjects */) {
    // Loop through each of the remaining passed objects and push their keys
    // one-by-one into configObject. Any duplicate keys will override the existing
    // key with the new value.
    for (var i = 0; i < arguments.length; i++) {
      var obj = Config.flattenObject(arguments[i])
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          this.configObject[key] = obj[key]
        }
      }
    }

    const configObject = this.configObject

    return new Proxy(this, {
      get(target, name, receiver) {
        if (!Reflect.has(target, name)) {
          return configObject[name]
        }
        return Reflect.get(target, name, receiver)
      }
    })
  }

  /**
   * Extracts keys starting with a particular namespace from a flattened config
   * object, removing the namespace in the process.
   *
   * @param {string} namespace - The namespace to filter keys with.
   * @returns {Object<string, unknown>} Flattened object with dot-separated key namespace removed
   * @throws {Error} Config object required
   * @throws {Error} Namespace string required
   */
  byNamespace (namespace) {
    // Check we have what we need
    if (!namespace || typeof namespace !== 'string') {
      throw new Error('Provide a `namespace` of type "string" to filter the `configObject` by.')
    }
    var newObject = {}
    for (var key in this.configObject) {
      // Split the key into parts, using . as our namespace separator
      var keyParts = key.split('.')
      // Check if the first namespace matches the configured namespace
      if (Object.prototype.hasOwnProperty.call(this.configObject, key) && keyParts[0] === namespace) {
        // Remove the first item (the namespace) from the parts array,
        // but only if there is more than one part (we don't want blank keys!)
        if (keyParts.length > 1) {
          keyParts.shift()
        }
        // Join the remaining parts back together
        var newKey = keyParts.join('.')
        // Add them to our new object
        newObject[newKey] = this.configObject[key]
      }
    }
    return newObject
  }

  /**
   * Function to take nested objects and flatten them to a dot-separated keyed
   * object. Doing this means we don't need to do any deep/recursive merging of
   * each of our objects, nor transform our dataset from a flat list into a
   * nested object.
   *
   * @param {Object<string, unknown>} configObject - Deeply nested object
   * @returns {Object<string, unknown>} Flattened object with dot-separated keys
   */
  static flattenObject (configObject) {
    // Prepare an empty return object
    var flattenedObject = {}

    /**
     * Our flattening function, this is called recursively for each level of
     * depth in the object. At each level we prepend the previous level names to
     * the key using `prefix`.
     *
     * @param {Partial<Object<string, unknown>>} obj - Object to flatten
     * @param {string} [prefix] - Optional dot-separated prefix
     */
    var flattenLoop = function (obj, prefix) {
      // Loop through keys...
      for (var key in obj) {
        // Check to see if this is a prototypical key/value,
        // if it is, skip it.
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue
        }
        var value = obj[key]
        var prefixedKey = prefix ? prefix + '.' + key : key
        if (typeof value === 'object') {
          // If the value is a nested object, recurse over that too
          flattenLoop(value, prefixedKey)
        } else {
          // Otherwise, add this value to our return object
          flattenedObject[prefixedKey] = value
        }
      }
    }

    // Kick off the recursive loop
    flattenLoop(configObject)
    return flattenedObject
  }

  /**
   * Normalise string
   *
   * 'If it looks like a duck, and it quacks like a duck…' 🦆
   *
   * If the passed value looks like a boolean or a number, convert it to a boolean
   * or number.
   *
   * Designed to be used to convert config passed via data attributes (which are
   * always strings) into something sensible.
   *
   * @param {string} value - The value to normalise
   * @returns {string | boolean | number | undefined} Normalised data
   */
  static normaliseString (value) {
    if (typeof value !== 'string') {
      return value
    }

    var trimmedValue = value.trim()

    if (trimmedValue === 'true') {
      return true
    }

    if (trimmedValue === 'false') {
      return false
    }

    // Empty / whitespace-only strings are considered finite so we need to check
    // the length of the trimmed string as well
    if (trimmedValue.length > 0 && isFinite(trimmedValue)) {
      return Number(trimmedValue)
    }

    return value
  }

  /**
   * Normalise dataset
   *
   * Loop over an object and normalise each value using normaliseData function
   *
   * @param {DOMStringMap} dataset - HTML element dataset
   * @returns {Object<string, unknown>} Normalised dataset
   */
  static normaliseDataset (dataset) {
    var out = {}

    for (var key in dataset) {
      out[key] = Config.normaliseString(dataset[key])
    }

    return out
  }
}

export default Config
