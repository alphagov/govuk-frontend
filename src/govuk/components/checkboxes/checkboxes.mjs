import '../../vendor/polyfills/Function/prototype/bind.mjs'
// addEventListener, event.target normalization and DOMContentLoaded
import '../../vendor/polyfills/Event.mjs'
import '../../vendor/polyfills/Element/prototype/classList.mjs'
import { nodeListForEach } from '../../common.mjs'

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
    if (!target || !document.getElementById(target)) {
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
  var $target = document.getElementById($input.getAttribute('aria-controls'))

  if ($target && $target.classList.contains('govuk-checkboxes__conditional')) {
    var inputIsChecked = $input.checked

    $input.setAttribute('aria-expanded', inputIsChecked)
    $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked)
  }
}

/**
 * Uncheck other checkboxes
 *
 * Find any other checkbox inputs with the same name value, and uncheck them.
 * This is useful for when a “None of these" checkbox is checked.
 */
Checkboxes.prototype.unCheckAllInputsExcept = function ($input) {
  var allInputsWithSameName = document.querySelectorAll('input[type="checkbox"][name="' + $input.name + '"]')

  nodeListForEach(allInputsWithSameName, function ($inputWithSameName) {
    var hasSameFormOwner = ($input.form === $inputWithSameName.form)
    if (hasSameFormOwner && $inputWithSameName !== $input) {
      $inputWithSameName.checked = false
      this.syncConditionalRevealWithInputState($inputWithSameName)
    }
  }.bind(this))
}

/**
 * Uncheck exclusive inputs
 *
 * Find any checkbox inputs with the same name value and the 'exclusive' behaviour,
 * and uncheck them. This helps prevent someone checking both a regular checkbox and a
 * "None of these" checkbox in the same fieldset.
 */
Checkboxes.prototype.unCheckExclusiveInputs = function ($input) {
  var allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(
    'input[data-behaviour="exclusive"][type="checkbox"][name="' + $input.name + '"]'
  )

  nodeListForEach(allInputsWithSameNameAndExclusiveBehaviour, function ($exclusiveInput) {
    var hasSameFormOwner = ($input.form === $exclusiveInput.form)
    if (hasSameFormOwner) {
      $exclusiveInput.checked = false
      this.syncConditionalRevealWithInputState($exclusiveInput)
    }
  }.bind(this))
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

  // Ignore clicks on things that aren't checkbox inputs
  if ($target.type !== 'checkbox') {
    return
  }

  // If the checkbox conditionally-reveals some content, sync the state
  var hasAriaControls = $target.getAttribute('aria-controls')
  if (hasAriaControls) {
    this.syncConditionalRevealWithInputState($target)
  }

  // No further behaviour needed for unchecking
  if (!$target.checked) {
    return
  }

  // Handle 'exclusive' checkbox behaviour (ie "None of these")
  var hasBehaviourExclusive = ($target.getAttribute('data-behaviour') === 'exclusive')
  if (hasBehaviourExclusive) {
    this.unCheckAllInputsExcept($target)
  } else {
    this.unCheckExclusiveInputs($target)
  }
}

export default Checkboxes
