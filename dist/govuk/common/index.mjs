function mergeConfigs() {
  const flattenObject = function flattenObject(configObject) {
    const flattenedObject = {};
    const flattenLoop = function flattenLoop(obj, prefix) {
      for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        const value = obj[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object') {
          flattenLoop(value, prefixedKey);
        } else {
          flattenedObject[prefixedKey] = value;
        }
      }
    };
    flattenLoop(configObject);
    return flattenedObject;
  };
  const formattedConfigObject = {};
  for (let i = 0; i < arguments.length; i++) {
    const obj = flattenObject(arguments[i]);
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        formattedConfigObject[key] = obj[key];
      }
    }
  }
  return formattedConfigObject;
}
function extractConfigByNamespace(configObject, namespace) {
  if (!configObject || typeof configObject !== 'object') {
    throw new Error('Provide a `configObject` of type "object".');
  }
  if (!namespace || typeof namespace !== 'string') {
    throw new Error('Provide a `namespace` of type "string" to filter the `configObject` by.');
  }
  const newObject = {};
  for (const key in configObject) {
    const keyParts = key.split('.');
    if (Object.prototype.hasOwnProperty.call(configObject, key) && keyParts[0] === namespace) {
      if (keyParts.length > 1) {
        keyParts.shift();
      }
      const newKey = keyParts.join('.');
      newObject[newKey] = configObject[key];
    }
  }
  return newObject;
}
function isSupported($scope = document.body) {
  return $scope.classList.contains('govuk-frontend-supported');
}
function validateConfig(schema, config) {
  const validationErrors = [];
  for (const [name, conditions] of Object.entries(schema)) {
    const errors = [];
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
  return validationErrors;
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

export { extractConfigByNamespace, isSupported, mergeConfigs, validateConfig };
//# sourceMappingURL=index.mjs.map
