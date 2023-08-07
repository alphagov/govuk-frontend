import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'

/**
 * Skip link component
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
   *
   * @param {Element} $module - HTML element to use for skip link
   */
  constructor($module) {
    super()

    if (!($module instanceof HTMLAnchorElement)) {
      return this
    }

    this.$module = $module

    // Check for linked element
    const $linkedElement = this.getLinkedElement()
    if (!$linkedElement) {
      return
    }

    this.$linkedElement = $linkedElement
    this.$module.addEventListener('click', () => this.focusLinkedElement())
  }

  /**
   * Get linked element
   *
   * @private
   * @returns {HTMLElement | null} $linkedElement - DOM element linked to from the skip link
   */
  getLinkedElement() {
    const linkedElementId = this.getFragmentFromUrl()
    if (!linkedElementId) {
      return null
    }

    return document.getElementById(linkedElementId)
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
   * Extract the fragment (everything after the hash symbol) from a URL, but not including
   * the symbol.
   *
   * @private
   * @returns {string | undefined} Fragment from URL, without the hash symbol
   */
  getFragmentFromUrl() {
    // Bail if the anchor link doesn't have a hash
    if (!this.$module.hash) {
      return
    }

    return this.$module.hash.split('#').pop()
  }
}
