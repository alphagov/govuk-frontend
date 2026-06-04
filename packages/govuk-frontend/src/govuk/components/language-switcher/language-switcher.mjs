import { getBreakpoint } from '../../common/index.mjs'
import { Component } from '../../component.mjs'
import { ElementError } from '../../errors/index.mjs'

/**
 * Language Switcher component
 *
 * @preserve
 */
export class LanguageSwitcher extends Component {
  /** @private */
  controlledMenus = []

  /**
   * @private
   * @type {MediaQueryList | null}
   */
  mql = null

  /**
   * @param {Element | null} $root - HTML element to use for language switcher
   */
  constructor($root) {
    super($root)

    const $menuButton = this.$root.querySelector(
      '.govuk-js-language-switcher-toggle'
    )

    if (!$menuButton) {
      return this
    }

    const menuId = $menuButton.getAttribute('aria-controls')

    if (!menuId) {
      throw new ElementError({
        component: LanguageSwitcher,
        identifier:
          'Language switcher button (`<button class="govuk-js-language-switcher-toggle">`) attribute (`aria-controls`)'
      })
    }

    const $menu = document.getElementById(menuId)

    if (!$menu) {
      throw new ElementError({
        component: LanguageSwitcher,
        element: $menu,
        identifier: `Language switcher list (\`<ul id="${menuId}">\`)`
      })
    }

    this.controlledMenus = [
      {
        $menu,
        $menuButton,
        menuIsOpen: false
      }
    ]

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
        component: LanguageSwitcher,
        identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
      })
    }

    this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`)

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
   * @param controlledMenu
   * @private
   */
  handleMenuButtonClick(controlledMenu) {
    controlledMenu.menuIsOpen = !controlledMenu.menuIsOpen
    this.checkMode()
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-language-switcher'
}

const attributesForHidingButton = {
  hidden: '',
  'aria-hidden': 'true'
}

/**
 * @param {Element} $element - The element to set attributes on
 * @param {{[attributeName: string]: string}} attributes - The attributes to set
 */
function setAttributes($element, attributes) {
  for (const attributeName in attributes) {
    $element.setAttribute(attributeName, attributes[attributeName])
  }
}

/**
 * @param {Element} $element - The element to remove attributes from
 * @param {string[]} attributeNames - The names of attributes to remove
 */
function removeAttributes($element, attributeNames) {
  for (const attributeName of attributeNames) {
    $element.removeAttribute(attributeName)
  }
}
