import { ConfigError } from '../errors/index.mjs'
import { GOVUKFrontendComponent } from '../govuk-frontend-component.mjs'

import { isObject, formatErrorMessage } from './index.mjs'

export const configOverride = Symbol.for('configOverride')

/**
 * Base Component class
 *
 * Centralises the behaviours shared by our components
 *
 * @virtual
 * @template {ObjectNested} [ConfigurationType={}]
 * @template {Element & { dataset: DOMStringMap }} [RootElementType=HTMLElement]
 * @augments GOVUKFrontendComponent<RootElementType>
 */
export class GOVUKFrontendComponentConfigurable extends GOVUKFrontendComponent {
  /**
   * configOverride
   *
   * Function which defines configuration overrides to prioritize
   * properties from the root element's dataset.
   *
   * It should take a subset of configuration as input and return
   * a new configuration object with properties that should be
   * overridden based on the root element's dataset. A Symbol
   * is used for indexing to prevent conflicts.
   *
   * @internal
   * @virtual
   * @param {ObjectNested} [param] - Configuration object
   * @returns {ObjectNested} return - Configuration object
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [configOverride](param) {
    return {}
  }

  /**
   * Returns the root element of the component
   *
   * @protected
   * @returns {ConfigurationType} - the root element of component
   */
  get config() {
    return this._config
  }

  /**
   *
   * @type {ConfigurationType}
   */
  _config

  /**
   * Constructs a new component, validating that GOV.UK Frontend is supported
   *
   * @internal
   * @param {Element | null} [$root] - HTML element to use for component
   * @param {ConfigurationType} [config] - HTML element to use for component
   */
  constructor($root, config) {
    super($root)

    const childConstructor =
      /** @type {ChildClassConstructor<ConfigurationType>} */ (this.constructor)

    if (typeof childConstructor.defaults === 'undefined') {
      throw new ConfigError(
        formatErrorMessage(
          childConstructor,
          'Config passed as parameter into constructor but no defaults defined'
        )
      )
    }

    const datasetConfig = /** @type {ConfigurationType} */ (
      normaliseDataset(childConstructor, this._$root.dataset)
    )

    this._config = /** @type {ConfigurationType} */ (
      mergeConfigs(
        childConstructor.defaults,
        config ?? {},
        this[configOverride](datasetConfig),
        datasetConfig
      )
    )
  }
}

/**
 * Normalise string
 *
 * 'If it looks like a duck, and it quacks like a duck…' 🦆
 *
 * If the passed value looks like a boolean or a number, convert it to a boolean
 * or number.
 *
 * Designed to be used to convert config passed via data attributes (which are
 * always strings) into something sensible.
 *
 * @internal
 * @param {DOMStringMap[string]} value - The value to normalise
 * @param {SchemaProperty} [property] - Component schema property
 * @returns {string | boolean | number | undefined} Normalised data
 */
export function normaliseString(value, property) {
  const trimmedValue = value ? value.trim() : ''

  let output
  let outputType = property?.type

  // No schema type set? Determine automatically
  if (!outputType) {
    if (['true', 'false'].includes(trimmedValue)) {
      outputType = 'boolean'
    }

    // Empty / whitespace-only strings are considered finite so we need to check
    // the length of the trimmed string as well
    if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
      outputType = 'number'
    }
  }

  switch (outputType) {
    case 'boolean':
      output = trimmedValue === 'true'
      break

    case 'number':
      output = Number(trimmedValue)
      break

    default:
      output = value
  }

  return output
}

/**
 * Normalise dataset
 *
 * Loop over an object and normalise each value using {@link normaliseString},
 * optionally expanding nested `i18n.field`
 *
 * @internal
 * @param {{ schema?: Schema, moduleName: string }} Component - Component class
 * @param {DOMStringMap} dataset - HTML element dataset
 * @returns {ObjectNested} Normalised dataset
 */
export function normaliseDataset(Component, dataset) {
  if (typeof Component.schema === 'undefined') {
    throw new ConfigError(
      formatErrorMessage(
        Component,
        'Config passed as parameter into constructor but no schema defined'
      )
    )
  }

  const out = /** @type {ReturnType<typeof normaliseDataset>} */ ({})

  // Normalise top-level dataset ('data-*') values using schema types
  for (const [field, property] of Object.entries(Component.schema.properties)) {
    if (field in dataset) {
      out[field] = normaliseString(dataset[field], property)
    }

    /**
     * Extract and normalise nested object values automatically using
     * {@link normaliseString} but only schema object types are allowed
     */
    if (property?.type === 'object') {
      out[field] = extractConfigByNamespace(Component.schema, dataset, field)
    }
  }

  return out
}

