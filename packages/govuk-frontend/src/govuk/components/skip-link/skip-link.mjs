import { ElementError, MissingElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Skip link component
 *
 * @preserve
 */
export class SkipLink extends GOVUKFrontendComponent {
  /** @private */
  $module

  /**
   * @private
   * @type {HTMLElement | null}
   */
  $linkedElement = null

  /** @private */
  linkedElementListener = false

  /**
   * @param {Element} $module - HTML element to use for skip link
   * @throws {MissingElementError} If the element with the specified ID is not found
   */
  constructor($module) {
    super()

    if (!($module instanceof HTMLAnchorElement)) {
      throw new ElementError($module, {
        componentName: 'Skip link',
        identifier: '$module',
        expectedType: window.HTMLAnchorElement
      })
    }

    this.$module = $module

    // Check for linked element
    try {
      const $linkedElement = this.getLinkedElement()
      this.$linkedElement = $linkedElement
    } catch (error) {
      throw new MissingElementError(
        `Skip link: ${
          error instanceof Error ? error.message : 'Linked element not found'
        }`
      )
    }

    this.$module.addEventListener('click', () => this.focusLinkedElement())
  }

  /**
   * Get linked element
   *
   * @private
   * @throws {Error} If the "href" attribute does not contain a hash
   * @throws {TypeError} If the element with the specified ID is not found
   * @returns {HTMLElement} $linkedElement - DOM element linked to from the skip link
   */
  getLinkedElement() {
    const linkedElementId = this.getFragmentFromUrl(this.$module.hash)
    if (!linkedElementId) {
      throw new Error(`$module "href" attribute does not contain a hash`)
    }

    const linkedElement = document.getElementById(linkedElementId)

    if (!linkedElement) {
      throw new TypeError(
        `Linked element selector "#${linkedElementId}" not found`
      )
    }

    return linkedElement
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
