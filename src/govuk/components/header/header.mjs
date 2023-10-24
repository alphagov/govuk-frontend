import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Header component
 *
 * @preserve
 */
export class Header extends GOVUKFrontendComponent {
  /** @private */
  $module

  /** @private */
  $menuButton

  /** @private */
  $menu

  /**
   * Save the opened/closed state for the nav in memory so that we can
   * accurately maintain state when the screen is changed from small to big and
   * back to small
   *
   * @private
   */
  menuIsOpen = false

  /**
   * A global const for storing a matchMedia instance which we'll use to detect
   * when a screen size change happens. We rely on it being null if the feature
   * isn't available to initially apply hidden attributes
   *
   * @private
   * @type {MediaQueryList | null}
   */
  mql = null

  /**
   * Apply a matchMedia for desktop which will trigger a state sync if the
   * browser viewport moves between states.
   *
   * @param {Element | null} $module - HTML element to use for header
   */
  constructor($module) {
    super()

    if (!$module) {
      throw new ElementError({
        componentName: 'Header',
        element: $module,
        identifier: 'Root element (`$module`)'
      })
    }

    this.$module = $module
    const $menuButton = $module.querySelector('.govuk-js-header-toggle')

    // Headers don't necessarily have a navigation. When they don't, the menu
    // toggle won't be rendered by our macro (or may be omitted when writing
    // plain HTML)
    if (!$menuButton) {
      return this
    }

    const menuId = $menuButton.getAttribute('aria-controls')
    if (!menuId) {
      throw new ElementError({
        componentName: 'Header',
        identifier:
          'Navigation button (`<button class="govuk-js-header-toggle">`) attribute (`aria-controls`)'
      })
    }

    const $menu = document.getElementById(menuId)
    if (!$menu) {
      throw new ElementError({
        componentName: 'Header',
        element: $menu,
        identifier: `Navigation (\`<ul id="${menuId}">\`)`
      })
    }

    this.$menu = $menu
    this.$menuButton = $menuButton

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
    this.$menuButton.addEventListener('click', () =>
      this.handleMenuButtonClick()
    )
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
  syncState() {
    if (!this.mql || !this.$menu || !this.$menuButton) {
      return
    }

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
  handleMenuButtonClick() {
    this.menuIsOpen = !this.menuIsOpen
    this.syncState()
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-header'
}
