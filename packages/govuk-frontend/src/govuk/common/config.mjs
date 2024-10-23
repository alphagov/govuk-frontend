import { ConfigError } from '../errors/index.mjs'

import { isObject } from './index.mjs'
import { normaliseDataset } from './normalise-dataset.mjs'

/**
 * Config
 *
 * Instance of configuration for a component
 *
 * @template {{[key:string]: unknown}} [ConfigType=ObjectNested]
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
   * @param {DOMStringMap} dataset - dataset of root component
   * @param {...ConfigType} configObjects - Config objects to merge
   */
  constructor(component, dataset, ...configObjects) {
    if (typeof component.defaults === 'undefined') {
      throw new ConfigError('No defaults specified in component')
    }

    if (typeof component.schema === 'undefined') {
      throw new ConfigError('No schema specified in component')
    }

    this.component = /** @type {CompatibleClass<ConfigType>} */ (component)

    const normalisedDataset = /** @type {ConfigType} */ (
      normaliseDataset(this.component, dataset)
    )

    this.configObject = /** @type {ConfigType} */ (
      Config.mergeConfigs(
        this.component.defaults,
        ...configObjects,
        this.component.configOverride
          ? this.component.configOverride(normalisedDataset)
          : {},
        normalisedDataset
      )
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
 * @template {{[key:string]: unknown}} [ConfigType=ObjectNested]
 * @typedef {{new (...args: any[]): any, moduleName: string, schema: import('./index.mjs').Schema, defaults: ConfigType, configOverride?: (config: ConfigType) => ConfigType }} CompatibleClass
 */

export default Config
