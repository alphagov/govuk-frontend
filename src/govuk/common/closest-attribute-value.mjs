import '../vendor/polyfills/Element/prototype/closest.mjs'

/**
 * Returns the value of the given attribute closest to the given element (including itself)
 *
 * @param {Element} $element - The element to start walking the DOM tree up
 * @param {string} attributeName - The name of the attribute
 * @returns {string | undefined} Attribute value
 */
export function closestAttributeValue ($element, attributeName) {
  var $closestElement = $element.closest('[' + attributeName + ']')
  var attributeValue

  if ($closestElement) {
    attributeValue = $closestElement.getAttribute(attributeName)
  }

  return attributeValue || undefined
}
