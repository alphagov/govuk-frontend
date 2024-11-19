import { getBreakpoint, getFragmentFromUrl } from '../../common/index.mjs'
import { Component } from '../../component.mjs'
import { ElementError } from '../../errors/index.mjs'

/**
 * Tabs component
 *
 * @preserve
 */
export class Tabs extends Component {
  /** @private */
  $tabs

  /** @private */
  $tabList

  /** @private */
  $tabListItems

  /** @private */
  jsHiddenClass = 'govuk-tabs__panel--hidden'

  /** @private */
  changingHash = false

  /** @private */
  boundTabClick

  /** @private */
  boundTabKeydown

  /** @private */
  boundOnHashChange

  /**
   * @private
   * @type {MediaQueryList | null}
   */
  mql = null

  /**
   * @param {Element | null} $root - HTML element to use for tabs
   */
  constructor($root) {
    super($root)

    const $tabs = this.$root.querySelectorAll('a.govuk-tabs__tab')
    if (!$tabs.length) {
      throw new ElementError({
        component: Tabs,
        identifier: 'Links (`<a class="govuk-tabs__tab">`)'
      })
    }

    this.$tabs = $tabs

    // Save bound functions so we can remove event listeners during teardown
    this.boundTabClick = this.onTabClick.bind(this)
    this.boundTabKeydown = this.onTabKeydown.bind(this)
    this.boundOnHashChange = this.onHashChange.bind(this)

    const $tabList = this.$root.querySelector('.govuk-tabs__list')
    const $tabListItems = this.$root.querySelectorAll(
      'li.govuk-tabs__list-item'
    )

    if (!$tabList) {
      throw new ElementError({
        component: Tabs,
        identifier: 'List (`<ul class="govuk-tabs__list">`)'
      })
    }

    if (!$tabListItems.length) {
      throw new ElementError({
        component: Tabs,
        identifier: 'List items (`<li class="govuk-tabs__list-item">`)'
      })
    }

    this.$tabList = $tabList
    this.$tabListItems = $tabListItems

    this.setupResponsiveChecks()
  }

