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
 * Header component
 *
 * @preserve
 */
class Header extends GOVUKFrontendComponent {
  /**
   * Apply a matchMedia for desktop which will trigger a state sync if the browser
   * viewport moves between states.
   *
   * @param {Element} $module - HTML element to use for header
   */
  constructor($module) {
    super();
    this.$module = void 0;
    this.$menuButton = void 0;
    this.$menu = void 0;
    this.menuIsOpen = false;
    this.mql = null;
    if (!($module instanceof HTMLElement)) {
      throw new ElementError($module, {
        componentName: 'Header',
        identifier: '$module'
      });
    }
    this.$module = $module;
    const $menuButton = $module.querySelector('.govuk-js-header-toggle');
    if (!$menuButton) {
      return this;
    }
    if (!($menuButton instanceof HTMLElement)) {
      throw new ElementError($menuButton, {
        componentName: 'Header',
        identifier: '.govuk-js-header-toggle'
      });
    }
    const menuId = $menuButton.getAttribute('aria-controls');
    if (!menuId) {
      throw new ElementError(null, {
        componentName: 'Header',
        identifier: '.govuk-js-header-toggle[aria-controls]'
      });
    }
    const $menu = document.getElementById(menuId);
    if (!($menu instanceof HTMLElement)) {
      throw new ElementError($menu, {
        componentName: 'Header',
        identifier: `#${menuId}`
      });
    }
    this.$menu = $menu;
    this.$menuButton = $menuButton;
    this.mql = window.matchMedia('(min-width: 48.0625em)');
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => this.syncState());
    } else {
      this.mql.addListener(() => this.syncState());
    }
    this.syncState();
    this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
  }
  syncState() {
    if (this.mql.matches) {
      this.$menu.removeAttribute('hidden');
      this.$menuButton.setAttribute('hidden', '');
    } else {
      this.$menuButton.removeAttribute('hidden');
      this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString());
      if (this.menuIsOpen) {
        this.$menu.removeAttribute('hidden');
      } else {
        this.$menu.setAttribute('hidden', '');
      }
    }
  }
  handleMenuButtonClick() {
    this.menuIsOpen = !this.menuIsOpen;
    this.syncState();
  }
}
Header.moduleName = 'govuk-header';

export { Header };
//# sourceMappingURL=header.bundle.mjs.map
