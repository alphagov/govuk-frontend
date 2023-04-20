import { nodeListForEach } from '../../common/index.mjs';
import '../../vendor/polyfills/Element/prototype/classList.mjs';
import '../../vendor/polyfills/Event.mjs';
import '../../vendor/polyfills/Function/prototype/bind.mjs';

/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

/**
 * Radios component
 *
 * @class
 * @param {Element} $module - HTML element to use for radios
 */
function Radios ($module) {
  if (!($module instanceof HTMLElement)) {
    return this
  }

  var $inputs = $module.querySelectorAll('input[type="radio"]');
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
 * Radios can be associated with a 'conditionally revealed' content block – for
 * example, a radio for 'Phone' could reveal an additional form field for the
 * user to enter their phone number.
 *
 * These associations are made using a `data-aria-controls` attribute, which is
 * promoted to an aria-controls attribute during initialisation.
 *
 * We also need to restore the state of any conditional reveals on the page (for
 * example if the user has navigated back), and set up event handlers to keep
 * the reveal in sync with the radio state.
 */
Radios.prototype.init = function () {
  // Check that required elements are present
  if (!this.$module || !this.$inputs) {
    return
  }

  var $module = this.$module;
  var $inputs = this.$inputs;

  nodeListForEach($inputs, function ($input) {
    var targetId = $input.getAttribute('data-aria-controls');

    // Skip radios without data-aria-controls attributes, or where the
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
 * Sync the conditional reveal states for all radio buttons in this $module.
 *
 * @deprecated Will be made private in v5.0
 */
Radios.prototype.syncAllConditionalReveals = function () {
  nodeListForEach(this.$inputs, this.syncConditionalRevealWithInputState.bind(this));
};

/**
 * Sync conditional reveal with the input state
 *
 * Synchronise the visibility of the conditional reveal, and its accessible
 * state, with the input's checked state.
 *
 * @deprecated Will be made private in v5.0
 * @param {HTMLInputElement} $input - Radio input
 */
Radios.prototype.syncConditionalRevealWithInputState = function ($input) {
  var targetId = $input.getAttribute('aria-controls');
  if (!targetId) {
    return
  }

  var $target = document.getElementById(targetId);
  if ($target && $target.classList.contains('govuk-radios__conditional')) {
    var inputIsChecked = $input.checked;

    $input.setAttribute('aria-expanded', inputIsChecked.toString());
    $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
  }
};

/**
 * Click event handler
 *
 * Handle a click within the $module – if the click occurred on a radio, sync
 * the state of the conditional reveal for all radio buttons in the same form
 * with the same name (because checking one radio could have un-checked a radio
 * in another $module)
 *
 * @deprecated Will be made private in v5.0
 * @param {MouseEvent} event - Click event
 */
Radios.prototype.handleClick = function (event) {
  var $component = this;
  var $clickedInput = event.target;

  // Ignore clicks on things that aren't radio buttons
  if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'radio') {
    return
  }

  // We only need to consider radios with conditional reveals, which will have
  // aria-controls attributes.
  var $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');

  var $clickedInputForm = $clickedInput.form;
  var $clickedInputName = $clickedInput.name;

  nodeListForEach($allInputs, function ($input) {
    var hasSameFormOwner = $input.form === $clickedInputForm;
    var hasSameName = $input.name === $clickedInputName;

    if (hasSameName && hasSameFormOwner) {
      $component.syncConditionalRevealWithInputState($input);
    }
  });
};

export default Radios;
//# sourceMappingURL=components/radios/radios.mjs.map
