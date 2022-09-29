/**
 * Creates an element with the given attributes
 *
 * TODO: Extend to allow passing props and children if necessary
 * TODO: Make available to components once support for older browsers is dropped (add tests)
 *
 * @param {String} tagName
 * @param {Object} attributes
 * @returns HTMLElement
 */
export function createElement (tagName, attributes = {}) {
  const el = document.createElement(tagName)

  Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
    el.setAttribute(attributeName, attributeValue)
  })

  return el
}
