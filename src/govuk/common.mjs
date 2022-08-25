import './vendor/polyfills/Element/prototype/dataset.mjs'

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
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
 *  Used to generate a unique string, allows multiple instances of the component without
 * Them conflicting with each other.
 * https://stackoverflow.com/a/8809472
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
 * Config flattening function. Takes any number of objects, flattens them into
 * namespaced key-value pairs, (e.g. {'i18n.showSection': 'Show section'}) and
 * combines them together, with greatest priority on the LAST item passed in.
 *
 * @param {...object} - Any number of objects to merge together.
 * @returns {object} - A flattened object of key-value pairs.
 */
export function getModuleConfig () {
  // Function to take nested objects and flatten them to a dot-separated keyed
  // object. Doing this means we don't need to do any deep/recursive merging of
  // each of our objects, nor transform our dataset from a flat list into a
  // nested object.
  var flattenObject = function (optionsObject) {
    // Prepare an empty return object
    var flattenedObject = {}

    // Our flattening function, this is called recursively for each level of
    // depth in the object. At each level we prepend the previous level names to
    // the key using `prefix`.
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
    flattenLoop(optionsObject)
    return flattenedObject
  }

  // Start with an empty  object as our base
  var configObject = {}

  // Loop through each of the remaining passed objects and push their keys
  // one-by-one into configObject. Any duplicate keys will override the existing
  // key with the new value.
  for (var i = 0; i < arguments.length; i++) {
    var obj = flattenObject(arguments[i])
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        configObject[key] = obj[key]
      }
    }
  }

  return configObject
}