  /**
   * Setup viewport resize check
   *
   * @private
   */
  setupResponsiveChecks() {
    const breakpoint = getBreakpoint('tablet')

    if (!breakpoint.value) {
      throw new ElementError({
        component: Tabs,
        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
      })
    }

    // Media query list for GOV.UK Frontend tablet breakpoint
    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`)

    // MediaQueryList.addEventListener isn't supported by Safari < 14 so we need
    // to be able to fall back to the deprecated MediaQueryList.addListener
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => this.checkMode())
    } else {
      // @ts-expect-error Property 'addListener' does not exist
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.mql.addListener(() => this.checkMode())
    }

    this.checkMode()
  }

  /**
   * Setup or teardown handler for viewport resize check
   *
   * @private
   */
  checkMode() {
    if (this.mql?.matches) {
      this.setup()
    } else {
      this.teardown()
    }
  }

  /**
   * Setup tab component
   *
   * @private
   */
  setup() {
    this.$tabList.setAttribute('role', 'tablist')

    this.$tabListItems.forEach(($item) => {
      $item.setAttribute('role', 'presentation')
    })

    this.$tabs.forEach(($tab) => {
      // Set HTML attributes
      this.setAttributes($tab)

      // Handle events
      $tab.addEventListener('click', this.boundTabClick, true)
      $tab.addEventListener('keydown', this.boundTabKeydown, true)

      // Remove old active panels
      this.hideTab($tab)
    })

    // Show either the active tab according to the URL's hash or the first tab
    const $activeTab = this.getTab(window.location.hash) ?? this.$tabs[0]

    this.showTab($activeTab)

    // Handle hashchange events
    window.addEventListener('hashchange', this.boundOnHashChange, true)
  }

  /**
   * Teardown tab component
   *
   * @private
   */
  teardown() {
    this.$tabList.removeAttribute('role')

    this.$tabListItems.forEach(($item) => {
      $item.removeAttribute('role')
    })

    this.$tabs.forEach(($tab) => {
      // Remove events
      $tab.removeEventListener('click', this.boundTabClick, true)
      $tab.removeEventListener('keydown', this.boundTabKeydown, true)

      // Unset HTML attributes
      this.unsetAttributes($tab)
    })

    // Remove hashchange event handler
    window.removeEventListener('hashchange', this.boundOnHashChange, true)
  }

  /**
   * Handle hashchange event
   *
   * @private
   * @returns {void | undefined} Returns void, or undefined when prevented
   */
  onHashChange() {
    const hash = window.location.hash
    const $tabWithHash = this.getTab(hash)
    if (!$tabWithHash) {
      return
    }

    // Prevent changing the hash
    if (this.changingHash) {
      this.changingHash = false
      return
    }

    // Show either the active tab according to the URL's hash or the first tab
    const $previousTab = this.getCurrentTab()
    if (!$previousTab) {
      return
    }

    this.hideTab($previousTab)
    this.showTab($tabWithHash)
    $tabWithHash.focus()
  }

  /**
   * Hide panel for tab link
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   */
  hideTab($tab) {
    this.unhighlightTab($tab)
    this.hidePanel($tab)
  }

  /**
   * Show panel for tab link
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   */
  showTab($tab) {
    this.highlightTab($tab)
    this.showPanel($tab)
  }

  /**
   * Get tab link by hash
   *
   * @private
   * @param {string} hash - Hash fragment including #
   * @returns {HTMLAnchorElement | null} Tab link
   */
  getTab(hash) {
    return this.$root.querySelector(`a.govuk-tabs__tab[href="${hash}"]`)
  }

  /**
   * Set tab link and panel attributes
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   */
  setAttributes($tab) {
    const panelId = getFragmentFromUrl($tab.href)
    if (!panelId) {
      return
    }

    // Set tab attributes
    $tab.setAttribute('id', `tab_${panelId}`)
    $tab.setAttribute('role', 'tab')
    $tab.setAttribute('aria-controls', panelId)
    $tab.setAttribute('aria-selected', 'false')
    $tab.setAttribute('tabindex', '-1')

    // Set panel attributes
    const $panel = this.getPanel($tab)
    if (!$panel) {
      return
    }

    $panel.setAttribute('role', 'tabpanel')
    $panel.setAttribute('aria-labelledby', $tab.id)
    $panel.classList.add(this.jsHiddenClass)
  }

  /**
   * Unset tab link and panel attributes
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   */
  unsetAttributes($tab) {
    // unset tab attributes
    $tab.removeAttribute('id')
    $tab.removeAttribute('role')
    $tab.removeAttribute('aria-controls')
    $tab.removeAttribute('aria-selected')
    $tab.removeAttribute('tabindex')

    // unset panel attributes
    const $panel = this.getPanel($tab)
    if (!$panel) {
      return
    }

    $panel.removeAttribute('role')
    $panel.removeAttribute('aria-labelledby')
    $panel.classList.remove(this.jsHiddenClass)
  }

  /**
   * Handle tab link clicks
   *
   * @private
   * @param {MouseEvent} event - Mouse click event
   * @returns {void} Returns void
   */
  onTabClick(event) {
    const $currentTab = this.getCurrentTab()
    const $nextTab = event.currentTarget

    if (!$currentTab || !($nextTab instanceof HTMLAnchorElement)) {
      return
    }

    event.preventDefault()

    this.hideTab($currentTab)
    this.showTab($nextTab)
    this.createHistoryEntry($nextTab)
  }

  /**
   * Update browser URL hash fragment for tab
   *
   * - Allows back/forward to navigate tabs
   * - Avoids page jump when hash changes
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   */
  createHistoryEntry($tab) {
    const $panel = this.getPanel($tab)
    if (!$panel) {
      return
    }

    // Save and restore the id so the page doesn't jump when a user clicks a tab
    // (which changes the hash)
    const panelId = $panel.id
    $panel.id = ''
    this.changingHash = true
    window.location.hash = panelId
    $panel.id = panelId
  }

  /**
   * Handle tab keydown event
   *
   * - Press right arrow for next tab
   * - Press left arrow for previous tab
   *
   * @private
   * @param {KeyboardEvent} event - Keydown event
   */
  onTabKeydown(event) {
    switch (event.key) {
      // 'Left' and 'Right' required for Edge 16 support.
      case 'ArrowLeft':
      case 'Left':
        this.activatePreviousTab()
        event.preventDefault()
        break
      case 'ArrowRight':
      case 'Right':
        this.activateNextTab()
        event.preventDefault()
        break
    }
  }

  /**
   * Activate next tab
   *
   * @private
   */
  activateNextTab() {
    const $currentTab = this.getCurrentTab()
    if (!$currentTab?.parentElement) {
      return
    }

    const $nextTabListItem = $currentTab.parentElement.nextElementSibling
    if (!$nextTabListItem) {
      return
    }

    const $nextTab = $nextTabListItem.querySelector('a.govuk-tabs__tab')
    if (!$nextTab) {
      return
    }

    this.hideTab($currentTab)
    this.showTab($nextTab)
    $nextTab.focus()
    this.createHistoryEntry($nextTab)
  }

  /**
   * Activate previous tab
   *
   * @private
   */
  activatePreviousTab() {
    const $currentTab = this.getCurrentTab()
    if (!$currentTab?.parentElement) {
      return
    }

    const $previousTabListItem =
      $currentTab.parentElement.previousElementSibling
    if (!$previousTabListItem) {
      return
    }

    const $previousTab = $previousTabListItem.querySelector('a.govuk-tabs__tab')
    if (!$previousTab) {
      return
    }

    this.hideTab($currentTab)
    this.showTab($previousTab)
    $previousTab.focus()
    this.createHistoryEntry($previousTab)
  }

  /**
   * Get tab panel for tab link
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   * @returns {Element | null} Tab panel
   */
  getPanel($tab) {
    const panelId = getFragmentFromUrl($tab.href)
    if (!panelId) {
      return null
    }

    return this.$root.querySelector(`#${panelId}`)
  }

