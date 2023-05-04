import '../vendor/polyfills/Element/prototype/closest.mjs';

/**
 * Returns the value of the given attribute closest to the given element (including itself)
 *
 * @deprecated Will be made private in v5.0
 * @param {Element} $element - The element to start walking the DOM tree up
 * @param {string} attributeName - The name of the attribute
 * @returns {string | null} Attribute value
 */
function closestAttributeValue ($element, attributeName) {
  var $closestElementWithAttribute = $element.closest('[' + attributeName + ']');
  return $closestElementWithAttribute
    ? $closestElementWithAttribute.getAttribute(attributeName)
    : null
}

export { closestAttributeValue };
//# sourceMappingURL=common/closest-attribute-value.mjs.map
