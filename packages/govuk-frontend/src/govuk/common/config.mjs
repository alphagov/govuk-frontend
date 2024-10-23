import { ConfigError } from '../errors/index.mjs'

import { isObject } from './index.mjs'

/**
 * Config
 *
 * Instance of configuration for a component
 *
 * @template {{[key:string]: unknown}} [ConfigType={}]
 * @augments ConfigType
 */
class Config {
  /**
   * @type {ConfigType}
   */
  configObject

  /**
   *  @type {CompatibleClass<ConfigType>}
   */
  component

  /**
   * Merge configuration objects into a single config
   *
   * I think this makes sense to go in here rather then
   * as utility function because it is used each time a
   * configuration is created in the constructor of a component.
   * So it would not be removed during tree-shaking.
   *
   * @param {...{[key:string]: unknown}} configObjects - configuration objects passed
   * @returns {{[key:string]: unknown}} - merged configuration object
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
          formattedConfigObject[key] = Config.mergeConfigs(option, override)
        } else {
          // Apply override
          formattedConfigObject[key] = override
        }
      }
    }

    return formattedConfigObject
  }

  /**
   * @param {ComponentClass} component - Class of component using config
   * @param {...ConfigType} configObjects - Config objects to merge
   */
  constructor(component, ...configObjects) {
    this.component = /** @type {CompatibleClass<ConfigType>} */ (component)

    // no configuration objects supplied
    // then config object is just empty...
    if (!configObjects.length) {
      this.configObject = /** @type {ConfigType} */ ({})

      return
    }

    if (typeof component.defaults === 'undefined') {
      throw new ConfigError('No defaults specified in component')
    }

    if (typeof component.schema === 'undefined') {
      throw new ConfigError('No schema specified in component')
    }

    // we know mergeConfigs will return a ConfigType object as
    // we only accept configObjects of type ConfigType
    this.configObject = /** @type {ConfigType} */ (
      Config.mergeConfigs(this.component.defaults, ...configObjects)
    )

    // have to assign to a separate variable
    // to get the Proxy to work
    const configObject = this.configObject

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

/**
 * @typedef {import("./index.mjs").ObjectNested} ObjectNested
 */

/* eslint-disable jsdoc/valid-types --
 * `{new(...args: any[] ): object}` is not recognised as valid
 * https://github.com/gajus/eslint-plugin-jsdoc/issues/145#issuecomment-1308722878
 * https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/131
 **/

/**
 * @typedef {{new (...args: any[]): any, moduleName: string, schema?: {[key:string]: unknown}, defaults?: {[key:string]: unknown} }} ComponentClass
 */

/* eslint-disable jsdoc/valid-types --
 * `{new(...args: any[] ): object}` is not recognised as valid
 * https://github.com/gajus/eslint-plugin-jsdoc/issues/145#issuecomment-1308722878
 * https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/131
 **/

/**
 * @typedef {import("./index.mjs").Schema} Schema
 */

/**
 * @template {{[key:string]: unknown}} [ConfigType={}]
 * @typedef {{new (...args: any[]): any, moduleName: string, schema: Schema, defaults: {[key:string]: unknown}, configOverride?: (config: ConfigType) => ConfigType }} CompatibleClass
 */

export default Config
