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
function isSupported($scope = document.body) {
  return $scope.classList.contains('govuk-frontend-supported');
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

function normaliseString(value) {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmedValue = value.trim();
  if (trimmedValue === 'true') {
    return true;
  }
  if (trimmedValue === 'false') {
    return false;
  }
  if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
    return Number(trimmedValue);
  }
  return value;
}
function normaliseDataset(dataset) {
  const out = {};
  for (const key in dataset) {
    out[key] = normaliseString(dataset[key]);
  }
  return out;
}

class GOVUKFrontendError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'GOVUKFrontendError';
  }
}
class SupportError extends GOVUKFrontendError {
  constructor() {
    super('GOV.UK Frontend is not supported in this browser');
    this.name = 'SupportError';
  }
}
class ElementError extends GOVUKFrontendError {
  /**
   * @param {Element | null} element - The element in error
   * @param {object} options - Element error options
   * @param {string} options.componentName - The name of the component throwing the error
   * @param {string} options.identifier - An identifier that'll let the user understand which element has an error (variable name, CSS selector)
   * @param {string | typeof HTMLElement} [options.expectedType] - The type that was expected for the identifier
   */
  constructor(element, {
    componentName,
    identifier,
    expectedType
  }) {
    let reason = `${identifier} not found`;
    if (element) {
      expectedType = expectedType || window.HTMLElement;
      reason = typeof expectedType === 'string' ? `${identifier} is not of type ${expectedType}` : `${identifier} is not an instance of ${expectedType.name}`;
    }
    super(`${componentName}: ${reason}`);
    this.name = 'ElementError';
  }
}

class GOVUKFrontendComponent {
  constructor() {
    this.checkSupport();
  }
  checkSupport() {
    if (!isSupported()) {
      throw new SupportError();
    }
  }
}

/**
 * Notification Banner component
 *
 * @preserve
 */
class NotificationBanner extends GOVUKFrontendComponent {
  /**
   * @param {Element} $module - HTML element to use for notification banner
   * @param {NotificationBannerConfig} [config] - Notification banner config
   */
  constructor($module, config) {
    super();
    this.$module = void 0;
    this.config = void 0;
    if (!($module instanceof HTMLElement)) {
      throw new ElementError($module, {
        componentName: 'Notification banner',
        identifier: '$module'
      });
    }
    this.$module = $module;
    this.config = mergeConfigs(NotificationBanner.defaults, config || {}, normaliseDataset($module.dataset));
    this.setFocus();
  }
  setFocus() {
    if (this.config.disableAutoFocus) {
      return;
    }
    if (this.$module.getAttribute('role') !== 'alert') {
      return;
    }
    if (!this.$module.getAttribute('tabindex')) {
      this.$module.setAttribute('tabindex', '-1');
      this.$module.addEventListener('blur', () => {
        this.$module.removeAttribute('tabindex');
      });
    }
    this.$module.focus();
  }
}

/**
 * Notification banner config
 *
 * @typedef {object} NotificationBannerConfig
 * @property {boolean} [disableAutoFocus=false] - If set to `true` the
 *   notification banner will not be focussed when the page loads. This only
 *   applies if the component has a `role` of `alert` – in other cases the
 *   component will not be focused on page load, regardless of this option.
 */
NotificationBanner.moduleName = 'govuk-notification-banner';
NotificationBanner.defaults = Object.freeze({
  disableAutoFocus: false
});

export { NotificationBanner };
//# sourceMappingURL=notification-banner.bundle.mjs.map
