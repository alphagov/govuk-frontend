import { nodeListForEach } from '../../common/index.mjs';
import '../../vendor/polyfills/Element/prototype/classList.mjs';
import '../../vendor/polyfills/Element/prototype/nextElementSibling.mjs';
import '../../vendor/polyfills/Element/prototype/previousElementSibling.mjs';
import '../../vendor/polyfills/Event.mjs';
import '../../vendor/polyfills/Function/prototype/bind.mjs';

/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

/**
 * Tabs component
 *
 * @class
 * @param {Element} $module - HTML element to use for tabs
 */
function Tabs ($module) {
  if (!($module instanceof HTMLElement)) {
    return this
  }

  var $tabs = $module.querySelectorAll('a.govuk-tabs__tab');
  if (!$tabs.length) {
    return this
  }

  /** @deprecated Will be made private in v5.0 */
  this.$module = $module;

  /** @deprecated Will be made private in v5.0 */
  this.$tabs = $tabs;

  /** @deprecated Will be made private in v5.0 */
  this.keys = { left: 37, right: 39, up: 38, down: 40 };

  /** @deprecated Will be made private in v5.0 */
  this.jsHiddenClass = 'govuk-tabs__panel--hidden';

  // Save bounded functions to use when removing event listeners during teardown

  /** @deprecated Will be made private in v5.0 */
  this.boundTabClick = this.onTabClick.bind(this);

  /** @deprecated Will be made private in v5.0 */
  this.boundTabKeydown = this.onTabKeydown.bind(this);

  /** @deprecated Will be made private in v5.0 */
  this.boundOnHashChange = this.onHashChange.bind(this);

  /** @deprecated Will be made private in v5.0 */
  this.changingHash = false;
}

/**
 * Initialise component
 */
Tabs.prototype.init = function () {
  // Check that required elements are present
  if (!this.$module || !this.$tabs) {
    return
  }

  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks();
  } else {
    this.setup();
  }
};

/**
 * Setup viewport resize check
 *
 * @deprecated Will be made private in v5.0
 */
Tabs.prototype.setupResponsiveChecks = function () {
  /** @deprecated Will be made private in v5.0 */
  this.mql = window.matchMedia('(min-width: 40.0625em)');
  this.mql.addListener(this.checkMode.bind(this));
  this.checkMode();
};

/**
 * Setup or teardown handler for viewport resize check
 *
 * @deprecated Will be made private in v5.0
 */
Tabs.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.setup();
  } else {
    this.teardown();
  }
};

/**
 * Setup tab component
 *
 * @deprecated Will be made private in v5.0
 */
Tabs.prototype.setup = function () {
  var $component = this;
  var $module = this.$module;
  var $tabs = this.$tabs;
  var $tabList = $module.querySelector('.govuk-tabs__list');
  var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.setAttribute('role', 'tablist');

  nodeListForEach($tabListItems, function ($item) {
    $item.setAttribute('role', 'presentation');
  });

  nodeListForEach($tabs, function ($tab) {
    // Set HTML attributes
    $component.setAttributes($tab);

    // Handle events
    $tab.addEventListener('click', $component.boundTabClick, true);
    $tab.addEventListener('keydown', $component.boundTabKeydown, true);

    // Remove old active panels
    $component.hideTab($tab);
  });

  // Show either the active tab according to the URL's hash or the first tab
  var $activeTab = this.getTab(window.location.hash) || this.$tabs[0];
  if (!$activeTab) {
    return
  }

  this.showTab($activeTab);

  // Handle hashchange events
  window.addEventListener('hashchange', this.boundOnHashChange, true);
};

/**
 * Teardown tab component
 *
 * @deprecated Will be made private in v5.0
 */
Tabs.prototype.teardown = function () {
  var $component = this;
  var $module = this.$module;
  var $tabs = this.$tabs;
  var $tabList = $module.querySelector('.govuk-tabs__list');
  var $tabListItems = $module.querySelectorAll('a.govuk-tabs__list-item');

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.removeAttribute('role');

  nodeListForEach($tabListItems, function ($item) {
    $item.removeAttribute('role');
  });

  nodeListForEach($tabs, function ($tab) {
    // Remove events
    $tab.removeEventListener('click', $component.boundTabClick, true);
    $tab.removeEventListener('keydown', $component.boundTabKeydown, true);

    // Unset HTML attributes
    $component.unsetAttributes($tab);
  });

  // Remove hashchange event handler
  window.removeEventListener('hashchange', this.boundOnHashChange, true);
};

