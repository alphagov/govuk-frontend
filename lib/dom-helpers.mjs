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

/**
 * Creates a DocumentFragment from the given HTML
 *
 * Allows to quickly scaffold parts of a DOM tree for testing
 *
 * @param {String} html - The HTML to turn into a DOM tree
 * @returns DocumentFragment
 */
export function createFragmentFromHTML (html) {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content.cloneNode(true)
}
