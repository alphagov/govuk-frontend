/**
 * Common helpers which do not require polyfill.
 *
 * IMPORTANT: If a helper require a polyfill, please isolate it in its own module
 * so that the polyfill can be properly tree-shaken and does not burden
 * the components that do not need that helper
 */

/**
 * Config flattening function
 *
 * Takes any number of objects, flattens them into namespaced key-value pairs,
 * (e.g. \{'i18n.showSection': 'Show section'\}) and combines them together, with
 * greatest priority on the LAST item passed in.
 *
 * @internal
 * @param {...{ [key: string]: unknown }} configObjects - Config object to merge
 * @returns {{ [key: string]: unknown }} A flattened object of key-value pairs.
 */
export function mergeConfigs(...configObjects) {
  /**
   * Function to take nested objects and flatten them to a dot-separated keyed
   * object. Doing this means we don't need to do any deep/recursive merging of
   * each of our objects, nor transform our dataset from a flat list into a
   * nested object.
   *
   * @internal
   * @param {{ [key: string]: unknown }} configObject - Deeply nested object
   * @returns {{ [key: string]: unknown }} Flattened object with dot-separated keys
   */
  function flattenObject(configObject) {
    // Prepare an empty return object
    /** @type {{ [key: string]: unknown }} */
    const flattenedObject = {}

    /**
     * Our flattening function, this is called recursively for each level of
     * depth in the object. At each level we prepend the previous level names to
     * the key using `prefix`.
     *
     * @internal
     * @param {Partial<{ [key: string]: unknown }>} obj - Object to flatten
     * @param {string} [prefix] - Optional dot-separated prefix
     */
    function flattenLoop(obj, prefix) {
      for (const [key, value] of Object.entries(obj)) {
        const prefixedKey = prefix ? `${prefix}.${key}` : key

        // If the value is a nested object, recurse over that too
        if (value && typeof value === 'object') {
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
  /** @type {{ [key: string]: unknown }} */
  const formattedConfigObject = {}

  // Loop through each of the passed objects
  for (const configObject of configObjects) {
    const obj = flattenObject(configObject)

    // Push their keys one-by-one into formattedConfigObject. Any duplicate
    // keys will override the existing key with the new value.
    for (const [key, value] of Object.entries(obj)) {
      formattedConfigObject[key] = value
    }
  }

  return formattedConfigObject
}

/**
 * Extracts keys starting with a particular namespace from a flattened config
 * object, removing the namespace in the process.
 *
 * @internal
 * @param {{ [key: string]: unknown }} configObject - The object to extract key-value pairs from.
 * @param {string} namespace - The namespace to filter keys with.
 * @returns {{ [key: string]: unknown }} Flattened object with dot-separated key namespace removed
 */
export function extractConfigByNamespace(configObject, namespace) {
  /** @type {{ [key: string]: unknown }} */
  const newObject = {}

  for (const [key, value] of Object.entries(configObject)) {
    // Split the key into parts, using . as our namespace separator
    const keyParts = key.split('.')

    // Check if the first namespace matches the configured namespace
    if (keyParts[0] === namespace) {
      // Remove the first item (the namespace) from the parts array,
      // but only if there is more than one part (we don't want blank keys!)
      if (keyParts.length > 1) {
        keyParts.shift()
      }

      // Join the remaining parts back together
      const newKey = keyParts.join('.')

      // Add them to our new object
      newObject[newKey] = value
    }
  }

  return newObject
}

/**
 * Get hash fragment from URL
 *
 * Extract the hash fragment (everything after the hash) from a URL,
 * but not including the hash symbol
 *
 * @private
 * @param {string} url - URL
 * @returns {string | undefined} Fragment from URL, without the hash
 */
export function getFragmentFromUrl(url) {
  if (!url.includes('#')) {
    return undefined
  }

  return url.split('#').pop()
}

/**
 * Checks if GOV.UK Frontend is supported on this page
 *
 * Some browsers will load and run our JavaScript but GOV.UK Frontend
 * won't be supported.
 *
 * @internal
 * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
 * @returns {boolean} Whether GOV.UK Frontend is supported on this page
 */
export function isSupported($scope = document.body) {
  if (!$scope) {
    return false
  }

  return $scope.classList.contains('govuk-frontend-supported')
}

/**
 * Validate component config by schema
 *
 * @internal
 * @param {Schema} schema - Config schema
 * @param {{ [key: string]: unknown }} config - Component config
 * @returns {string[]} List of validation errors
 */
export function validateConfig(schema, config) {
  const validationErrors = []

  // Check errors for each schema
  for (const [name, conditions] of Object.entries(schema)) {
    const errors = []

    // Check errors for each schema condition
    for (const { required, errorMessage } of conditions) {
      if (!required.every((key) => !!config[key])) {
        errors.push(errorMessage) // Missing config key value
      }
    }

    // Check one condition passes or add errors
    if (name === 'anyOf' && !(conditions.length - errors.length >= 1)) {
      validationErrors.push(...errors)
    }
  }

  return validationErrors
}

/**
 * Schema for component config
 *
 * @typedef {object} Schema
 * @property {SchemaCondition[]} [anyOf] - List of schema conditions
 */

/**
 * Schema condition for component config
 *
 * @typedef {object} SchemaCondition
 * @property {string[]} required - List of required config fields
 * @property {string} errorMessage - Error message when required config fields not provided
 */
