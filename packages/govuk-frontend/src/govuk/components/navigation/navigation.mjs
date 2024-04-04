/* eslint-disable */
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'
import { ElementError } from '../../errors/index.mjs'

/**
 * Website navigation
 */
export class Navigation extends GOVUKFrontendComponent {
  /**
   * Class constructor
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

    const $nav = $module

    $nav.$menuButton = $nav.querySelector('.js-x-header-toggle')

    $nav.$menu =
      $nav.$menuButton &&
      $nav.querySelector('#' + $nav.$menuButton.getAttribute('aria-controls'))
    $nav.menuItems = $nav.$menu && $nav.$menu.querySelectorAll('li')
    if (!$nav.$menuButton || !$nav.$menu || $nav.menuItems.length < 2) {
      return
    }

    $nav.classList.add('toggle-enabled')
    $nav.$menuOpenClass = $nav.$menu && $nav.$menu.dataset.openClass
    $nav.$menuButtonOpenClass =
      $nav.$menuButton && $nav.$menuButton.dataset.openClass
    $nav.$menuButtonOpenLabel =
      $nav.$menuButton && $nav.$menuButton.dataset.labelForShow
    $nav.$menuButtonCloseLabel =
      $nav.$menuButton && $nav.$menuButton.dataset.labelForHide
    $nav.$menuButtonOpenText =
      $nav.$menuButton && $nav.$menuButton.dataset.textForShow
    $nav.$menuButtonCloseText =
      $nav.$menuButton && $nav.$menuButton.dataset.textForHide
    $nav.isOpen = false

    $nav.$menuButton.addEventListener(
      'click',
      this.handleMenuButtonClick.bind($nav)
    )
  }

  handleMenuButtonClick() {
    this.isOpen = !this.isOpen
    this.$menuOpenClass &&
      this.$menu.classList.toggle(this.$menuOpenClass, this.isOpen)
    this.$menuButtonOpenClass &&
      this.$menuButton.classList.toggle(this.$menuButtonOpenClass, this.isOpen)
    this.$menuButton.setAttribute('aria-expanded', this.isOpen)
    if (this.$menuButtonCloseLabel && this.$menuButtonOpenLabel) {
      this.$menuButton.setAttribute(
        'aria-label',
        this.isOpen ? this.$menuButtonCloseLabel : this.$menuButtonOpenLabel
      )
    }
    if (this.$menuButtonCloseText && this.$menuButtonOpenText) {
      this.$menuButton.innerHTML = this.isOpen
        ? this.$menuButtonCloseText
        : this.$menuButtonOpenText
    }
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-navigation'
}
