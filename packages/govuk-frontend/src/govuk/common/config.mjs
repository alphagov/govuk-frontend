import { isObject } from './index.mjs'
// import { normaliseString } from "./normalise-string.mjs"

/**
 * Config
 *
 * @template {ConfigObject} [ConfigurationType=import('./index.mjs').ObjectNested]
 */
class Config {
  /**
   * Config Object
   *
   * @type {ConfigurationType}
   */
  configObject

  /**
   * Config flattening function
   *
   * Takes any number of objects, flattens them into namespaced key-value pairs,
   * (e.g. {'i18n.showSection': 'Show section'}) and combines them together, with
   * greatest priority on the LAST item passed in.
   *
   * @param {...ConfigObject} configObjects - configuration objects
   * @returns {ConfigurationType} - merged configuration object
   */
  mergeConfigs(...configObjects) {
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

    return /** @type {ConfigurationType} */ (formattedConfigObject)
  }

  /**
   * Instance of component
   *
   * @type {ComponentInstance}
   */
  // component

  // * @param {ComponentInstance} component - instance of component

  /**
   * @param {...ConfigurationType} configObjects - configuration objects
   */
  constructor(...configObjects) {
    this.configObject = this.mergeConfigs(...configObjects)

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

  /**
   * Extracts keys starting with a particular namespace from dataset ('data-*')
   * object, removing the namespace in the process, normalising all values
   *
   * @param {string} namespace - The namespace to filter keys with
   * @returns {ObjectNested | undefined} Nested object with dot-separated key namespace removed
   */
  // extractConfigByNamespace (namespace) {
  // 	const componentClass = this.component.constructor;
  // 	const dataset = this.component.$root.dataset;

  //   // const property = Component.schema.properties[namespace]
  //   const property = componentClass.schema.properties[namespace]

  //   // Only extract configs for object schema properties
  //   if (property.type !== 'object') {
  //     return
  //   }

  //   // Add default empty config
  //   const newObject = {
  //     [namespace]: /** @type {ObjectNested} */ ({})
  //   }

  //   for (const [key, value] of Object.entries(dataset)) {
  //     /** @type {ObjectNested | ObjectNested[NestedKey]} */
  //     let current = newObject

  //     // Split the key into parts, using . as our namespace separator
  //     const keyParts = key.split('.')

  //     /**
  //      * Create new level per part
  //      *
  //      * e.g. 'i18n.textareaDescription.other' becomes
  //      * `{ i18n: { textareaDescription: { other } } }`
  //      */
  //     for (const [index, name] of keyParts.entries()) {
  //       if (typeof current === 'object') {
  //         // Drop down to nested object until the last part
  //         if (index < keyParts.length - 1) {
  //           // New nested object (optionally) replaces existing value
  //           if (!isObject(current[name])) {
  //             current[name] = {}
  //           }

  //           // Drop down into new or existing nested object
  //           current = current[name]
  //         } else if (key !== namespace) {
  //           // Normalised value (optionally) replaces existing value
  //           current[name] = normaliseString(value)
  //         }
  //       }
  //     }
  //   }

  //   return newObject[namespace]
  // }
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

export default Config
