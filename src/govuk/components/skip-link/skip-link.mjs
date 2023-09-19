import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Skip link component
 *
 * @preserve
 */
export class SkipLink extends GOVUKFrontendComponent {
  /** @private */
  $module

  /** @private */
  $linkedElement

  /** @private */
  linkedElementListener = false

  /**
   * @param {Element} $module - HTML element to use for skip link
   * @throws {ElementError} when $module is not set or the wrong type
   * @throws {ElementError} when $module.hash does not contain a hash
   * @throws {ElementError} when the linked element is missing or the wrong type
   */
  constructor($module) {
    super()

    if (!($module instanceof HTMLAnchorElement)) {
      throw new ElementError($module, {
        componentName: 'Skip link',
        identifier: '$module',
        expectedType: HTMLAnchorElement
      })
    }

    this.$module = $module
    this.$linkedElement = this.getLinkedElement()

    this.$module.addEventListener('click', () => this.focusLinkedElement())
  }

  /**
   * Get linked element
   *
   * @private
   * @returns {HTMLElement} $linkedElement - DOM element linked to from the skip link
   */
  getLinkedElement() {
    const linkedElementId = this.getFragmentFromUrl(this.$module.hash)

    // Check for link hash fragment
    if (!linkedElementId) {
      throw new ElementError(this.$module, {
        componentName: 'Skip link',
        identifier: '$module.hash',
        expectedType: 'string'
      })
    }

    const $linkedElement = document.getElementById(linkedElementId)

    // Check for link target element
    if (!($linkedElement instanceof HTMLElement)) {
      throw new ElementError($linkedElement, {
        componentName: 'Skip link',
        identifier: `$module.hash target #${linkedElementId}`
      })
    }

    return $linkedElement
  }

  /**
   * Focus the linked element
   *
   * Set tabindex and helper CSS class. Set listener to remove them on blur.
   *
   * @private
   */
  focusLinkedElement() {
    if (!this.$linkedElement.getAttribute('tabindex')) {
      // Set the element tabindex to -1 so it can be focused with JavaScript.
      this.$linkedElement.setAttribute('tabindex', '-1')
      this.$linkedElement.classList.add('govuk-skip-link-focused-element')

      // Add listener for blur on the focused element (unless the listener has previously been added)
      if (!this.linkedElementListener) {
        this.$linkedElement.addEventListener('blur', () =>
          this.removeFocusProperties()
        )
        this.linkedElementListener = true
      }
    }

    this.$linkedElement.focus()
  }

  /**
   * Remove the tabindex that makes the linked element focusable because the element only needs to be
   * focusable until it has received programmatic focus and a screen reader has announced it.
   *
   * Remove the CSS class that removes the native focus styles.
   *
   * @private
   */
  removeFocusProperties() {
    this.$linkedElement.removeAttribute('tabindex')
    this.$linkedElement.classList.remove('govuk-skip-link-focused-element')
  }

  /**
   * Get fragment from URL
   *
   * Extract the fragment (everything after the hash) from a URL, but not including
   * the hash.
   *
   * @private
   * @param {string} url - URL
   * @returns {string | undefined} Fragment from URL, without the hash
   */
  getFragmentFromUrl(url) {
    if (url.indexOf('#') === -1) {
      return undefined
    }

    return url.split('#').pop()
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-skip-link'
}
