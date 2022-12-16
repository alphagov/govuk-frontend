/**
 * Common helpers which do not require polyfill.
 *
 * IMPORTANT: If a helper require a polyfill, please isolate it in its own module
 * so that the polyfill can be properly tree-shaken and does not burden
 * the components that do not need that helper
 *
 * @module common/index
 */

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 *
 * @param {NodeListOf<Element>} nodes - NodeList from querySelectorAll()
 * @param {nodeListIterator} callback - Callback function to run for each node
 * @returns {void}
 */
export function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

/**
 * Used to generate a unique string, allows multiple instances of the component
 * without them conflicting with each other.
 * https://stackoverflow.com/a/8809472
 *
 * @returns {string} Unique ID
 */
export function generateUniqueID () {
  var d = new Date().getTime()
  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

/**
 * Config flattening function
 *
 * Takes any number of objects, flattens them into namespaced key-value pairs,
 * (e.g. {'i18n.showSection': 'Show section'}) and combines them together, with
 * greatest priority on the LAST item passed in.
 *
 * @returns {Object<string, unknown>} A flattened object of key-value pairs.
 */
export function mergeConfigs (/* configObject1, configObject2, ...configObjects */) {
  /**
   * Function to take nested objects and flatten them to a dot-separated keyed
   * object. Doing this means we don't need to do any deep/recursive merging of
   * each of our objects, nor transform our dataset from a flat list into a
   * nested object.
   *
   * @param {Object<string, unknown>} configObject - Deeply nested object
   * @returns {Object<string, unknown>} Flattened object with dot-separated keys
   */
  var flattenObject = function (configObject) {
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

  // Start with an empty object as our base
  var formattedConfigObject = {}

  // Loop through each of the remaining passed objects and push their keys
  // one-by-one into configObject. Any duplicate keys will override the existing
  // key with the new value.
  for (var i = 0; i < arguments.length; i++) {
    var obj = flattenObject(arguments[i])
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        formattedConfigObject[key] = obj[key]
      }
    }
  }

  return formattedConfigObject
}

/**
 * Extracts keys starting with a particular namespace from a flattened config
 * object, removing the namespace in the process.
 *
 * @param {Object<string, unknown>} configObject - The object to extract key-value pairs from.
 * @param {string} namespace - The namespace to filter keys with.
 * @returns {Object<string, unknown>} Flattened object with dot-separated key namespace removed
 * @throws {Error} Config object required
 * @throws {Error} Namespace string required
 */
export function extractConfigByNamespace (configObject, namespace) {
  // Check we have what we need
  if (!configObject || typeof configObject !== 'object') {
    throw new Error('Provide a `configObject` of type "object".')
  }
  if (!namespace || typeof namespace !== 'string') {
    throw new Error('Provide a `namespace` of type "string" to filter the `configObject` by.')
  }
  var newObject = {}
  for (var key in configObject) {
    // Split the key into parts, using . as our namespace separator
    var keyParts = key.split('.')
    // Check if the first namespace matches the configured namespace
    if (Object.prototype.hasOwnProperty.call(configObject, key) && keyParts[0] === namespace) {
      // Remove the first item (the namespace) from the parts array,
      // but only if there is more than one part (we don't want blank keys!)
      if (keyParts.length > 1) {
        keyParts.shift()
      }
      // Join the remaining parts back together
      var newKey = keyParts.join('.')
      // Add them to our new object
      newObject[newKey] = configObject[key]
    }
  }
  return newObject
}

/**
 * @callback nodeListIterator
 * @param {Element} value - The current node being iterated on
 * @param {number} index - The current index in the iteration
 * @param {NodeListOf<Element>} nodes - NodeList from querySelectorAll()
 * @returns {void}
 */
