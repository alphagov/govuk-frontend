import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Element/prototype/classList'
import '../../vendor/polyfills/Event' // addEventListener and event.target normalization

function SkipLink ($module) {
  this.$module = $module
}

/**
 * Initialise the component
 */
SkipLink.prototype.init = function () {
  var $module = this.$module
  // Check for module
  if (!$module) {
    return
  }

  $module.addEventListener('click', this.handleClick.bind(this))
}

/**
* Click event handler
*
* @param {MouseEvent} event - Click event
*/
SkipLink.prototype.handleClick = function (event) {
  var target = event.target

  if (this.focusLinkedElement(target)) {
    event.preventDefault()
  }
}

/**
 * Focus the linked element
 *
 * @param {HTMLElement} $target - Event target
 * @returns {boolean} True if the linked element was able to be focussed
 */
SkipLink.prototype.focusLinkedElement = function ($target) {
  // If the element that was clicked does not have a href, return early
  if ($target.href === false) {
    return false
  }

  var linkedElementId = this.getFragmentFromUrl($target.href)
  var $linkedElement = document.getElementById(linkedElementId)
  if (!$linkedElement) {
    return false
  }

  if (!$linkedElement.getAttribute('tabindex')) {
    // Set the content tabindex to -1 so it can be focused with JavaScript.
    $linkedElement.setAttribute('tabindex', '-1')
    $linkedElement.classList.add('govuk-skip-link-focused-element')

    $linkedElement.addEventListener('blur', this.removeFocusProperties.bind(this, $linkedElement))
  }
  $linkedElement.focus()
}

/**
 * Remove the tabindex that makes the linked element focusable because the content only needs to be
 * focusable until it has received programmatic focus and a screen reader has announced it.
 *
 * Remove the CSS class that removes the native focus styles.
 *
 * @param {HTMLElement} $linkedElement - DOM element linked to from the skip link
 */
SkipLink.prototype.removeFocusProperties = function ($linkedElement) {
  $linkedElement.removeAttribute('tabindex')
  $linkedElement.classList.remove('govuk-skip-link-focused-element')
}

/**
 * Get fragment from URL
 *
 * Extract the fragment (everything after the hash) from a URL, but not including
 * the hash.
 *
 * @param {string} url - URL
 * @returns {string} Fragment from URL, without the hash
 */
SkipLink.prototype.getFragmentFromUrl = function (url) {
  if (url.indexOf('#') === -1) {
    return false
  }

  return url.split('#').pop()
}

export default SkipLink
