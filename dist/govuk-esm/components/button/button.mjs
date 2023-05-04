import { mergeConfigs } from '../../common/index.mjs';
import { normaliseDataset } from '../../common/normalise-dataset.mjs';
import '../../vendor/polyfills/Event.mjs';
import '../../vendor/polyfills/Function/prototype/bind.mjs';

/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

var KEY_SPACE = 32;
var DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

/**
 * JavaScript enhancements for the Button component
 *
 * @class
 * @param {Element} $module - HTML element to use for button
 * @param {ButtonConfig} [config] - Button config
 */
function Button ($module, config) {
  if (!($module instanceof HTMLElement)) {
    return this
  }

  /** @deprecated Will be made private in v5.0 */
  this.$module = $module;

  /** @deprecated Will be made private in v5.0 */
  this.debounceFormSubmitTimer = null;

  var defaultConfig = {
    preventDoubleClick: false
  };

  /**
   * @deprecated Will be made private in v5.0
   * @type {ButtonConfig}
   */
  this.config = mergeConfigs(
    defaultConfig,
    config || {},
    normaliseDataset($module.dataset)
  );
}

/**
 * Initialise component
 */
Button.prototype.init = function () {
  // Check that required elements are present
  if (!this.$module) {
    return
  }

  this.$module.addEventListener('keydown', this.handleKeyDown);
  this.$module.addEventListener('click', this.debounce.bind(this));
};

/**
 * Trigger a click event when the space key is pressed
 *
 * Some screen readers tell users they can activate things with the 'button'
 * role, so we need to match the functionality of native HTML buttons
 *
 * See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
 *
 * @deprecated Will be made private in v5.0
 * @param {KeyboardEvent} event - Keydown event
 */
Button.prototype.handleKeyDown = function (event) {
  var $target = event.target;

  // Handle space bar only
  if (event.keyCode !== KEY_SPACE) {
    return
  }

  // Handle elements with [role="button"] only
  if ($target instanceof HTMLElement && $target.getAttribute('role') === 'button') {
    event.preventDefault(); // prevent the page from scrolling
    $target.click();
  }
};

/**
 * Debounce double-clicks
 *
 * If the click quickly succeeds a previous click then nothing will happen. This
 * stops people accidentally causing multiple form submissions by double
 * clicking buttons.
 *
 * @deprecated Will be made private in v5.0
 * @param {MouseEvent} event - Mouse click event
 * @returns {undefined | false} Returns undefined, or false when debounced
 */
Button.prototype.debounce = function (event) {
  // Check the button that was clicked has preventDoubleClick enabled
  if (!this.config.preventDoubleClick) {
    return
  }

  // If the timer is still running, prevent the click from submitting the form
  if (this.debounceFormSubmitTimer) {
    event.preventDefault();
    return false
  }

  this.debounceFormSubmitTimer = setTimeout(function () {
    this.debounceFormSubmitTimer = null;
  }.bind(this), DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
};

/**
 * Button config
 *
 * @typedef {object} ButtonConfig
 * @property {boolean} [preventDoubleClick = false] - Prevent accidental double
 *   clicks on submit buttons from submitting forms multiple times.
 */

export default Button;
//# sourceMappingURL=components/button/button.mjs.map