/**
 * Config merging function
 *
 * Takes any number of objects and combines them together, with
 * greatest priority on the LAST item passed in.
 *
 * @internal
 * @param {...{ [key: string]: unknown }} configObjects - Config objects to merge
 * @returns {{ [key: string]: unknown }} A merged config object
 */
export function mergeConfigs(...configObjects) {
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
        formattedConfigObject[key] = mergeConfigs(option, override)
      } else {
        // Apply override
        formattedConfigObject[key] = override
      }
    }
  }

  return formattedConfigObject
}

/**
 * Validate component config by schema
 *
 * Follows limited examples in JSON schema for wider support in future
 *
 * {@link https://ajv.js.org/json-schema.html#compound-keywords}
 * {@link https://ajv.js.org/packages/ajv-errors.html#single-message}
 *
 * @internal
 * @param {Schema} schema - Config schema
 * @param {{ [key: string]: unknown }} config - Component config
 * @returns {string[]} List of validation errors
 */
export function validateConfig(schema, config) {
  const validationErrors = []

  // Check errors for each schema
  for (const [name, conditions] of Object.entries(schema)) {
    const errors = []

    // Check errors for each schema condition
    if (Array.isArray(conditions)) {
      for (const { required, errorMessage } of conditions) {
        if (!required.every((key) => !!config[key])) {
          errors.push(errorMessage) // Missing config key value
        }
      }

      // Check one condition passes or add errors
      if (name === 'anyOf' && !(conditions.length - errors.length >= 1)) {
        validationErrors.push(...errors)
      }
    }
  }

  return validationErrors
}

/**
 * Extracts keys starting with a particular namespace from dataset ('data-*')
 * object, removing the namespace in the process, normalising all values
 *
 * @internal
 * @param {Schema} schema - The schema of a component
 * @param {DOMStringMap} dataset - The object to extract key-value pairs from
 * @param {string} namespace - The namespace to filter keys with
 * @returns {ObjectNested | undefined} Nested object with dot-separated key namespace removed
 */
export function extractConfigByNamespace(schema, dataset, namespace) {
  const property = schema.properties[namespace]

  // Only extract configs for object schema properties
  if (property?.type !== 'object') {
    return
  }

  // Add default empty config
  const newObject = {
    [namespace]: /** @type {ObjectNested} */ ({})
  }

  for (const [key, value] of Object.entries(dataset)) {
    /** @type {ObjectNested | ObjectNested[NestedKey]} */
    let current = newObject

    // Split the key into parts, using . as our namespace separator
    const keyParts = key.split('.')

    /**
     * Create new level per part
     *
     * e.g. 'i18n.textareaDescription.other' becomes
     * `{ i18n: { textareaDescription: { other } } }`
     */
    for (const [index, name] of keyParts.entries()) {
      if (typeof current === 'object') {
        // Drop down to nested object until the last part
        if (index < keyParts.length - 1) {
          // New nested object (optionally) replaces existing value
          if (!isObject(current[name])) {
            current[name] = {}
          }

          // Drop down into new or existing nested object
          current = current[name]
        } else if (key !== namespace) {
          // Normalised value (optionally) replaces existing value
          current[name] = normaliseString(value)
        }
      }
    }
  }

  return newObject[namespace]
}

/**
 * @internal
 * @typedef {keyof ObjectNested} NestedKey
 * @typedef {{ [key: string]: string | boolean | number | ObjectNested | undefined }} ObjectNested
 */

/**
 * Schema for component config
 *
 * @typedef {object} Schema
 * @property {{ [field: string]: SchemaProperty | undefined }} properties - Schema properties
 * @property {SchemaCondition[]} [anyOf] - List of schema conditions
 */

/**
 * Schema property for component config
 *
 * @typedef {object} SchemaProperty
 * @property {'string' | 'boolean' | 'number' | 'object'} type - Property type
 */

/**
 * Schema condition for component config
 *
 * @typedef {object} SchemaCondition
 * @property {string[]} required - List of required config fields
 * @property {string} errorMessage - Error message when required config fields not provided
 */

/**
 * @template {ObjectNested} [ConfigurationType={}]
 * @typedef ChildClass
 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
 * @property {Schema} [schema] - The schema of the component configuration
 * @property {ConfigurationType} [defaults] - The default values of the configuration of the component
 */

/**
 * @template {ObjectNested} [ConfigurationType={}]
 * @typedef {typeof GOVUKFrontendComponent & ChildClass<ConfigurationType>} ChildClassConstructor<ConfigurationType>
 */
