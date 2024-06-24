import { mergeConfigs } from '../../common/index.mjs';
import { normaliseDataset } from '../../common/normalise-dataset.mjs';
import { ElementError } from '../../errors/index.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';

const DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

/**
 * JavaScript enhancements for the Button component
 *
 * @preserve
 */
class Button extends GOVUKFrontendComponent {
  /**
   * @param {Element | null} $module - HTML element to use for button
   * @param {ButtonConfig} [config] - Button config
   */
  constructor($module, config = {}) {
    super();
    this.$module = void 0;
    this.config = void 0;
    this.debounceFormSubmitTimer = null;
    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Button',
        element: $module,
        identifier: 'Root element (`$module`)'
      });
    }
    this.$module = $module;
    this.config = mergeConfigs(Button.defaults, config, normaliseDataset(Button, $module.dataset));
    this.$module.addEventListener('keydown', event => this.handleKeyDown(event));
    this.$module.addEventListener('click', event => this.debounce(event));
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
 * @typedef {import('../../common/index.mjs').Schema} Schema
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
