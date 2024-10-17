import Config from './common/config.mjs'
import { isInitialised, isSupported } from './common/index.mjs'
import { normaliseDataset } from './common/normalise-dataset.mjs'
import {
  ConfigError,
  ElementError,
  InitError,
  SupportError
} from './errors/index.mjs'

/**
 * Base Component class
 *
 * Centralises the behaviours shared by our components
 *
 * @virtual
 * @template {Element} [RootElementType=HTMLElement]
 */
export class GOVUKFrontendComponent {
  /**
   * Returns the root element of the component
   *
   * @protected
   * @returns {Config | undefined} - the root element of component
   */
  get config() {
    return this._config
  }

  /**
   *
   * @type {Config | undefined}
   */
  _config

  /**
   * @type {typeof Element}
   */
  static elementType = HTMLElement

  // allows Typescript user to work around the lack of types
  // in GOVUKFrontend package, Typescript is not aware of $root
  // in components that extend GOVUKFrontendComponent
  /**
   * Returns the root element of the component
   *
   * @protected
   * @returns {RootElementType} - the root element of component
   */
  get $root() {
    return this._$root
  }

  /**
   * @protected
   * @type {RootElementType}
   */
  _$root

  /**
   * Constructs a new component, validating that GOV.UK Frontend is supported
   *
   * @internal
   * @param {Element | null} [$root] - HTML element to use for component
   * @param {import('./common/index.mjs').ObjectNested} [config] - HTML element to use for component
   */
  constructor($root, config = {}) {
    const childConstructor = /** @type {ChildClassConstructor} */ (
      this.constructor
    )

    // If component has config, schema needs to be defined by the component
    // for subsequent config functionality
    if (
      Object.entries(config).length &&
      typeof childConstructor.schema === 'undefined'
    ) {
      throw new ConfigError(
        'Config passed as parameter into constructor but no schema defined'
      )
    }

    if (
      Object.entries(config).length &&
      typeof childConstructor.defaults === 'undefined'
    ) {
      throw new ConfigError(
        'Config passed as parameter into constructor but no defaults defined'
      )
    }

    // TypeScript does not enforce that inheriting classes will define a `moduleName`
    // (even if we add a `@virtual` `static moduleName` property to this class).
    // While we trust users to do this correctly, we do a little check to provide them
    // a helpful error message.
    //
    // After this, we'll be sure that `childConstructor` has a `moduleName`
    // as expected of the `ChildClassConstructor` we've cast `this.constructor` to.
    if (typeof childConstructor.moduleName !== 'string') {
      throw new InitError(`\`moduleName\` not defined in component`)
    }

    if (!($root instanceof childConstructor.elementType)) {
      throw new ElementError({
        element: $root,
        component: childConstructor,
        identifier: 'Root element (`$root`)',
        expectedType: childConstructor.elementType.name
      })
    } else {
      this._$root = /** @type {RootElementType} */ ($root)
    }

    childConstructor.checkSupport()

    this.checkInitialised()

    const moduleName = childConstructor.moduleName

    // if the user has passed in an object with entries for config
    if (Object.entries(config).length) {
      // we can assume schema and defaults are defined now
      // if no error thrown, so new variable that is of type
      // ChildClassConstructorWithConfig
      const childConstructorWithConfig =
        /** @type {ChildClassConstructorWithConfig} */ (this.constructor)

      this._config = new Config(
        childConstructorWithConfig.defaults,
        config,
        normaliseDataset(
          childConstructorWithConfig,
          // dataset isnt obtainable on Element
          // but what the user will actual pass as $root
          // will have dataset defined because it will be
          // a class that extends Element and implements dataset?
          /** @type {{ dataset: DOMStringMap }} */ (
            /** @type {unknown} */ (this.$root)
          ).dataset
        )
      )
    }

    this.$root.setAttribute(`data-${moduleName}-init`, '')
  }

  /**
   * Validates whether component is already initialised
   *
   * @private
   * @throws {InitError} when component is already initialised
   */
  checkInitialised() {
    const constructor = /** @type {ChildClassConstructor} */ (this.constructor)
    const moduleName = constructor.moduleName

    if (moduleName && isInitialised(this.$root, moduleName)) {
      throw new InitError(constructor)
    }
  }

  /**
   * Validates whether components are supported
   *
   * @throws {SupportError} when the components are not supported
   */
  static checkSupport() {
    if (!isSupported()) {
      throw new SupportError()
    }
  }
}

/**
 * @typedef ElementWithDataset
 * @property {DOMStringMap} dataset - dataset
 * @augments Element
 */

/**
 * @typedef ChildClass
 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
 * @property {import('./common/index.mjs').Schema} [schema] - The module name that'll be looked for in the DOM when initialising the component
 * @property {import('./common/index.mjs').ObjectNested} [defaults] - The default configuration if not passed by parameter
 */

/**
 * @typedef ChildClassWithConfig
 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
 * @property {import('./common/index.mjs').Schema} schema - The module name that'll be looked for in the DOM when initialising the component
 * @property {import('./common/index.mjs').ObjectNested} defaults - The default configuration if not passed by parameter
 */

/**
 * @typedef {typeof GOVUKFrontendComponent & ChildClassWithConfig} ChildClassConstructorWithConfig
 */

/**
 * @typedef {typeof GOVUKFrontendComponent & ChildClass} ChildClassConstructor
 */
