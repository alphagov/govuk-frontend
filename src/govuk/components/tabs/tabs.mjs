/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

import { nodeListForEach } from '../../common/index.mjs'
import '../../vendor/polyfills/Element/prototype/classList.mjs'
import '../../vendor/polyfills/Element/prototype/nextElementSibling.mjs'
import '../../vendor/polyfills/Element/prototype/previousElementSibling.mjs'
import '../../vendor/polyfills/Event.mjs' // addEventListener, event.target normalization and DOMContentLoaded
import '../../vendor/polyfills/Function/prototype/bind.mjs'

/**
 * Tabs component
 *
 * @class
 * @param {HTMLElement} $module - HTML element to use for tabs
 */
function Tabs ($module) {
  this.$module = $module
  this.$tabs = $module.querySelectorAll('.govuk-tabs__tab')

  this.keys = { left: 37, right: 39, up: 38, down: 40 }
  this.jsHiddenClass = 'govuk-tabs__panel--hidden'
}

/**
 * Initialise component
 */
Tabs.prototype.init = function () {
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks()
  } else {
    this.setup()
  }
}

/**
 * Setup viewport resize check
 */
Tabs.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: 40.0625em)')
  this.mql.addListener(this.checkMode.bind(this))
  this.checkMode()
}

/**
 * Setup or teardown handler for viewport resize check
 */
Tabs.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.setup()
  } else {
    this.teardown()
  }
}

/**
 * Setup tab component
 */
Tabs.prototype.setup = function () {
  var $module = this.$module
  var $tabs = this.$tabs
  var $tabList = $module.querySelector('.govuk-tabs__list')
  var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item')

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.setAttribute('role', 'tablist')

  nodeListForEach($tabListItems, function ($item) {
    $item.setAttribute('role', 'presentation')
  })

  nodeListForEach($tabs, function ($tab) {
    // Set HTML attributes
    this.setAttributes($tab)

    // Save bounded functions to use when removing event listeners during teardown
    $tab.boundTabClick = this.onTabClick.bind(this)
    $tab.boundTabKeydown = this.onTabKeydown.bind(this)

    // Handle events
    $tab.addEventListener('click', $tab.boundTabClick, true)
    $tab.addEventListener('keydown', $tab.boundTabKeydown, true)

    // Remove old active panels
    this.hideTab($tab)
  }.bind(this))

  // Show either the active tab according to the URL's hash or the first tab
  var $activeTab = this.getTab(window.location.hash) || this.$tabs[0]
  this.showTab($activeTab)

  // Handle hashchange events
  $module.boundOnHashChange = this.onHashChange.bind(this)
  window.addEventListener('hashchange', $module.boundOnHashChange, true)
}

/**
 * Teardown tab component
 */
Tabs.prototype.teardown = function () {
  var $module = this.$module
  var $tabs = this.$tabs
  var $tabList = $module.querySelector('.govuk-tabs__list')
  var $tabListItems = $module.querySelectorAll('.govuk-tabs__list-item')

  if (!$tabs || !$tabList || !$tabListItems) {
    return
  }

  $tabList.removeAttribute('role')

  nodeListForEach($tabListItems, function ($item) {
    $item.removeAttribute('role', 'presentation')
  })

  nodeListForEach($tabs, function ($tab) {
    // Remove events
    $tab.removeEventListener('click', $tab.boundTabClick, true)
    $tab.removeEventListener('keydown', $tab.boundTabKeydown, true)

    // Unset HTML attributes
    this.unsetAttributes($tab)
  }.bind(this))

  // Remove hashchange event handler
  window.removeEventListener('hashchange', $module.boundOnHashChange, true)
}

/**
 * Handle hashchange event
 *
 * @param {HashChangeEvent} event - Hash change event
 * @returns {void | undefined} Returns void, or undefined when prevented
 */
Tabs.prototype.onHashChange = function (event) {
  var hash = window.location.hash
  var $tabWithHash = this.getTab(hash)
  if (!$tabWithHash) {
    return
  }

  // Prevent changing the hash
  if (this.changingHash) {
    this.changingHash = false
    return
  }

  // Show either the active tab according to the URL's hash or the first tab
  var $previousTab = this.getCurrentTab()

  this.hideTab($previousTab)
  this.showTab($tabWithHash)
  $tabWithHash.focus()
}

/**
 * Hide panel for tab link
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.hideTab = function ($tab) {
  this.unhighlightTab($tab)
  this.hidePanel($tab)
}

/**
 * Show panel for tab link
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.showTab = function ($tab) {
  this.highlightTab($tab)
  this.showPanel($tab)
}

/**
 * Get tab link by hash
 *
 * @param {string} hash - Hash fragment including #
 * @returns {HTMLAnchorElement | null} Tab link
 */
Tabs.prototype.getTab = function (hash) {
  return this.$module.querySelector('.govuk-tabs__tab[href="' + hash + '"]')
}

