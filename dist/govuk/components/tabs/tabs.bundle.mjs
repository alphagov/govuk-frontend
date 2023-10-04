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
 * Tabs component
 *
 * @preserve
 */
class Tabs extends GOVUKFrontendComponent {
  /**
   * @param {Element} $module - HTML element to use for tabs
   */
  constructor($module) {
    super();
    this.$module = void 0;
    this.$tabs = void 0;
    this.$tabList = void 0;
    this.$tabListItems = void 0;
    this.keys = {
      left: 37,
      right: 39,
      up: 38,
      down: 40
    };
    this.jsHiddenClass = 'govuk-tabs__panel--hidden';
    this.changingHash = false;
    this.boundTabClick = void 0;
    this.boundTabKeydown = void 0;
    this.boundOnHashChange = void 0;
    this.mql = null;
    if (!($module instanceof HTMLElement)) {
      throw new ElementError($module, {
        componentName: 'Tabs',
        identifier: '$module'
      });
    }
    const $tabs = $module.querySelectorAll('a.govuk-tabs__tab');
    if (!$tabs.length) {
      throw new ElementError(null, {
        componentName: 'Tabs',
        identifier: `a.govuk-tabs__tab`
      });
    }
    this.$module = $module;
    this.$tabs = $tabs;
    this.boundTabClick = this.onTabClick.bind(this);
    this.boundTabKeydown = this.onTabKeydown.bind(this);
    this.boundOnHashChange = this.onHashChange.bind(this);
    const $tabList = this.$module.querySelector('.govuk-tabs__list');
    const $tabListItems = this.$module.querySelectorAll('li.govuk-tabs__list-item');
    if (!$tabList) {
      throw new ElementError(null, {
        componentName: 'Tabs',
        identifier: `.govuk-tabs__list`
      });
    }
    if (!$tabListItems.length) {
      throw new ElementError(null, {
        componentName: 'Tabs',
        identifier: `.govuk-tabs__list-item`
      });
    }
    this.$tabList = $tabList;
    this.$tabListItems = $tabListItems;
    this.setupResponsiveChecks();
  }
  setupResponsiveChecks() {
    this.mql = window.matchMedia('(min-width: 40.0625em)');
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => {
        this.checkMode();
      });
    } else {
      this.mql.addListener(() => {
        this.checkMode();
      });
    }
    this.checkMode();
  }
  checkMode() {
    if (this.mql.matches) {
      this.setup();
    } else {
      this.teardown();
    }
  }
  setup() {
    this.$tabList.setAttribute('role', 'tablist');
    this.$tabListItems.forEach($item => {
      $item.setAttribute('role', 'presentation');
    });
    this.$tabs.forEach($tab => {
      this.setAttributes($tab);
      $tab.addEventListener('click', this.boundTabClick, true);
      $tab.addEventListener('keydown', this.boundTabKeydown, true);
      this.hideTab($tab);
    });
    const $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
    this.showTab($activeTab);
    window.addEventListener('hashchange', this.boundOnHashChange, true);
  }
  teardown() {
    this.$tabList.removeAttribute('role');
    this.$tabListItems.forEach($item => {
      $item.removeAttribute('role');
    });
    this.$tabs.forEach($tab => {
      $tab.removeEventListener('click', this.boundTabClick, true);
      $tab.removeEventListener('keydown', this.boundTabKeydown, true);
      this.unsetAttributes($tab);
    });
    window.removeEventListener('hashchange', this.boundOnHashChange, true);
  }
  onHashChange() {
    const hash = window.location.hash;
    const $tabWithHash = this.getTab(hash);
    if (!$tabWithHash) {
      return;
    }
    if (this.changingHash) {
      this.changingHash = false;
      return;
    }
    const $previousTab = this.getCurrentTab();
    if (!$previousTab) {
      return;
    }
    this.hideTab($previousTab);
    this.showTab($tabWithHash);
    $tabWithHash.focus();
  }
  hideTab($tab) {
    this.unhighlightTab($tab);
    this.hidePanel($tab);
  }
  showTab($tab) {
    this.highlightTab($tab);
    this.showPanel($tab);
  }
  getTab(hash) {
    return this.$module.querySelector(`a.govuk-tabs__tab[href="${hash}"]`);
  }
  setAttributes($tab) {
    const panelId = this.getHref($tab).slice(1);
    $tab.setAttribute('id', `tab_${panelId}`);
    $tab.setAttribute('role', 'tab');
    $tab.setAttribute('aria-controls', panelId);
    $tab.setAttribute('aria-selected', 'false');
    $tab.setAttribute('tabindex', '-1');
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    $panel.setAttribute('role', 'tabpanel');
    $panel.setAttribute('aria-labelledby', $tab.id);
    $panel.classList.add(this.jsHiddenClass);
  }
  unsetAttributes($tab) {
    $tab.removeAttribute('id');
    $tab.removeAttribute('role');
    $tab.removeAttribute('aria-controls');
    $tab.removeAttribute('aria-selected');
    $tab.removeAttribute('tabindex');
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    $panel.removeAttribute('role');
    $panel.removeAttribute('aria-labelledby');
    $panel.classList.remove(this.jsHiddenClass);
  }
  onTabClick(event) {
    const $currentTab = this.getCurrentTab();
    const $nextTab = event.currentTarget;
    if (!$currentTab || !($nextTab instanceof HTMLAnchorElement)) {
      return;
    }
    event.preventDefault();
    this.hideTab($currentTab);
    this.showTab($nextTab);
    this.createHistoryEntry($nextTab);
  }
  createHistoryEntry($tab) {
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    const panelId = $panel.id;
    $panel.id = '';
    this.changingHash = true;
    window.location.hash = this.getHref($tab).slice(1);
    $panel.id = panelId;
  }
  onTabKeydown(event) {
    switch (event.keyCode) {
      case this.keys.left:
      case this.keys.up:
        this.activatePreviousTab();
        event.preventDefault();
        break;
      case this.keys.right:
      case this.keys.down:
        this.activateNextTab();
        event.preventDefault();
        break;
    }
  }
  activateNextTab() {
    const $currentTab = this.getCurrentTab();
    if (!$currentTab || !$currentTab.parentElement) {
      return;
    }
    const $nextTabListItem = $currentTab.parentElement.nextElementSibling;
    if (!$nextTabListItem) {
      return;
    }
    const $nextTab = $nextTabListItem.querySelector('a.govuk-tabs__tab');
    if (!$nextTab) {
      return;
    }
    this.hideTab($currentTab);
    this.showTab($nextTab);
    $nextTab.focus();
    this.createHistoryEntry($nextTab);
  }
  activatePreviousTab() {
    const $currentTab = this.getCurrentTab();
    if (!$currentTab || !$currentTab.parentElement) {
      return;
    }
    const $previousTabListItem = $currentTab.parentElement.previousElementSibling;
    if (!$previousTabListItem) {
      return;
    }
    const $previousTab = $previousTabListItem.querySelector('a.govuk-tabs__tab');
    if (!$previousTab) {
      return;
    }
    this.hideTab($currentTab);
    this.showTab($previousTab);
    $previousTab.focus();
    this.createHistoryEntry($previousTab);
  }
  getPanel($tab) {
    return this.$module.querySelector(this.getHref($tab));
  }
  showPanel($tab) {
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    $panel.classList.remove(this.jsHiddenClass);
  }
  hidePanel($tab) {
    const $panel = this.getPanel($tab);
    if (!$panel) {
      return;
    }
    $panel.classList.add(this.jsHiddenClass);
  }
  unhighlightTab($tab) {
    if (!$tab.parentElement) {
      return;
    }
    $tab.setAttribute('aria-selected', 'false');
    $tab.parentElement.classList.remove('govuk-tabs__list-item--selected');
    $tab.setAttribute('tabindex', '-1');
  }
  highlightTab($tab) {
    if (!$tab.parentElement) {
      return;
    }
    $tab.setAttribute('aria-selected', 'true');
    $tab.parentElement.classList.add('govuk-tabs__list-item--selected');
    $tab.setAttribute('tabindex', '0');
  }
  getCurrentTab() {
    return this.$module.querySelector('.govuk-tabs__list-item--selected a.govuk-tabs__tab');
  }
  getHref($tab) {
    const href = $tab.getAttribute('href');
    const hash = href.slice(href.indexOf('#'), href.length);
    return hash;
  }
}
Tabs.moduleName = 'govuk-tabs';

export { Tabs };
//# sourceMappingURL=tabs.bundle.mjs.map
