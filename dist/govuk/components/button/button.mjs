import { ConfigurableComponent } from '../../common/configuration.mjs';

const DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

/**
 * JavaScript enhancements for the Button component
 *
 * @preserve
 * @augments ConfigurableComponent<ButtonConfig>
 */
class Button extends ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for button
   * @param {ButtonConfig} [config] - Button config
   */
  constructor($root, config = {}) {
    super($root, config);
    this.debounceFormSubmitTimer = null;
    this.$root.addEventListener('keydown', event => this.handleKeyDown(event));
    this.$root.addEventListener('click', event => this.debounce(event));
  }
  handleKeyDown(event) {
    const $target = event.target;
    if (event.key !== ' ') {
      return;
    }
    if ($target instanceof HTMLElement && $target.getAttribute('role') === 'button') {
      event.preventDefault();
      $target.click();
    }
  }
  debounce(event) {
    if (!this.config.preventDoubleClick) {
      return;
    }
    if (this.debounceFormSubmitTimer) {
      event.preventDefault();
      return false;
    }
    this.debounceFormSubmitTimer = window.setTimeout(() => {
      this.debounceFormSubmitTimer = null;
    }, DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
  }
}

/**
 * Button config
 *
 * @typedef {object} ButtonConfig
 * @property {boolean} [preventDoubleClick=false] - Prevent accidental double
 *   clicks on submit buttons from submitting forms multiple times.
 */

/**
 * @typedef {import('../../common/configuration.mjs').Schema} Schema
 */
Button.moduleName = 'govuk-button';
Button.defaults = Object.freeze({
  preventDoubleClick: false
});
Button.schema = Object.freeze({
  properties: {
    preventDoubleClick: {
      type: 'boolean'
    }
  }
});

export { Button };
//# sourceMappingURL=button.mjs.map