/**
 * Handle hashchange event
 *
 * @deprecated Will be made private in v5.0
 * @returns {void | undefined} Returns void, or undefined when prevented
 */
Tabs.prototype.onHashChange = function () {
  var hash = window.location.hash;
  var $tabWithHash = this.getTab(hash);
  if (!$tabWithHash) {
    return
  }

  // Prevent changing the hash
  if (this.changingHash) {
    this.changingHash = false;
    return
  }

  // Show either the active tab according to the URL's hash or the first tab
  var $previousTab = this.getCurrentTab();
  if (!$previousTab) {
    return
  }

  this.hideTab($previousTab);
  this.showTab($tabWithHash);
  $tabWithHash.focus();
};

/**
 * Hide panel for tab link
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.hideTab = function ($tab) {
  this.unhighlightTab($tab);
  this.hidePanel($tab);
};

/**
 * Show panel for tab link
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.showTab = function ($tab) {
  this.highlightTab($tab);
  this.showPanel($tab);
};

/**
 * Get tab link by hash
 *
 * @deprecated Will be made private in v5.0
 * @param {string} hash - Hash fragment including #
 * @returns {HTMLAnchorElement | null} Tab link
 */
Tabs.prototype.getTab = function (hash) {
  // @ts-expect-error `HTMLAnchorElement` type expected
  return this.$module.querySelector('a.govuk-tabs__tab[href="' + hash + '"]')
};

/**
 * Set tab link and panel attributes
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.setAttributes = function ($tab) {
  // set tab attributes
  var panelId = this.getHref($tab).slice(1);
  $tab.setAttribute('id', 'tab_' + panelId);
  $tab.setAttribute('role', 'tab');
  $tab.setAttribute('aria-controls', panelId);
  $tab.setAttribute('aria-selected', 'false');
  $tab.setAttribute('tabindex', '-1');

  // set panel attributes
  var $panel = this.getPanel($tab);
  if (!$panel) {
    return
  }

  $panel.setAttribute('role', 'tabpanel');
  $panel.setAttribute('aria-labelledby', $tab.id);
  $panel.classList.add(this.jsHiddenClass);
};

/**
 * Unset tab link and panel attributes
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.unsetAttributes = function ($tab) {
  // unset tab attributes
  $tab.removeAttribute('id');
  $tab.removeAttribute('role');
  $tab.removeAttribute('aria-controls');
  $tab.removeAttribute('aria-selected');
  $tab.removeAttribute('tabindex');

  // unset panel attributes
  var $panel = this.getPanel($tab);
  if (!$panel) {
    return
  }

  $panel.removeAttribute('role');
  $panel.removeAttribute('aria-labelledby');
  $panel.classList.remove(this.jsHiddenClass);
};

/**
 * Handle tab link clicks
 *
 * @deprecated Will be made private in v5.0
 * @param {MouseEvent} event - Mouse click event
 * @returns {void} Returns void
 */
Tabs.prototype.onTabClick = function (event) {
  var $currentTab = this.getCurrentTab();
  var $nextTab = event.currentTarget;

  if (!$currentTab || !($nextTab instanceof HTMLAnchorElement)) {
    return
  }

  event.preventDefault();

  this.hideTab($currentTab);
  this.showTab($nextTab);
  this.createHistoryEntry($nextTab);
};

/**
 * Update browser URL hash fragment for tab
 *
 * - Allows back/forward to navigate tabs
 * - Avoids page jump when hash changes
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.createHistoryEntry = function ($tab) {
  var $panel = this.getPanel($tab);
  if (!$panel) {
    return
  }

  // Save and restore the id
  // so the page doesn't jump when a user clicks a tab (which changes the hash)
  var panelId = $panel.id;
  $panel.id = '';
  this.changingHash = true;
  window.location.hash = this.getHref($tab).slice(1);
  $panel.id = panelId;
};

/**
 * Handle tab keydown event
 *
 * - Press right/down arrow for next tab
 * - Press left/up arrow for previous tab
 *
 * @deprecated Will be made private in v5.0
 * @param {KeyboardEvent} event - Keydown event
 */
