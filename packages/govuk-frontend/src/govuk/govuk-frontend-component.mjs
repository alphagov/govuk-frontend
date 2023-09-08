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
   * @param {Schema} schema - Config schema
   * @param {Config[ConfigKey]} config - Component config
   */
  checkConfig(schema, config) {
    const errors = validateConfig(schema, config)

    if (errors.length) {
      throw new ConfigError(errors[0])
    }
  }
}

/**
 * Schema for component config
 *
 * @typedef {object} Schema
 * @property {SchemaCondition[]} [anyOf] - List of schema conditions
 */

/**
 * Schema condition for component config
 *
 * @typedef {object} SchemaCondition
 * @property {string[]} required - List of required config fields
 * @property {string} errorMessage - Error message when required config fields not provided
 */

/**
 * @typedef {import('govuk-frontend').Config} Config - Config for all components via `initAll()`
 * @typedef {import('govuk-frontend').ConfigKey} ConfigKey - Component config keys, e.g. `accordion` and `characterCount`
 */
