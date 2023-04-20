import { nodeListForEach } from '../../common/index.mjs';
import '../../vendor/polyfills/Element/prototype/classList.mjs';
import '../../vendor/polyfills/Event.mjs';
import '../../vendor/polyfills/Function/prototype/bind.mjs';

/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

/**
 * Checkboxes component
 *
 * @class
 * @param {Element} $module - HTML element to use for checkboxes
 */
function Checkboxes ($module) {
  if (!($module instanceof HTMLElement)) {
    return this
  }

  var $inputs = $module.querySelectorAll('input[type="checkbox"]');
  if (!$inputs.length) {
    return this
  }

  /** @deprecated Will be made private in v5.0 */
  this.$module = $module;

  /** @deprecated Will be made private in v5.0 */
  this.$inputs = $inputs;
}

/**
 * Initialise component
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
  // Check that required elements are present
  if (!this.$module || !this.$inputs) {
    return
  }

  var $module = this.$module;
  var $inputs = this.$inputs;

  nodeListForEach($inputs, function ($input) {
    var targetId = $input.getAttribute('data-aria-controls');

    // Skip checkboxes without data-aria-controls attributes, or where the
    // target element does not exist.
    if (!targetId || !document.getElementById(targetId)) {
      return
    }

    // Promote the data-aria-controls attribute to a aria-controls attribute
    // so that the relationship is exposed in the AOM
    $input.setAttribute('aria-controls', targetId);
    $input.removeAttribute('data-aria-controls');
  });

  // When the page is restored after navigating 'back' in some browsers the
  // state of form controls is not restored until *after* the DOMContentLoaded
  // event is fired, so we need to sync after the pageshow event in browsers
  // that support it.
  window.addEventListener(
    'onpageshow' in window ? 'pageshow' : 'DOMContentLoaded',
    this.syncAllConditionalReveals.bind(this)
  );

  // Although we've set up handlers to sync state on the pageshow or
  // DOMContentLoaded event, init could be called after those events have fired,
  // for example if they are added to the page dynamically, so sync now too.
  this.syncAllConditionalReveals();

  // Handle events
  $module.addEventListener('click', this.handleClick.bind(this));
};

/**
 * Sync the conditional reveal states for all checkboxes in this $module.
 *
 * @deprecated Will be made private in v5.0
 */
Checkboxes.prototype.syncAllConditionalReveals = function () {
  nodeListForEach(this.$inputs, this.syncConditionalRevealWithInputState.bind(this));
};

/**
 * Sync conditional reveal with the input state
 *
 * Synchronise the visibility of the conditional reveal, and its accessible
 * state, with the input's checked state.
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLInputElement} $input - Checkbox input
 */
Checkboxes.prototype.syncConditionalRevealWithInputState = function ($input) {
  var targetId = $input.getAttribute('aria-controls');
  if (!targetId) {
    return
  }

  var $target = document.getElementById(targetId);
  if ($target && $target.classList.contains('govuk-checkboxes__conditional')) {
    var inputIsChecked = $input.checked;

    $input.setAttribute('aria-expanded', inputIsChecked.toString());
    $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
  }
};

/**
 * Uncheck other checkboxes
 *
 * Find any other checkbox inputs with the same name value, and uncheck them.
 * This is useful for when a “None of these" checkbox is checked.
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLInputElement} $input - Checkbox input
 */
Checkboxes.prototype.unCheckAllInputsExcept = function ($input) {
  var $component = this;

  /** @type {NodeListOf<HTMLInputElement>} */
  // @ts-expect-error `NodeListOf<HTMLInputElement>` type expected
  var allInputsWithSameName = document.querySelectorAll(
    'input[type="checkbox"][name="' + $input.name + '"]'
  );

  nodeListForEach(allInputsWithSameName, function ($inputWithSameName) {
    var hasSameFormOwner = ($input.form === $inputWithSameName.form);
    if (hasSameFormOwner && $inputWithSameName !== $input) {
      $inputWithSameName.checked = false;
      $component.syncConditionalRevealWithInputState($inputWithSameName);
    }
  });
};

/**
 * Uncheck exclusive checkboxes
 *
 * Find any checkbox inputs with the same name value and the 'exclusive' behaviour,
 * and uncheck them. This helps prevent someone checking both a regular checkbox and a
 * "None of these" checkbox in the same fieldset.
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLInputElement} $input - Checkbox input
 */
Checkboxes.prototype.unCheckExclusiveInputs = function ($input) {
  var $component = this;

  /** @type {NodeListOf<HTMLInputElement>} */
  // @ts-expect-error `NodeListOf<HTMLInputElement>` type expected
  var allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(
    'input[data-behaviour="exclusive"][type="checkbox"][name="' + $input.name + '"]'
  );

  nodeListForEach(allInputsWithSameNameAndExclusiveBehaviour, function ($exclusiveInput) {
    var hasSameFormOwner = ($input.form === $exclusiveInput.form);
    if (hasSameFormOwner) {
      $exclusiveInput.checked = false;
      $component.syncConditionalRevealWithInputState($exclusiveInput);
    }
  });
};

/**
 * Click event handler
 *
 * Handle a click within the $module – if the click occurred on a checkbox, sync
 * the state of any associated conditional reveal with the checkbox state.
 *
 * @deprecated Will be made private in v5.0
 * @param {MouseEvent} event - Click event
 */
Checkboxes.prototype.handleClick = function (event) {
  var $clickedInput = event.target;

  // Ignore clicks on things that aren't checkbox inputs
  if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'checkbox') {
    return
  }

  // If the checkbox conditionally-reveals some content, sync the state
  var hasAriaControls = $clickedInput.getAttribute('aria-controls');
  if (hasAriaControls) {
    this.syncConditionalRevealWithInputState($clickedInput);
  }

  // No further behaviour needed for unchecking
  if (!$clickedInput.checked) {
    return
  }

  // Handle 'exclusive' checkbox behaviour (ie "None of these")
  var hasBehaviourExclusive = ($clickedInput.getAttribute('data-behaviour') === 'exclusive');
  if (hasBehaviourExclusive) {
    this.unCheckAllInputsExcept($clickedInput);
  } else {
    this.unCheckExclusiveInputs($clickedInput);
  }
};

export default Checkboxes;
//# sourceMappingURL=components/checkboxes/checkboxes.mjs.map