Tabs.prototype.onTabKeydown = function (event) {
  switch (event.keyCode) {
    case this.keys.left:
    case this.keys.up:
      this.activatePreviousTab();
      event.preventDefault();
      break
    case this.keys.right:
    case this.keys.down:
      this.activateNextTab();
      event.preventDefault();
      break
  }
};

/**
 * Activate next tab
 *
 * @deprecated Will be made private in v5.0
 */
Tabs.prototype.activateNextTab = function () {
  var $currentTab = this.getCurrentTab();
  if (!$currentTab || !$currentTab.parentElement) {
    return
  }

  var $nextTabListItem = $currentTab.parentElement.nextElementSibling;
  if (!$nextTabListItem) {
    return
  }

  var $nextTab = $nextTabListItem.querySelector('a.govuk-tabs__tab');
  if (!$nextTab) {
    return
  }

  this.hideTab($currentTab);
  this.showTab($nextTab);
  $nextTab.focus();
  this.createHistoryEntry($nextTab);
};

/**
 * Activate previous tab
 *
 * @deprecated Will be made private in v5.0
 */
Tabs.prototype.activatePreviousTab = function () {
  var $currentTab = this.getCurrentTab();
  if (!$currentTab || !$currentTab.parentElement) {
    return
  }

  var $previousTabListItem = $currentTab.parentElement.previousElementSibling;
  if (!$previousTabListItem) {
    return
  }

  var $previousTab = $previousTabListItem.querySelector('a.govuk-tabs__tab');
  if (!$previousTab) {
    return
  }

  this.hideTab($currentTab);
  this.showTab($previousTab);
  $previousTab.focus();
  this.createHistoryEntry($previousTab);
};

/**
 * Get tab panel for tab link
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 * @returns {Element | null} Tab panel
 */
Tabs.prototype.getPanel = function ($tab) {
  return this.$module.querySelector(this.getHref($tab))
};

/**
 * Show tab panel for tab link
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.showPanel = function ($tab) {
  var $panel = this.getPanel($tab);
  if (!$panel) {
    return
  }

  $panel.classList.remove(this.jsHiddenClass);
};

/**
 * Hide tab panel for tab link
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.hidePanel = function ($tab) {
  var $panel = this.getPanel($tab);
  if (!$panel) {
    return
  }

  $panel.classList.add(this.jsHiddenClass);
};

/**
 * Unset 'selected' state for tab link
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.unhighlightTab = function ($tab) {
  if (!$tab.parentElement) {
    return
  }

  $tab.setAttribute('aria-selected', 'false');
  $tab.parentElement.classList.remove('govuk-tabs__list-item--selected');
  $tab.setAttribute('tabindex', '-1');
};

/**
 * Set 'selected' state for tab link
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.highlightTab = function ($tab) {
  if (!$tab.parentElement) {
    return
  }

  $tab.setAttribute('aria-selected', 'true');
  $tab.parentElement.classList.add('govuk-tabs__list-item--selected');
  $tab.setAttribute('tabindex', '0');
};

/**
 * Get current tab link
 *
 * @deprecated Will be made private in v5.0
 * @returns {HTMLAnchorElement | null} Tab link
 */
Tabs.prototype.getCurrentTab = function () {
  return this.$module.querySelector('.govuk-tabs__list-item--selected a.govuk-tabs__tab')
};

/**
 * Get link hash fragment for href attribute
 *
 * this is because IE doesn't always return the actual value but a relative full path
 * should be a utility function most prob
 * {@link http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/}
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLAnchorElement} $tab - Tab link
 * @returns {string} Hash fragment including #
 */
Tabs.prototype.getHref = function ($tab) {
  var href = $tab.getAttribute('href');
  var hash = href.slice(href.indexOf('#'), href.length);
  return hash
};

export default Tabs;
//# sourceMappingURL=components/tabs/tabs.mjs.map
