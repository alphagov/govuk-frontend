import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener
import '../../vendor/polyfills/Element/prototype/closest'

function ErrorSummary ($module, options) {
  this.$module = $module
  this.options = options || {}
}

ErrorSummary.prototype.init = function () {
  var $module = this.$module
  if (!$module) {
    return
  }
  var autofocus = this.options.autofocus === false ? this.options.autofocus : true

  if (autofocus) {
    window.addEventListener('load', function () {
      $module.focus()
    })
  }

  $module.addEventListener('click', this.handleClick.bind(this))
}

/**
* Click event handler
*
* @param {MouseEvent} event - Click event
*/
ErrorSummary.prototype.handleClick = function (event) {
  var target = event.target
  if (this.focusTarget(target)) {
    event.preventDefault()
  }
}

/**
 * Focus the target element
 *
 * By default, the browser will scroll the target into view. Because our labels
 * or legends appear above the input, this means the user will be presented with
 * an input without any context, as the label or legend will be off the top of
 * the screen.
 *
 * Manually handling the click event, scrolling the question into view and then
 * focussing the element solves this.
 *
 * This also results in the label and/or legend being announced correctly in
 * NVDA (as tested in 2018.3.2) - without this only the field type is announced
 * (e.g. "Edit, has autocomplete").
 *
 * @param {HTMLElement} $target - Event target
 * @returns {boolean} True if the target was able to be focussed
 */
ErrorSummary.prototype.focusTarget = function ($target) {
  // If the element that was clicked was not a link, return early
  if ($target.tagName !== 'A' || $target.href === false) {
    return false
  }

  var inputId = this.getFragmentFromUrl($target.href)
  var $input = document.getElementById(inputId)
  if (!$input) {
    return false
  }

  var $legendOrLabel = this.getAssociatedLegendOrLabel($input)
  if (!$legendOrLabel) {
    return false
  }

  // Prefer using the history API where possible, as updating
  // window.location.hash causes the viewport to jump to the input briefly
  // before then scrolling to the label/legend in IE10, IE11 and Edge (as tested
  // in Edge 17).
  if (window.history.pushState) {
    window.history.pushState(null, null, '#' + inputId)
  } else {
    window.location.hash = inputId
  }

  // Scroll the legend or label into view *before* calling focus on the input to
  // avoid extra scrolling in browsers that don't support `preventScroll` (which
  // at time of writing is most of them...)
  $legendOrLabel.scrollIntoView()
  $input.focus({ preventScroll: true })

  return true
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
ErrorSummary.prototype.getFragmentFromUrl = function (url) {
  if (url.indexOf('#') === -1) {
    return false
  }

  return url.split('#').pop()
}

/**
 * Get associated legend or label
 *
 * Returns the first element that exists from this list:
 *
 * - The `<legend>` associated with the closest `<fieldset>` ancestor
 * - The first `<label>` that is associated with the input using for="inputId"
 * - The closest parent `<label>`
 *
 * @param {HTMLElement} $input - The input
 * @returns {HTMLElement} Associated legend or label, or null if no associated
 *                        legend or label can be found
 */
ErrorSummary.prototype.getAssociatedLegendOrLabel = function ($input) {
  var $fieldset = $input.closest('fieldset')

  if ($fieldset) {
    var legends = $fieldset.getElementsByTagName('legend')

    if (legends.length) {
      return legends[0]
    }
  }

  return document.querySelector("label[for='" + $input.getAttribute('id') + "']") ||
    $input.closest('label')
}

export default ErrorSummary