  /**
   * Show tab panel for tab link
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   */
  showPanel($tab) {
    const $panel = this.getPanel($tab)
    if (!$panel) {
      return
    }

    $panel.classList.remove(this.jsHiddenClass)
  }

  /**
   * Hide tab panel for tab link
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   */
  hidePanel($tab) {
    const $panel = this.getPanel($tab)
    if (!$panel) {
      return
    }

    $panel.classList.add(this.jsHiddenClass)
  }

  /**
   * Unset 'selected' state for tab link
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   */
  unhighlightTab($tab) {
    if (!$tab.parentElement) {
      return
    }

    $tab.setAttribute('aria-selected', 'false')
    $tab.parentElement.classList.remove('govuk-tabs__list-item--selected')
    $tab.setAttribute('tabindex', '-1')
  }

  /**
   * Set 'selected' state for tab link
   *
   * @private
   * @param {HTMLAnchorElement} $tab - Tab link
   */
  highlightTab($tab) {
    if (!$tab.parentElement) {
      return
    }

    $tab.setAttribute('aria-selected', 'true')
    $tab.parentElement.classList.add('govuk-tabs__list-item--selected')
    $tab.setAttribute('tabindex', '0')
  }

  /**
   * Get current tab link
   *
   * @private
   * @returns {HTMLAnchorElement | null} Tab link
   */
  getCurrentTab() {
    return this.$root.querySelector(
      '.govuk-tabs__list-item--selected a.govuk-tabs__tab'
    )
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-tabs'
}
