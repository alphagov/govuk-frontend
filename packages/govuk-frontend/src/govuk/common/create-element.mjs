/**
 * Creates an element with the given attributes
 *
 * @internal
 * @template {keyof HTMLElementTagNameMap} TagName
 * @param {TagName} tagName - Type of element to create
 * @param {{[key: string]: string}} [attributes] - Attributes to set on the element
 * @param {Node[]} [children] - The list of child nodes for the element
 * @returns {HTMLElementTagNameMap[TagName]} Created element
 */
export function createElement(tagName, attributes = {}, children) {
  const el = document.createElement(tagName)
  Object.entries(attributes).forEach(([name, value]) => {
    el.setAttribute(name, value)
  })

  if (children) {
    for (const child of children) {
      el.appendChild(child)
    }
  }

  return el
}