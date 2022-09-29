/**
 * Creates an element with the given attributes
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
