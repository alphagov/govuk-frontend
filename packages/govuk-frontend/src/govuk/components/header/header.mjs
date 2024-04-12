import { getBreakpoint } from '../../common/index.mjs'
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
  $oneLoginMenuButton

  /** @private */
  $menu

  /** @private */
  $oneLoginMenu

  /** @private */
  $serviceNavigationDropdowns

  /**
   * Save the opened/closed state for the nav in memory so that we can
   * accurately maintain state when the screen is changed from small to big and
   * back to small
   *
   * @private
   */
  menuIsOpen = false
  oneLoginMenuIsOpen = false

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

    const $menuButton = $module.querySelector('.govuk-js-service-menu-toggle')
    const $oneLoginMenuButton = $module.querySelector(
      '.govuk-js-one-login-toggle'
    )
    const $serviceNavigationDropdowns = $module.querySelectorAll(
      '.govuk-service-header__navigation-item--has-children'
    )

    // Headers don't necessarily have a navigation. When they don't, the menu
    // toggle won't be rendered by our macro (or may be omitted when writing
    // plain HTML)
    if (!$menuButton && !$oneLoginMenuButton) {
      return this
    }

    if ($menuButton) {
      const menuId = $menuButton.getAttribute('aria-controls')
      if (!menuId) {
        throw new ElementError({
          componentName: 'Header',
          identifier:
            'Menu button (`<button class="govuk-js-service-menu-toggle">`) attribute (`aria-controls`)'
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

      this.$menuButton.addEventListener('click', () =>
        this.handleMenuButtonClick()
      )
    }

    if ($oneLoginMenuButton) {
      const menuId = $oneLoginMenuButton.getAttribute('aria-controls')
      if (!menuId) {
        throw new ElementError({
          componentName: 'Header',
          identifier:
            'One Login menu button (`<button class="govuk-js-one-login-toggle">`) attribute (`aria-controls`)'
        })
      }

      const $oneLoginMenu = document.getElementById(menuId)
      if (!$oneLoginMenu) {
        throw new ElementError({
          componentName: 'Header',
          element: $oneLoginMenu,
          identifier: `Navigation (\`<ul id="${menuId}">\`)`
        })
      }

      this.$oneLoginMenu = $oneLoginMenu
      this.$oneLoginMenuButton = $oneLoginMenuButton

      this.$oneLoginMenuButton.addEventListener('click', () =>
        this.handleOneLoginMenuButtonClick()
      )
    }

    // Hacky spikey spike code
    if ($serviceNavigationDropdowns.length) {
      $serviceNavigationDropdowns.forEach(($container) => {
        const $toolboxToggle = $container.querySelector(
          '.govuk-service-header__link'
        )
        const $toolboxList = $container.querySelector(
          '.govuk-service-header__navigation-list'
        )

        $toolboxToggle?.setAttribute('aria-expanded', 'false')

        $toolboxToggle?.addEventListener('click', (event) => {
          event.preventDefault()
          this.handleToolboxClick($toolboxToggle, $toolboxList)
        })
      })

      this.$serviceNavigationDropdowns = $serviceNavigationDropdowns
    }

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
        componentName: 'Header',
        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
      })
    }

    // Media query list for GOV.UK Frontend desktop breakpoint
    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`)

    // MediaQueryList.addEventListener isn't supported by Safari < 14 so we need
    // to be able to fall back to the deprecated MediaQueryList.addListener
    if ('addEventListener' in this.mql) {
      this.mql.addEventListener('change', () => {
        this.checkMode()
        this.checkOneLoginMode()
      })
    } else {
      // @ts-expect-error Property 'addListener' does not exist
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.mql.addListener(() => {
        this.checkMode()
        this.checkOneLoginMode()
      })
    }

    this.checkMode()
    this.checkOneLoginMode()
  }

  /**
   * @private
   */
  checkMode() {
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
   * Sync menu state
   *
   * Uses the global variable menuIsOpen to correctly set the accessible and
   * visual states of the menu and the menu button.
   * Additionally will force the menu to be visible and the menu button to be
   * hidden if the matchMedia is triggered to desktop.
   *
   * @private
   */
  checkOneLoginMode() {
    if (!this.mql || !this.$oneLoginMenu || !this.$oneLoginMenuButton) {
      return
    }

    if (this.mql.matches) {
      this.$oneLoginMenu.removeAttribute('hidden')
      this.$oneLoginMenuButton.setAttribute('hidden', '')
    } else {
      this.$oneLoginMenuButton.removeAttribute('hidden')
      this.$oneLoginMenuButton.setAttribute(
        'aria-expanded',
        this.oneLoginMenuIsOpen.toString()
      )

      if (this.oneLoginMenuIsOpen) {
        this.$oneLoginMenu.removeAttribute('hidden')
      } else {
        this.$oneLoginMenu.setAttribute('hidden', '')
      }
    }
  }

  /**
   * @private
   */
  handleMenuButtonClick() {
    this.menuIsOpen = !this.menuIsOpen
    this.checkMode()
  }

  /**
   * Handle menu button click
   *
   * When the menu button is clicked, change the visibility of the menu and then
   * sync the accessibility state and menu button state
   *
   * @private
   */
  handleOneLoginMenuButtonClick() {
    this.oneLoginMenuIsOpen = !this.oneLoginMenuIsOpen
    this.checkOneLoginMode()
  }

  /**
   * @param {Element} $header - the clicked toolbox heading
   * @param {Element | null} $content - the toolbox contents
   * @private
   */
  handleToolboxClick($header, $content) {
    const isExpanded = $header.getAttribute('aria-expanded') === 'true'
    this.closeAllToolboxes()

    if (!isExpanded) {
      this.openToolbox($header, $content)
    }
  }

  /**
   * @param {Element | null} $header - the clicked toolbox heading
   * @param {Element | null} $content - the toolbox contents
   * @private
   */
  openToolbox($header, $content) {
    $header?.setAttribute('aria-expanded', 'true')
    $content?.removeAttribute('hidden')
  }

  /**
   * @param {Element | null} $header - the clicked toolbox heading
   * @param {Element | null} $content - the toolbox contents
   * @private
   */
  closeToolbox($header, $content) {
    $header?.setAttribute('aria-expanded', 'false')
    $content?.setAttribute('hidden', '')
  }

  /**
   * @private
   */
  closeAllToolboxes() {
    if (!this.$serviceNavigationDropdowns) {
      return
    }

    this.$serviceNavigationDropdowns.forEach(($container) => {
      const $toolboxToggle = $container.querySelector(
        '.govuk-service-header__link'
      )
      const $toolboxList = $container.querySelector(
        '.govuk-service-header__navigation-list'
      )

      this.closeToolbox($toolboxToggle, $toolboxList)
    })
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-header'
}
