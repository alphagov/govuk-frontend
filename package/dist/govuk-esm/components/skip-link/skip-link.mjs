import '../../vendor/polyfills/Element/prototype/classList.mjs';
import '../../vendor/polyfills/Event.mjs';
import '../../vendor/polyfills/Function/prototype/bind.mjs';

/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

/**
 * Skip link component
 *
 * @class
 * @param {Element} $module - HTML element to use for skip link
 */
function SkipLink ($module) {
  if (!($module instanceof HTMLAnchorElement)) {
    return this
  }

  /** @deprecated Will be made private in v5.0 */
  this.$module = $module;

  /** @deprecated Will be made private in v5.0 */
  this.$linkedElement = null;

  /** @deprecated Will be made private in v5.0 */
  this.linkedElementListener = false;
}

/**
 * Initialise component
 */
SkipLink.prototype.init = function () {
  // Check that required elements are present
  if (!this.$module) {
    return
  }

  // Check for linked element
  var $linkedElement = this.getLinkedElement();
  if (!$linkedElement) {
    return
  }

  this.$linkedElement = $linkedElement;
  this.$module.addEventListener('click', this.focusLinkedElement.bind(this));
};

/**
 * Get linked element
 *
 * @deprecated Will be made private in v5.0
 * @returns {HTMLElement | null} $linkedElement - DOM element linked to from the skip link
 */
SkipLink.prototype.getLinkedElement = function () {
  var linkedElementId = this.getFragmentFromUrl();
  if (!linkedElementId) {
    return null
  }

  return document.getElementById(linkedElementId)
};

/**
 * Focus the linked element
 *
 * Set tabindex and helper CSS class. Set listener to remove them on blur.
 *
 * @deprecated Will be made private in v5.0
 */
SkipLink.prototype.focusLinkedElement = function () {
  var $linkedElement = this.$linkedElement;

  if (!$linkedElement.getAttribute('tabindex')) {
    // Set the element tabindex to -1 so it can be focused with JavaScript.
    $linkedElement.setAttribute('tabindex', '-1');
    $linkedElement.classList.add('govuk-skip-link-focused-element');

    // Add listener for blur on the focused element (unless the listener has previously been added)
    if (!this.linkedElementListener) {
      this.$linkedElement.addEventListener('blur', this.removeFocusProperties.bind(this));
      this.linkedElementListener = true;
    }
  }

  $linkedElement.focus();
};

/**
 * Remove the tabindex that makes the linked element focusable because the element only needs to be
 * focusable until it has received programmatic focus and a screen reader has announced it.
 *
 * Remove the CSS class that removes the native focus styles.
 *
 * @deprecated Will be made private in v5.0
 */
SkipLink.prototype.removeFocusProperties = function () {
  this.$linkedElement.removeAttribute('tabindex');
  this.$linkedElement.classList.remove('govuk-skip-link-focused-element');
};

/**
 * Get fragment from URL
 *
 * Extract the fragment (everything after the hash symbol) from a URL, but not including
 * the symbol.
 *
 * @deprecated Will be made private in v5.0
 * @returns {string | undefined} Fragment from URL, without the hash symbol
 */
SkipLink.prototype.getFragmentFromUrl = function () {
  // Bail if the anchor link doesn't have a hash
  if (!this.$module.hash) {
    return
  }

  return this.$module.hash.split('#').pop()
};

export default SkipLink;
//# sourceMappingURL=components/skip-link/skip-link.mjs.map
