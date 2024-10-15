/**
 * Observe a property on an HTMLElement and fire a callback if the
 * value of that property changes.
 *
 * This only works for directly manipulating properties. It will not detect
 * passive changes to properties — e.g. using `setAttribute` to disable an input
 * will change the value of the `disabled` property, but not trigger a callback.
 *
 * For changes to HTML attributes, you can use a MutationObserver instead.
 *
 * @internal
 * @param {HTMLElement} element - The element to observe
 * @param {string} property - The property of that element to observe
 * @param {Function} callback - The callback to fire when the value of that property is changed
 */
export function observeElementProperty(element, property, callback) {
  // If the element has had an observer previously applied to this
  // property then it will be accessible from the element root.
  // Otherwise, we need to extract it from the constructor.
  const nativeProperty =
    Object.getOwnPropertyDescriptor(element, property) ??
    Object.getOwnPropertyDescriptor(element.constructor.prototype, property)

  // Overwrite the native property descriptor with our own getter/setter
  Object.defineProperty(element, property, {
    set(value) {
      // Still call and return the native setter function so that
      // everything it does still happens (e.g. updating the visible value)
      nativeProperty?.set?.call(this, value)

      // Call our custom callback function afterwards
      callback.call(this, value)
    },
    get() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return nativeProperty?.get?.call(this)
    }
  })
}
