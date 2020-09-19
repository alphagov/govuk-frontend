import '../../vendor/polyfills/Function/prototype/bind'
// addEventListener, event.target normalization and DOMContentLoaded
import '../../vendor/polyfills/Event'
import '../../vendor/polyfills/Element/prototype/classList'
import { nodeListForEach } from '../../common'

function Checkboxes ($module) {
  this.$module = $module
  this.$inputs = $module.querySelectorAll('input[type="checkbox"]')
}

/**
 * Initialise Checkboxes
 *
 * Checkboxes can be associated with a 'conditionally revealed' content block –
 * for example, a checkbox for 'Phone' could reveal an additional form field for
 * the user to enter their phone number.
 *
 * These associations are made using a `data-aria-controls` attribute, which is
 * promoted to an aria-controls attribute during initialisation.
 *
 * We also need to restore the state of any conditional reveals on the page (for
 * example if the user has navigated back), and set up event handlers to keep
 * the reveal in sync with the checkbox state.
 */
Checkboxes.prototype.init = function () {
  var $module = this.$module
  var $inputs = this.$inputs

  nodeListForEach($inputs, function ($input) {
    var target = $input.getAttribute('data-aria-controls')

    // Skip checkboxes without data-aria-controls attributes, or where the
    // target element does not exist.
    if (!target || !$module.querySelector('#' + target)) {
      return
    }

    // Promote the data-aria-controls attribute to a aria-controls attribute
    // so that the relationship is exposed in the AOM
    $input.setAttribute('aria-controls', target)
    $input.removeAttribute('data-aria-controls')
  })

  // When the page is restored after navigating 'back' in some browsers the
  // state of form controls is not restored until *after* the DOMContentLoaded
  // event is fired, so we need to sync after the pageshow event in browsers
  // that support it.
  if ('onpageshow' in window) {
    window.addEventListener('pageshow', this.syncAllConditionalReveals.bind(this))
  } else {
    window.addEventListener('DOMContentLoaded', this.syncAllConditionalReveals.bind(this))
  }

  // Although we've set up handlers to sync state on the pageshow or
  // DOMContentLoaded event, init could be called after those events have fired,
  // for example if they are added to the page dynamically, so sync now too.
  this.syncAllConditionalReveals()

  $module.addEventListener('click', this.handleClick.bind(this))
}

/**
 * Sync the conditional reveal states for all inputs in this $module.
 */
Checkboxes.prototype.syncAllConditionalReveals = function () {
  nodeListForEach(this.$inputs, this.syncConditionalRevealWithInputState.bind(this))
}

/**
 * Sync conditional reveal with the input state
 *
 * Synchronise the visibility of the conditional reveal, and its accessible
 * state, with the input's checked state.
 *
 * @param {HTMLInputElement} $input Checkbox input
 */
Checkboxes.prototype.syncConditionalRevealWithInputState = function ($input) {
  var $target = this.$module.querySelector('#' + $input.getAttribute('aria-controls'))

  if ($target && $target.classList.contains('govuk-checkboxes__conditional')) {
    var inputIsChecked = $input.checked

    $input.setAttribute('aria-expanded', inputIsChecked)
    $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked)
  }
}

/**
 * Click event handler
 *
 * Handle a click within the $module – if the click occurred on a checkbox, sync
 * the state of any associated conditional reveal with the checkbox state.
 *
 * @param {MouseEvent} event Click event
 */
Checkboxes.prototype.handleClick = function (event) {
  var $target = event.target

  // If a checkbox with aria-controls, handle click
  var isCheckbox = $target.getAttribute('type') === 'checkbox'
  var hasAriaControls = $target.getAttribute('aria-controls')
  if (isCheckbox && hasAriaControls) {
    this.syncConditionalRevealWithInputState($target)
  }
}

export default Checkboxes
