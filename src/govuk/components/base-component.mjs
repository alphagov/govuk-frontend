import ComponentRegistry from '../component-registry.mjs'

/**
 * Base Component
 */
class BaseComponent {
  /**
   * Constructor
   *
   * @param {HTMLElement} $element - HTML element to use for button
   */
  constructor ($element) {
    if (!($element instanceof HTMLElement)) {
      throw new Error('Tried to instantiate object with ')
    }

    this.$module = $element
  }

  /**
   * Find or create a component
   *
   * @param {HTMLElement} $element
   * @param {object} configObject - Config for the component
   * @returns {BaseComponent} Component object
   */
  static findOrCreate ($element, configObject) {
    if (ComponentRegistry.has($element)) {
      const componentInRegistry = ComponentRegistry.get($element)
      if (componentInRegistry instanceof this) {
        return componentInRegistry
      } else {
        throw new Error(`Element already initialised – expected ${this.name} but got ${componentInRegistry.constructor}`)
      }
    } else {
      const component = Reflect.construct(this, [$element, configObject])
      ComponentRegistry.set($element, component)
      return component
    }
  }

  /**
   * Find or create all instances of a component based on their default
   * data-module selector.
   *
   * @param {HTMLElement} $scope
   * @param {object} configObject
   */
  static createAll ($scope = document, configObject = {}) {
    $scope.querySelectorAll(`[data-module="${this.selector}"]`)
      .forEach($element => this.findOrCreate($element, configObject))
  }
}

export default BaseComponent
