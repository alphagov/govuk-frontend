import { getBreakpoint } from '../../common/index.mjs'
import { Component } from '../../component.mjs'
import { ElementError } from '../../errors/index.mjs'

/**
 * Service Navigation component
 *
 * @preserve
 */
export class ServiceNavigation extends Component {
  /** @private */
  controlledMenus = []

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
   * @param {Element | null} $root - HTML element to use for header
   */
  constructor($root) {
    super($root)

    const $menuButtons = this.$root.querySelectorAll(
      '.govuk-js-service-navigation-toggle'
    )

    // Headers don't necessarily have a navigation. When they don't, the menu
    // toggle won't be rendered by our macro (or may be omitted when writing
    // plain HTML)
    if ($menuButtons.length === 0) {
      return this
    }

    this.controlledMenus = Array.from($menuButtons).map(($menuButton) => {
      const menuId = $menuButton.getAttribute('aria-controls')

      if (!menuId) {
        throw new ElementError({
          component: ServiceNavigation,
          identifier:
            'Navigation button (`<button class="govuk-js-service-navigation-toggle">`) attribute (`aria-controls`)'
        })
      }

      const $menu = document.getElementById(menuId)

      if (!$menu) {
        throw new ElementError({
          component: ServiceNavigation,
          element: $menu,
          identifier: `Navigation (\`<ul id="${menuId}">\`)`
        })
      }

      return {
        $menu,
        $menuButton,
        menuIsOpen: false
      }
    })

    this.setupResponsiveChecks()

    for (const controlledMenu of this.controlledMenus) {
      controlledMenu.$menuButton.addEventListener('click', () =>
        this.handleMenuButtonClick(controlledMenu)
      )
    }
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
        component: ServiceNavigation,
        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
      })
    }

    // Media query list for GOV.UK Frontend desktop breakpoint
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
   * Sync menu state
   *
   * Uses the global variable menuIsOpen to correctly set the accessible and
   * visual states of the menu and the menu button.
   * Additionally will force the menu to be visible and the menu button to be
   * hidden if the matchMedia is triggered to desktop.
   *
   * @private
   */
  checkMode() {
    if (!this.mql) {
      return
    }

    for (const controlledMenu of this.controlledMenus) {
      if (this.mql.matches) {
        controlledMenu.$menu.removeAttribute('hidden')
        setAttributes(controlledMenu.$menuButton, attributesForHidingButton)
      } else {
        removeAttributes(
          controlledMenu.$menuButton,
          Object.keys(attributesForHidingButton)
        )
        controlledMenu.$menuButton.setAttribute(
          'aria-expanded',
          controlledMenu.menuIsOpen.toString()
        )

        if (controlledMenu.menuIsOpen) {
          controlledMenu.$menu.removeAttribute('hidden')
        } else {
          controlledMenu.$menu.setAttribute('hidden', '')
        }
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
  handleMenuButtonClick(controlledMenu) {
    controlledMenu.menuIsOpen = !controlledMenu.menuIsOpen
    this.checkMode()
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-service-navigation'
}

/**
 * Collection of attributes that needs setting on a `<button>`
 * to fully hide it, both visually and from screen-readers,
 * and prevent its activation while hidden
 */
const attributesForHidingButton = {
  hidden: '',
  // Fix button still appearing in VoiceOver's form control's menu despite being hidden
  // https://bugs.webkit.org/show_bug.cgi?id=300899
  'aria-hidden': 'true'
}

/**
 * Sets a group of attributes on the given element
 *
 * @param {Element} $element - The element to set the attribute on
 * @param {{[attributeName: string]: string}} attributes - The attributes to set
 */
function setAttributes($element, attributes) {
  for (const attributeName in attributes) {
    $element.setAttribute(attributeName, attributes[attributeName])
  }
}

/**
 * Removes a list of attributes from the given element
 *
 * @param {Element} $element - The element to remove the attributes from
 * @param {string[]} attributeNames - The names of the attributes to remove
 */
function removeAttributes($element, attributeNames) {
  for (const attributeName of attributeNames) {
    $element.removeAttribute(attributeName)
  }
}
