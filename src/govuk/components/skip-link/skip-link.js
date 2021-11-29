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

  if (this.focusTarget(target)) {
    event.preventDefault()
  }
}

/**
 * Focus the target element
 *
 * @param {HTMLElement} $target - Event target
 * @returns {boolean} True if the target was able to be focussed
 */
SkipLink.prototype.focusTarget = function ($target) {
  // If the element that was clicked does not have a href, return early
  if ($target.href === false) {
    return false
  }

  var contentId = this.getFragmentFromUrl($target.href)
  var $content = document.getElementById(contentId)
  if (!$content) {
    return false
  }

  // Set the content tabindex to -1 so it can be focused with JavaScript.
  $content.setAttribute('tabindex', '-1')
  $content.classList.add('govuk-skip-link-focused-element')

  $content.focus()

  // Remove the tabindex attribute on blur because the content only needs to be focusable until it
  // has received programmatic focus and a screen reader has announced it.
  $content.addEventListener('blur', function () {
    $content.removeAttribute('tabindex')
    $content.classList.remove('govuk-skip-link-focused-element')
  })
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
