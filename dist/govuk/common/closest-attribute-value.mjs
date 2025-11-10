function closestAttributeValue($element, attributeName) {
  const $closestElementWithAttribute = $element.closest(`[${attributeName}]`);
  return $closestElementWithAttribute ? $closestElementWithAttribute.getAttribute(attributeName) : null;
}

export { closestAttributeValue };
//# sourceMappingURL=closest-attribute-value.mjs.map
