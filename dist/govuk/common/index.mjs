import { normaliseString } from './normalise-string.mjs';

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
function extractConfigByNamespace(Component, dataset, namespace) {
  const property = Component.schema.properties[namespace];
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
function getFragmentFromUrl(url) {
  if (!url.includes('#')) {
    return undefined;
  }
  return url.split('#').pop();
}
function getBreakpoint(name) {
  const property = `--govuk-frontend-breakpoint-${name}`;
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(property);
  return {
    property,
    value: value || undefined
  };
}
function setFocus($element, options = {}) {
  var _options$onBeforeFocu;
  const isFocusable = $element.getAttribute('tabindex');
  if (!isFocusable) {
    $element.setAttribute('tabindex', '-1');
  }
  function onFocus() {
    $element.addEventListener('blur', onBlur, {
      once: true
    });
  }
  function onBlur() {
    var _options$onBlur;
    (_options$onBlur = options.onBlur) == null || _options$onBlur.call($element);
    if (!isFocusable) {
      $element.removeAttribute('tabindex');
    }
  }
  $element.addEventListener('focus', onFocus, {
    once: true
  });
  (_options$onBeforeFocu = options.onBeforeFocus) == null || _options$onBeforeFocu.call($element);
  $element.focus();
}
function isInitialised($root, moduleName) {
  return $root instanceof HTMLElement && $root.hasAttribute(`data-${moduleName}-init`);
}

/**
 * Checks if GOV.UK Frontend is supported on this page
 *
 * Some browsers will load and run our JavaScript but GOV.UK Frontend
 * won't be supported.
 *
 * @param {HTMLElement | null} [$scope] - (internal) `<body>` HTML element checked for browser support
 * @returns {boolean} Whether GOV.UK Frontend is supported on this page
 */
function isSupported($scope = document.body) {
  if (!$scope) {
    return false;
  }
  return $scope.classList.contains('govuk-frontend-supported');
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
function isArray(option) {
  return Array.isArray(option);
}
function isObject(option) {
  return !!option && typeof option === 'object' && !isArray(option);
}
function formatErrorMessage(Component, message) {
  return `${Component.moduleName}: ${message}`;
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
 * @typedef ComponentWithModuleName
 * @property {string} moduleName - Name of the component
 */

export { extractConfigByNamespace, formatErrorMessage, getBreakpoint, getFragmentFromUrl, isInitialised, isSupported, mergeConfigs, setFocus, validateConfig };
//# sourceMappingURL=index.mjs.map
