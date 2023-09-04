import { validateConfig, isSupported } from './common/index.mjs'
import { ConfigError, SupportError } from './errors/index.mjs'

/**
 * Base Component class
 *
 * Centralises the behaviours shared by our components
 *
 * @internal
 * @abstract
 */
export class GOVUKFrontendComponent {
  /**
   * Constructs a new component, validating that GOV.UK Frontend is supported
   *
   * @internal
   */
  constructor() {
    this.checkSupport()
  }

  /**
   * Validates whether GOV.UK Frontend is supported
   *
   * @private
   */
  checkSupport() {
    if (!isSupported()) {
      throw new SupportError()
    }
  }

  /**
   * @protected
   * @param {Schema} schema
   * @param {Config[ConfigKey]} config
   */
  checkConfig(schema, config) {
    const errors = validateConfig(schema, config)

    if (errors.length) {
      throw new ConfigError(errors[0])
    }
  }
}

/**
 * Schema for components
 *
 * @typedef {object} Schema
 * @property {SchemaAnyOf} [anyOf] - An array of conditions
 */

/**
 * Component "Any Of" schema rule
 *
 * @typedef {object} SchemaAnyOf
 * @property {string} errorMessage - The error message to display if the condition fails
 * @property {SchemaCondition[]} conditions - Whether the current item is required
 */

/**
 * Schema required array
 *
 * @typedef {object} SchemaCondition
 * @property {string[]} required - Whether the current item is required
 */

/**
 * @typedef {import('govuk-frontend').Config} Config - Config for all components via `initAll()`
 * @typedef {import('govuk-frontend').ConfigKey} ConfigKey - Component config keys, e.g. `accordion` and `characterCount`
 */
