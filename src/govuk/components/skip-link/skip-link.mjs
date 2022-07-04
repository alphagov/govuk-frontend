import '../../vendor/polyfills/Function/prototype/bind.mjs'
import '../../vendor/polyfills/Element/prototype/classList.mjs'
import '../../vendor/polyfills/Event.mjs' // addEventListener and event.target normalization

function SkipLink ($module) {
  this.$module = $module
  this.$linkedElement = null
  this.linkedElementListener = false
}

/**
 * Initialise the component
 */
SkipLink.prototype.init = function () {
  // Check for module
  if (!this.$module) {
    return
  }

  // Check for linked element
  this.$linkedElement = this.getLinkedElement()
  if (!this.$linkedElement) {
    return
  }

  this.$module.addEventListener('click', this.focusLinkedElement.bind(this))
}

/**
* Get linked element
*
* @returns {HTMLElement} $linkedElement - DOM element linked to from the skip link
*/
SkipLink.prototype.getLinkedElement = function () {
  var linkedElementId = this.getFragmentFromUrl()

  if (!linkedElementId) {
    return false
  }

  return document.getElementById(linkedElementId)
}

/**
 * Focus the linked element
 *
 * Set tabindex and helper CSS class. Set listener to remove them on blur.
 */
SkipLink.prototype.focusLinkedElement = function () {
  var $linkedElement = this.$linkedElement

  if (!$linkedElement.getAttribute('tabindex')) {
    // Set the element tabindex to -1 so it can be focused with JavaScript.
    $linkedElement.setAttribute('tabindex', '-1')
    $linkedElement.classList.add('govuk-skip-link-focused-element')

    // Add listener for blur on the focused element (unless the listener has previously been added)
    if (!this.linkedElementListener) {
      this.$linkedElement.addEventListener('blur', this.removeFocusProperties.bind(this))
      this.linkedElementListener = true
    }
  }
  $linkedElement.focus()
}

/**
 * Remove the tabindex that makes the linked element focusable because the element only needs to be
 * focusable until it has received programmatic focus and a screen reader has announced it.
 *
 * Remove the CSS class that removes the native focus styles.
 */
SkipLink.prototype.removeFocusProperties = function () {
  this.$linkedElement.removeAttribute('tabindex')
  this.$linkedElement.classList.remove('govuk-skip-link-focused-element')
}

/**
 * Get fragment from URL
 *
 * Extract the fragment (everything after the hash symbol) from a URL, but not including
 * the symbol.
 *
 * @returns {string} Fragment from URL, without the hash symbol
 */
SkipLink.prototype.getFragmentFromUrl = function () {
  // Bail if the anchor link doesn't have a hash
  if (!this.$module.hash) {
    return false
  }

  return this.$module.hash.split('#').pop()
}

export default SkipLink
