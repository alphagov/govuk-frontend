import { ConfigError } from '../errors/index.mjs';
import { GOVUKFrontendComponent } from '../govuk-frontend-component.mjs';
import { formatErrorMessage, isObject } from './index.mjs';

const configOverride = Symbol.for('configOverride');
class ConfigurableComponent extends GOVUKFrontendComponent {
  [configOverride](param) {
    return {};
  }

  /**
   * Returns the root element of the component
   *
   * @protected
   * @returns {ConfigurationType} - the root element of component
   */
  get config() {
    return this._config;
  }
  constructor($root, config) {
    super($root);
    this._config = void 0;
    const childConstructor = this.constructor;
    if (typeof childConstructor.defaults === 'undefined') {
      throw new ConfigError(formatErrorMessage(childConstructor, 'Config passed as parameter into constructor but no defaults defined'));
    }
    const datasetConfig = normaliseDataset(childConstructor, this._$root.dataset);
    this._config = mergeConfigs(childConstructor.defaults, config != null ? config : {}, this[configOverride](datasetConfig), datasetConfig);
  }
}
function normaliseString(value, property) {
  const trimmedValue = value ? value.trim() : '';
  let output;
  let outputType = property == null ? void 0 : property.type;
  if (!outputType) {
    if (['true', 'false'].includes(trimmedValue)) {
      outputType = 'boolean';
    }
    if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
      outputType = 'number';
    }
  }
  switch (outputType) {
    case 'boolean':
      output = trimmedValue === 'true';
      break;
    case 'number':
      output = Number(trimmedValue);
      break;
    default:
      output = value;
  }
  return output;
}
function normaliseDataset(Component, dataset) {
  if (typeof Component.schema === 'undefined') {
    throw new ConfigError(formatErrorMessage(Component, 'Config passed as parameter into constructor but no schema defined'));
  }
  const out = {};
  for (const [field, property] of Object.entries(Component.schema.properties)) {
    if (field in dataset) {
      out[field] = normaliseString(dataset[field], property);
    }
    if ((property == null ? void 0 : property.type) === 'object') {
      out[field] = extractConfigByNamespace(Component.schema, dataset, field);
    }
  }
  return out;
}
function mergeConfigs(...configObjects) {
  const formattedConfigObject = {};
  for (const configObject of configObjects) {
    for (const key of Object.keys(configObject)) {
      const option = formattedConfigObject[key];
      const override = configObject[key];
      if (isObject(option) && isObject(override)) {
        formattedConfigObject[key] = mergeConfigs(option, override);
      } else {
        formattedConfigObject[key] = override;
      }
    }
  }
  return formattedConfigObject;
}
function validateConfig(schema, config) {
  const validationErrors = [];
  for (const [name, conditions] of Object.entries(schema)) {
    const errors = [];
    if (Array.isArray(conditions)) {
      for (const {
        required,
        errorMessage
      } of conditions) {
        if (!required.every(key => !!config[key])) {
          errors.push(errorMessage);
        }
      }
      if (name === 'anyOf' && !(conditions.length - errors.length >= 1)) {
        validationErrors.push(...errors);
      }
    }
  }
  return validationErrors;
}
function extractConfigByNamespace(schema, dataset, namespace) {
  const property = schema.properties[namespace];
  if ((property == null ? void 0 : property.type) !== 'object') {
    return;
  }
  const newObject = {
    [namespace]: ({})
  };
  for (const [key, value] of Object.entries(dataset)) {
    let current = newObject;
    const keyParts = key.split('.');
    for (const [index, name] of keyParts.entries()) {
      if (typeof current === 'object') {
        if (index < keyParts.length - 1) {
          if (!isObject(current[name])) {
            current[name] = {};
          }
          current = current[name];
        } else if (key !== namespace) {
          current[name] = normaliseString(value);
        }
      }
    }
  }
  return newObject[namespace];
}
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

export { ConfigurableComponent, configOverride, extractConfigByNamespace, mergeConfigs, normaliseDataset, normaliseString, validateConfig };
//# sourceMappingURL=configuration.mjs.map
