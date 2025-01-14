/**
 * Common helpers which do not require polyfill.
 *
 * IMPORTANT: If a helper require a polyfill, please isolate it in its own module
 * so that the polyfill can be properly tree-shaken and does not burden
 * the components that do not need that helper
 */

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
 * Checks if component is already initialised
 *
 * @internal
 * @param {Element} $root - HTML element to be checked
 * @param {string} moduleName - name of component module
 * @returns {boolean} Whether component is already initialised
 */
export function isInitialised($root, moduleName) {
  return (
    $root instanceof HTMLElement &&
    $root.hasAttribute(`data-${moduleName}-init`)
  )
}

/**
 * Checks if GOV.UK Frontend is supported on this page
 *
 * Some browsers will load and run our JavaScript but GOV.UK Frontend
 * won't be supported.
 *
 * @param {HTMLElement | null} [$scope] - (internal) `<body>` HTML element checked for browser support
 * @returns {boolean} Whether GOV.UK Frontend is supported on this page
 */
export function isSupported($scope = document.body) {
  if (!$scope) {
    return false
  }

  return $scope.classList.contains('govuk-frontend-supported')
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
 * @template {Partial<Record<keyof ObjectType, unknown>>} [ObjectType=ObjectNested]
 * @param {unknown | ObjectType} option - Option to check
 * @returns {option is ObjectType} Whether the option is an object
 */
export function isObject(option) {
  return !!option && typeof option === 'object' && !isArray(option)
}

/**
 * Format error message
 *
 * @internal
 * @param {ComponentWithModuleName} Component - Component that threw the error
 * @param {string} message - Error message
 * @returns {string} - Formatted error message
 */
export function formatErrorMessage(Component, message) {
  return `${Component.moduleName}: ${message}`
}

/* eslint-disable jsdoc/valid-types --
 * `{new(...args: any[] ): object}` is not recognised as valid
 * https://github.com/gajus/eslint-plugin-jsdoc/issues/145#issuecomment-1308722878
 * https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/131
 **/

/**
 * @typedef ComponentWithModuleName
 * @property {string} moduleName - Name of the component
 */

/* eslint-enable jsdoc/valid-types */

/**
 * @import { ObjectNested } from './configuration.mjs'
 */
