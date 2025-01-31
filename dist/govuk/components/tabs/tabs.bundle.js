(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GOVUKFrontend = global.GOVUKFrontend || {}));
})(this, (function (exports) { 'use strict';

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
  function formatErrorMessage(Component, message) {
    return `${Component.moduleName}: ${message}`;
  }
  /**
   * @typedef ComponentWithModuleName
   * @property {string} moduleName - Name of the component
   */

  class GOVUKFrontendError extends Error {
    constructor(...args) {
      super(...args);
      this.name = 'GOVUKFrontendError';
    }
  }
  class SupportError extends GOVUKFrontendError {
    /**
     * Checks if GOV.UK Frontend is supported on this page
     *
     * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
     */
    constructor($scope = document.body) {
      const supportMessage = 'noModule' in HTMLScriptElement.prototype ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet' : 'GOV.UK Frontend is not supported in this browser';
      super($scope ? supportMessage : 'GOV.UK Frontend initialised without `<script type="module">`');
      this.name = 'SupportError';
    }
  }
  class ElementError extends GOVUKFrontendError {
    constructor(messageOrOptions) {
      let message = typeof messageOrOptions === 'string' ? messageOrOptions : '';
      if (typeof messageOrOptions === 'object') {
        const {
          component,
          identifier,
          element,
          expectedType
        } = messageOrOptions;
        message = identifier;
        message += element ? ` is not of type ${expectedType != null ? expectedType : 'HTMLElement'}` : ' not found';
        message = formatErrorMessage(component, message);
      }
      super(message);
      this.name = 'ElementError';
    }
  }
  class InitError extends GOVUKFrontendError {
    constructor(componentOrMessage) {
      const message = typeof componentOrMessage === 'string' ? componentOrMessage : formatErrorMessage(componentOrMessage, `Root element (\`$root\`) already initialised`);
      super(message);
      this.name = 'InitError';
    }
  }
  /**
   * @typedef {import('../common/index.mjs').ComponentWithModuleName} ComponentWithModuleName
   */

  class GOVUKFrontendComponent {
    /**
     * Returns the root element of the component
     *
     * @protected
     * @returns {RootElementType} - the root element of component
     */
    get $root() {
      return this._$root;
    }
    constructor($root) {
      this._$root = void 0;
      const childConstructor = this.constructor;
      if (typeof childConstructor.moduleName !== 'string') {
        throw new InitError(`\`moduleName\` not defined in component`);
      }
      if (!($root instanceof childConstructor.elementType)) {
        throw new ElementError({
          element: $root,
          component: childConstructor,
          identifier: 'Root element (`$root`)',
          expectedType: childConstructor.elementType.name
        });
      } else {
        this._$root = $root;
      }
      childConstructor.checkSupport();
      this.checkInitialised();
      const moduleName = childConstructor.moduleName;
      this.$root.setAttribute(`data-${moduleName}-init`, '');
    }
    checkInitialised() {
      const constructor = this.constructor;
      const moduleName = constructor.moduleName;
      if (moduleName && isInitialised(this.$root, moduleName)) {
        throw new InitError(constructor);
      }
    }
    static checkSupport() {
      if (!isSupported()) {
        throw new SupportError();
      }
    }
  }

  /**
   * @typedef ChildClass
   * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
   */

  /**
   * @typedef {typeof GOVUKFrontendComponent & ChildClass} ChildClassConstructor
   */
  GOVUKFrontendComponent.elementType = HTMLElement;

  /**
   * Tabs component
   *
   * @preserve
   */
  class Tabs extends GOVUKFrontendComponent {
    /**
     * @param {Element | null} $root - HTML element to use for tabs
     */
    constructor($root) {
      super($root);
      this.$tabs = void 0;
      this.$tabList = void 0;
      this.$tabListItems = void 0;
      this.jsHiddenClass = 'govuk-tabs__panel--hidden';
      this.changingHash = false;
      this.boundTabClick = void 0;
      this.boundTabKeydown = void 0;
      this.boundOnHashChange = void 0;
      this.mql = null;
      const $tabs = this.$root.querySelectorAll('a.govuk-tabs__tab');
      if (!$tabs.length) {
        throw new ElementError({
          component: Tabs,
          identifier: 'Links (`<a class="govuk-tabs__tab">`)'
        });
      }
      this.$tabs = $tabs;
      this.boundTabClick = this.onTabClick.bind(this);
      this.boundTabKeydown = this.onTabKeydown.bind(this);
      this.boundOnHashChange = this.onHashChange.bind(this);
      const $tabList = this.$root.querySelector('.govuk-tabs__list');
      const $tabListItems = this.$root.querySelectorAll('li.govuk-tabs__list-item');
      if (!$tabList) {
        throw new ElementError({
          component: Tabs,
          identifier: 'List (`<ul class="govuk-tabs__list">`)'
        });
      }
      if (!$tabListItems.length) {
        throw new ElementError({
          component: Tabs,
          identifier: 'List items (`<li class="govuk-tabs__list-item">`)'
        });
      }
      this.$tabList = $tabList;
      this.$tabListItems = $tabListItems;
      this.setupResponsiveChecks();
    }
    setupResponsiveChecks() {
      const breakpoint = getBreakpoint('tablet');
      if (!breakpoint.value) {
        throw new ElementError({
          component: Tabs,
          identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
        });
      }
      this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
      if ('addEventListener' in this.mql) {
        this.mql.addEventListener('change', () => this.checkMode());
      } else {
        this.mql.addListener(() => this.checkMode());
      }
      this.checkMode();
    }
    checkMode() {
      var _this$mql;
      if ((_this$mql = this.mql) != null && _this$mql.matches) {
        this.setup();
      } else {
        this.teardown();
      }
    }
    setup() {
      var _this$getTab;
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
      const $activeTab = (_this$getTab = this.getTab(window.location.hash)) != null ? _this$getTab : this.$tabs[0];
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
      return this.$root.querySelector(`a.govuk-tabs__tab[href="${hash}"]`);
    }
    setAttributes($tab) {
      const panelId = getFragmentFromUrl($tab.href);
      if (!panelId) {
        return;
      }
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
      window.location.hash = panelId;
      $panel.id = panelId;
    }
    onTabKeydown(event) {
      switch (event.key) {
        case 'ArrowLeft':
        case 'Left':
          this.activatePreviousTab();
          event.preventDefault();
          break;
        case 'ArrowRight':
        case 'Right':
          this.activateNextTab();
          event.preventDefault();
          break;
      }
    }
    activateNextTab() {
      const $currentTab = this.getCurrentTab();
      if (!($currentTab != null && $currentTab.parentElement)) {
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
      if (!($currentTab != null && $currentTab.parentElement)) {
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
      const panelId = getFragmentFromUrl($tab.href);
      if (!panelId) {
        return null;
      }
      return this.$root.querySelector(`#${panelId}`);
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
      return this.$root.querySelector('.govuk-tabs__list-item--selected a.govuk-tabs__tab');
    }
  }
  Tabs.moduleName = 'govuk-tabs';

  exports.Tabs = Tabs;

}));
//# sourceMappingURL=tabs.bundle.js.map
