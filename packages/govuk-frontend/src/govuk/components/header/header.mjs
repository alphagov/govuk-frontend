/**
 * Header component
 */
export class Header {
  /** @private */
  $module

  /** @private */
  $menuButton

  /** @private */
  $menu

  /**
   * Save the opened/closed state for the nav in memory so that we can
   * accurately maintain state when the screen is changed from small to
   * big and back to small
   *
   * @private
   */
  menuIsOpen = false

  /**
   * A global const for storing a matchMedia instance which we'll use to
   * detect when a screen size change happens. We set this later during the
   * init function and rely on it being null if the feature isn't available
   * to initially apply hidden attributes
   *
   * @private
   * @type {MediaQueryList | null}
   */
  mql = null

  /**
   * @param {Element} $module - HTML element to use for header
   */
  constructor ($module) {
    if (!($module instanceof HTMLElement) || !document.body.classList.contains('govuk-frontend-supported')) {
      return this
    }

    this.$module = $module
    this.$menuButton = $module.querySelector('.govuk-js-header-toggle')
    this.$menu = this.$menuButton && $module.querySelector(
      `#${this.$menuButton.getAttribute('aria-controls')}`
    )
  }

  /**
   * Initialise component
   *
   * Check for the presence of the header, menu and menu button – if any are
   * missing then there's nothing to do so return early.
   * Apply a matchMedia for desktop which will trigger a state sync if the browser
   * viewport moves between states.
   *
   * @returns {Promise<Header>} Header component
   */
  async init () {
    // Check that required elements are present
    if (!this.$module || !this.$menuButton || !this.$menu) {
      throw new Error("Component 'Header' is missing '$module', '$menuButton' or '$menu' fields")
    }

    // Set the matchMedia to the govuk-frontend desktop breakpoint
    this.mql = window.matchMedia('(min-width: 48.0625em)')

    // MediaQueryList.addEventListener isn't supported by Safari < 14 so we need
    // to be able to fall back to the deprecated MediaQueryList.addListener
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => this.syncState())
    } else {
      // @ts-expect-error Property 'addListener' does not exist
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.mql.addListener(() => this.syncState())
    }

    this.syncState()
    this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick())

    return Promise.resolve(this)
  }

  /**
   * Sync menu state
   *
   * Uses the global variable menuIsOpen to correctly set the accessible and
   * visual states of the menu and the menu button.
   * Additionally will force the menu to be visible and the menu button to be
   * hidden if the matchMedia is triggered to desktop.
   *
   * @private
   */
  syncState () {
    if (this.mql.matches) {
      this.$menu.removeAttribute('hidden')
      this.$menuButton.setAttribute('hidden', '')
    } else {
      this.$menuButton.removeAttribute('hidden')
      this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString())

      if (this.menuIsOpen) {
        this.$menu.removeAttribute('hidden')
      } else {
        this.$menu.setAttribute('hidden', '')
      }
    }
  }

  /**
   * Handle menu button click
   *
   * When the menu button is clicked, change the visibility of the menu and then
   * sync the accessibility state and menu button state
   *
   * @private
   */
  handleMenuButtonClick () {
    this.menuIsOpen = !this.menuIsOpen
    this.syncState()
  }
}
