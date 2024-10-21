import { GOVUKFrontendComponent } from '../govuk-frontend-component.mjs'
import { isObject } from './index.mjs'

/**
 * Config
 *
 * @template {ConfigObject} [ConfigurationType=import('./index.mjs').ObjectNested]
 */
class Config {
  /**
   * Schema for configuration
   * 
   * @type {Schema}
   */
  static schema


  /**
   * Defaults for configuration
   * 
   * @type {ConfigObject}
   */
  static defaults

  /**
   * Dataset overrides
   * 
   * @type {ConfigObject}
   */
  static overrides

  /**
   * Config flattening function
   *
   * Takes any number of objects, flattens them into namespaced key-value pairs,
   * (e.g. {'i18n.showSection': 'Show section'}) and combines them together, with
   * greatest priority on the LAST item passed in.
   *
   * @param {...ConfigObject} configObjects - configuration objects
   * @returns {import('./index.mjs').ObjectNested} - merged configuration object
   */
  static mergeConfigs(...configObjects) {
    // Start with an empty object as our base
    /** @type {{ [key: string]: unknown }} */
    const formattedConfigObject = {}

    // Loop through each of the passed objects
    for (const configObject of configObjects) {
      for (const key of Object.keys(configObject)) {
        const option = formattedConfigObject[key]
        const override = configObject[key]

        // Push their keys one-by-one into formattedConfigObject. Any duplicate
        // keys with object values will be merged, otherwise the new value will
        // override the existing value.
        if (isObject(option) && isObject(override)) {
          // @ts-expect-error Index signature for type 'string' is missing
          formattedConfigObject[key] = this.mergeConfigs(option, override)
        } else {
          // Apply override
          formattedConfigObject[key] = override
        }
      }
    }

    return /** @type {import('./index.mjs').ObjectNested} */ (formattedConfigObject)
  }

  configObject = {}


  /**
   * @param {import('../govuk-frontend-component.mjs').ChildClassConstructorWithConfig} component - component instance
   * @param {...ConfigObject} configObjects - configuration objects
   */ 
  constructor(component, ...configObjects) {
    // const configObject = Config.mergeConfigs(...configObjects)

    this.configObject = configObject

    return new Proxy(this, {
      get(target, name, receiver) {
        if (!Reflect.has(target, name)) {
          return configObject[String(name)]
        }
        return Reflect.get(target, name, receiver)
      }
    })    
  }
}

/* eslint-disable jsdoc/valid-types --
 * `{new(...args: any[] ): object}` is not recognised as valid
 * https://github.com/gajus/eslint-plugin-jsdoc/issues/145#issuecomment-1308722878
 * https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/131
 **/

/**
 * @typedef {{new (...args: any[]): any, defaults?: object, moduleName: string, constructor: ComponentClass, $root: { dataset: {[key:string]: string} } }} ComponentInstance
 */

/**
 * @typedef {{ schema: { properties: { [key:string]: { type?: string } } } }} ComponentClass
 */

/* eslint-enable jsdoc/valid-types */

/**
 * @typedef {{[key:string]: unknown}} ConfigObject
 */

/**
 * @internal
 * @typedef {keyof ObjectNested} NestedKey
 * @typedef {{ [key: string]: string | boolean | number | ObjectNested | undefined }} ObjectNested
 */

/**
 * @typedef {import('./index.mjs').Schema} Schema
 */

export default Config
