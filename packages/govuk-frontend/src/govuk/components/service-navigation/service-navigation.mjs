import { closestAttributeValue } from '../../common/closest-attribute-value.mjs'
import { ConfigurableComponent } from '../../common/configuration.mjs'
import { getBreakpoint } from '../../common/index.mjs'
import { ElementError } from '../../errors/index.mjs'
import { I18n } from '../../i18n.mjs'

/**
 * Service Navigation component
 *
 * @preserve
 * @augments ConfigurableComponent<ServiceNavigationConfig>
 */
export class ServiceNavigation extends ConfigurableComponent {
  /** @private */
  $menuButton

  /** @private */
  $menu

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

    // The only job of this component is to collapse the navigation on mobile
    // so if asked not to, we can skip initialisation altogether
    if (!this.config.collapseOnMobile) {
      return
    }

    // First let's check we do have a navigation to collapse
    const $menu = this.$root.querySelector('.govuk-js-service-navigation-menu')

    if (!$menu) {
      throw new ElementError({
        component: ServiceNavigation,
        identifier:
          'Navigation menu (`<ul class="govuk-js-service-navigation-menu">`)'
      })
    }

    if (!$menu.id) {
      throw new ElementError({
        component: ServiceNavigation,
        identifier:
          'Navigation menu (`<ul class="govuk-js-service-navigation-menu">`) attribute (`id`)'
      })
    }

    this.i18n = new I18n(this.config.i18n, {
      // Read the fallback if necessary rather than have it set in the defaults
      locale: closestAttributeValue(this.$root, 'lang')
    })

    const $menuButton = createMenuButton({
      menuId: $menu.id,
      text: this.i18n.t('menuText'),
      ariaLabel: this.i18n.t('menuAriaLabel')
    })
    $menu.insertAdjacentElement('beforebegin', $menuButton)

    this.$menu = $menu
    this.$menuButton = $menuButton

    this.setupResponsiveChecks()

    this.$menuButton.addEventListener('click', () => {
      this.expanded = !this.expanded
    })
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
    if (!this.mql || !this.$menu || !this.$menuButton) {
      return
    }

    if (this.mql.matches) {
      this.$menu.removeAttribute('hidden')
      setAttributes(this.$menuButton, attributesForHidingButton)
    } else {
      removeAttributes(this.$menuButton, Object.keys(attributesForHidingButton))

      if (this.expanded) {
        this.$menu.removeAttribute('hidden')
      } else {
        this.$menu.setAttribute('hidden', '')
      }
    }
  }

  /**
   * @returns {boolean} Whether the menu is expanded or not
   */
  get expanded() {
    return this.$menuButton?.getAttribute('aria-expanded') === 'true'
  }

  /**
   * @param {boolean} value -
   */
  set expanded(value) {
    this.$menuButton?.setAttribute('aria-expanded', value.toString())
    this.checkMode()
  }

  /**
   * @type {ServiceNavigationConfig}
   */
  static defaults = {
    collapseOnMobile: true,
    i18n: {
      menuText: 'Menu',
      menuAriaLabel: undefined
    }
  }

  /**
   * @constant
   * @satisfies {Schema<ServiceNavigationConfig>}
   */
  static schema = Object.freeze({
    properties: {
      i18n: { type: 'object' },
      collapseOnMobile: { type: 'boolean' }
    }
  })

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-service-navigation'
}

/**
 * Creates the `<button>` element controlling the menu visibility
 *
 * @param {{menuId: string, text: string, ariaLabel?: string}} options - Options for rendering the button
 * @returns {HTMLButtonElement} The menu button
 */
function createMenuButton({ menuId, text, ariaLabel }) {
  const $button = document.createElement('button')
  $button.classList.add('govuk-service-navigation__toggle')
  $button.type = 'button'
  $button.textContent = text
  if (ariaLabel) {
    $button.setAttribute('aria-label', ariaLabel)
  }
  $button.setAttribute('aria-controls', menuId)
  $button.setAttribute('aria-expanded', 'false')

  return $button
}

/**
 * Collection of attributes that needs setting on a `<button>`
 * to fully hide it, both visually and from screen-readers,
 * and prevent its activation while hidden
 */
const attributesForHidingButton = {
  hidden: '',
  // Prevent activating the button with JavaScript APIs while hidden
  disabled: '',
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

/**
 * @typedef ServiceNavigationConfig
 * @property {boolean} [collapseOnMobile=true] - Whether to collapse the navigation on mobile
 * @property {ServiceNavigationTranslations} [i18n] - Service Navigation translation
 */

/**
 * @see {@link ServiceNavigation.defaults.i18n}
 * @typedef {object} ServiceNavigationTranslations
 * @property {string} menuText - Visible text displayed on the menu
 * @property {string} [menuAriaLabel] - Optional text for the `aria-label` attribute of the menu
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 */
