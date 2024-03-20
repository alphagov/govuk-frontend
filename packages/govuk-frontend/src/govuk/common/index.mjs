import { normaliseString } from './normalise-string.mjs'

/**
 * Common helpers which do not require polyfill.
 *
 * IMPORTANT: If a helper require a polyfill, please isolate it in its own module
 * so that the polyfill can be properly tree-shaken and does not burden
 * the components that do not need that helper
 */

/**
 * Config merging function
 *
 * Takes any number of objects and combines them together, with
 * greatest priority on the LAST item passed in.
 *
 * @internal
 * @param {...{ [key: string]: unknown }} configObjects - Config objects to merge
 * @returns {{ [key: string]: unknown }} A merged config object
 */
export function mergeConfigs(...configObjects) {
  // Start with an empty object as our base
  /** @type {{ [key: string]: unknown }} */
  const formattedConfigObject = {}

  // Loop through each of the passed objects
  for (const configObject of configObjects) {
    for (const key of Object.keys(configObject)) {
      const option = formattedConfigObject[key]
      const override = configObject[key]

      // Push their keys one-by-one into formattedConfigObject. Any duplicate
      // keys with object values will be merged, otherwise the new value will
      // override the existing value.
      if (isObject(option) && isObject(override)) {
        // @ts-expect-error Index signature for type 'string' is missing
        formattedConfigObject[key] = mergeConfigs(option, override)
      } else {
        // Apply override
        formattedConfigObject[key] = override
      }
    }
  }

  return formattedConfigObject
}

/**
 * Extracts keys starting with a particular namespace from dataset ('data-*')
 * object, removing the namespace in the process, normalising all values
 *
 * @internal
 * @param {{ schema: Schema }} Component - Component class
 * @param {DOMStringMap} dataset - The object to extract key-value pairs from
 * @param {string} namespace - The namespace to filter keys with
 * @returns {ObjectNested | undefined} Nested object with dot-separated key namespace removed
 */
export function extractConfigByNamespace(Component, dataset, namespace) {
  const property = Component.schema.properties[namespace]

  // Only extract configs for object schema properties
  if (property?.type !== 'object') {
    return
  }

  // Add default empty config
  const newObject = {
    [namespace]: /** @type {ObjectNested} */ ({})
  }

  for (const [key, value] of Object.entries(dataset)) {
    /** @type {ObjectNested | ObjectNested[NestedKey]} */
    let current = newObject

    // Split the key into parts, using . as our namespace separator
    const keyParts = key.split('.')

    /**
     * Create new level per part
     *
     * e.g. 'i18n.textareaDescription.other' becomes
     * `{ i18n: { textareaDescription: { other } } }`
     */
    for (const [index, name] of keyParts.entries()) {
      if (typeof current === 'object') {
        // Drop down to nested object until the last part
        if (index < keyParts.length - 1) {
          // New nested object (optionally) replaces existing value
          if (!isObject(current[name])) {
            current[name] = {}
          }

          // Drop down into new or existing nested object
          current = current[name]
        } else if (key !== namespace) {
          // Normalised value (optionally) replaces existing value
          current[name] = normaliseString(value)
        }
      }
    }
  }

  return newObject[namespace]
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
 * Get GOV.UK Frontend breakpoint value from CSS custom property
 *
 * @private
 * @param {string} name - Breakpoint name
 * @returns {{ property: string, value?: string }} Breakpoint object
 */
export function getBreakpoint(name) {
  const property = `--govuk-frontend-breakpoint-${name}`

  // Get value from `<html>` with breakpoints on CSS :root
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(property)

  return {
    property,
    value: value || undefined
  }
}

/**
 * Move focus to element
 *
 * Sets tabindex to -1 to make the element programmatically focusable,
 * but removes it on blur as the element doesn't need to be focused again.
 *
 * @private
 * @template {HTMLElement} FocusElement
 * @param {FocusElement} $element - HTML element
 * @param {object} [options] - Handler options
 * @param {function(this: FocusElement): void} [options.onBeforeFocus] - Callback before focus
 * @param {function(this: FocusElement): void} [options.onBlur] - Callback on blur
 */
export function setFocus($element, options = {}) {
  const isFocusable = $element.getAttribute('tabindex')

  if (!isFocusable) {
    $element.setAttribute('tabindex', '-1')
  }

  /**
   * Handle element focus
   */
  function onFocus() {
    $element.addEventListener('blur', onBlur, { once: true })
  }

  /**
   * Handle element blur
   */
  function onBlur() {
    options.onBlur?.call($element)

    if (!isFocusable) {
      $element.removeAttribute('tabindex')
    }
  }

  // Add listener to reset element on blur, after focus
  $element.addEventListener('focus', onFocus, { once: true })

  // Focus element
  options.onBeforeFocus?.call($element)
  $element.focus()
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
 * Follows limited examples in JSON schema for wider support in future
 *
 * {@link https://ajv.js.org/json-schema.html#compound-keywords}
 * {@link https://ajv.js.org/packages/ajv-errors.html#single-message}
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
    if (Array.isArray(conditions)) {
      for (const { required, errorMessage } of conditions) {
        if (!required.every((key) => !!config[key])) {
          errors.push(errorMessage) // Missing config key value
        }
      }

      // Check all conditions pass or add errors
      if (name === 'allOf' && errors.length) {
        validationErrors.push(...errors)
      }

      // Check one condition passes or add errors
      if (name === 'anyOf' && !(conditions.length - errors.length >= 1)) {
        validationErrors.push(...errors)
      }
    }
  }

  return validationErrors
}

/**
 * Check for an array
 *
 * @internal
 * @param {unknown} option - Option to check
 * @returns {boolean} Whether the option is an array
 */
function isArray(option) {
  return Array.isArray(option)
}

/**
 * Check for an object
 *
 * @internal
 * @param {unknown} option - Option to check
 * @returns {boolean} Whether the option is an object
 */
function isObject(option) {
  return !!option && typeof option === 'object' && !isArray(option)
}

/**
 * Schema for component config
 *
 * @typedef {object} Schema
 * @property {{ [field: string]: SchemaProperty | undefined }} properties - Schema properties
 * @property {SchemaCondition[]} [allOf] - List of schema conditions, all must pass
 * @property {SchemaCondition[]} [anyOf] - List of schema conditions, any must pass
 */

/**
 * Schema property for component config
 *
 * @typedef {object} SchemaProperty
 * @property {'string' | 'boolean' | 'number' | 'object'} type - Property type
 */

/**
 * Schema condition for component config
 *
 * @typedef {object} SchemaCondition
 * @property {string[]} required - List of required config fields
 * @property {string} errorMessage - Error message when required config fields not provided
 */

/**
 * @internal
 * @typedef {keyof ObjectNested} NestedKey
 * @typedef {{ [key: string]: string | boolean | number | ObjectNested | undefined }} ObjectNested
 */
