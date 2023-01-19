import '../vendor/polyfills/Element/prototype/closest.mjs'

/**
 * Returns the value of the given attribute closest to the given element (including itself)
 *
 * @param {HTMLElement} $element - The element to start walking the DOM tree up
 * @param {string} attributeName - The name of the attribute
 * @returns {string | null} Attribute value
 */
export function closestAttributeValue ($element, attributeName) {
  var $closestElementWithAttribute = $element.closest('[' + attributeName + ']')
  return $closestElementWithAttribute
    ? $closestElementWithAttribute.getAttribute(attributeName)
    : null
}