/**
 * Set tab link and panel attributes
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.setAttributes = function ($tab) {
  // set tab attributes
  var panelId = this.getHref($tab).slice(1)
  $tab.setAttribute('id', 'tab_' + panelId)
  $tab.setAttribute('role', 'tab')
  $tab.setAttribute('aria-controls', panelId)
  $tab.setAttribute('aria-selected', 'false')
  $tab.setAttribute('tabindex', '-1')

  // set panel attributes
  var $panel = this.getPanel($tab)
  $panel.setAttribute('role', 'tabpanel')
  $panel.setAttribute('aria-labelledby', $tab.id)
  $panel.classList.add(this.jsHiddenClass)
}

/**
 * Unset tab link and panel attributes
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.unsetAttributes = function ($tab) {
  // unset tab attributes
  $tab.removeAttribute('id')
  $tab.removeAttribute('role')
  $tab.removeAttribute('aria-controls')
  $tab.removeAttribute('aria-selected')
  $tab.removeAttribute('tabindex')

  // unset panel attributes
  var $panel = this.getPanel($tab)
  $panel.removeAttribute('role')
  $panel.removeAttribute('aria-labelledby')
  $panel.classList.remove(this.jsHiddenClass)
}

/**
 * Handle tab link clicks
 *
 * @param {MouseEvent} event - Mouse click event
 * @returns {void | false} Returns void, or false within tab link
 */
Tabs.prototype.onTabClick = function (event) {
  if (!event.target.classList.contains('govuk-tabs__tab')) {
    // Allow events on child DOM elements to bubble up to tab parent
    return false
  }
  event.preventDefault()
  var $newTab = event.target
  var $currentTab = this.getCurrentTab()
  this.hideTab($currentTab)
  this.showTab($newTab)
  this.createHistoryEntry($newTab)
}

/**
 * Update browser URL hash fragment for tab
 *
 * - Allows back/forward to navigate tabs
 * - Avoids page jump when hash changes
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.createHistoryEntry = function ($tab) {
  var $panel = this.getPanel($tab)

  // Save and restore the id
  // so the page doesn't jump when a user clicks a tab (which changes the hash)
  var panelId = $panel.id
  $panel.id = ''
  this.changingHash = true
  window.location.hash = this.getHref($tab).slice(1)
  $panel.id = panelId
}

/**
 * Handle tab keydown event
 *
 * - Press right/down arrow for next tab
 * - Press left/up arrow for previous tab
 *
 * @param {KeyboardEvent} event - Keydown event
 */
Tabs.prototype.onTabKeydown = function (event) {
  switch (event.keyCode) {
    case this.keys.left:
    case this.keys.up:
      this.activatePreviousTab()
      event.preventDefault()
      break
    case this.keys.right:
    case this.keys.down:
      this.activateNextTab()
      event.preventDefault()
      break
  }
}

/**
 * Activate next tab
 */
Tabs.prototype.activateNextTab = function () {
  var $currentTab = this.getCurrentTab()
  if (!$currentTab) {
    return
  }

  var $nextTabListItem = $currentTab.parentElement.nextElementSibling
  if (!$nextTabListItem) {
    return
  }

  var $nextTab = $nextTabListItem.querySelector('.govuk-tabs__tab')
  if ($nextTab) {
    this.hideTab($currentTab)
    this.showTab($nextTab)
    $nextTab.focus()
    this.createHistoryEntry($nextTab)
  }
}

/**
 * Activate previous tab
 */
Tabs.prototype.activatePreviousTab = function () {
  var $currentTab = this.getCurrentTab()
  if (!$currentTab) {
    return
  }

  var $previousTabListItem = $currentTab.parentElement.previousElementSibling
  if (!$previousTabListItem) {
    return
  }

  var $previousTab = $previousTabListItem.querySelector('.govuk-tabs__tab')
  if ($previousTab) {
    this.hideTab($currentTab)
    this.showTab($previousTab)
    $previousTab.focus()
    this.createHistoryEntry($previousTab)
  }
}

/**
 * Get tab panel for tab link
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 * @returns {HTMLDivElement} Tab panel
 */
Tabs.prototype.getPanel = function ($tab) {
  var $panel = this.$module.querySelector(this.getHref($tab))
  return $panel
}

/**
 * Show tab panel for tab link
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.showPanel = function ($tab) {
  var $panel = this.getPanel($tab)
  $panel.classList.remove(this.jsHiddenClass)
}

/**
 * Hide tab panel for tab link
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.hidePanel = function ($tab) {
  var $panel = this.getPanel($tab)
  $panel.classList.add(this.jsHiddenClass)
}

/**
 * Unset 'selected' state for tab link
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.unhighlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'false')
  $tab.parentNode.classList.remove('govuk-tabs__list-item--selected')
  $tab.setAttribute('tabindex', '-1')
}

/**
 * Set 'selected' state for tab link
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 */
Tabs.prototype.highlightTab = function ($tab) {
  $tab.setAttribute('aria-selected', 'true')
  $tab.parentNode.classList.add('govuk-tabs__list-item--selected')
  $tab.setAttribute('tabindex', '0')
}

/**
 * Get current tab link
 *
 * @returns {HTMLAnchorElement | undefined} Tab link
 */
Tabs.prototype.getCurrentTab = function () {
  return this.$module.querySelector('.govuk-tabs__list-item--selected .govuk-tabs__tab')
}

/**
 * Get link hash fragment for href attribute
 *
 * this is because IE doesn't always return the actual value but a relative full path
 * should be a utility function most prob
 * {@link http://labs.thesedays.com/blog/2010/01/08/getting-the-href-value-with-jquery-in-ie/}
 *
 * @param {HTMLAnchorElement} $tab - Tab link
 * @returns {string} Hash fragment including #
 */
Tabs.prototype.getHref = function ($tab) {
  var href = $tab.getAttribute('href')
  var hash = href.slice(href.indexOf('#'), href.length)
  return hash
}

export default Tabs
