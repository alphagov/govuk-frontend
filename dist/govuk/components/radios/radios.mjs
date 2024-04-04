import { ElementError } from '../../errors/index.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';

/**
 * Radios component
 *
 * @preserve
 */
class Radios extends GOVUKFrontendComponent {
  /**
   * Radios can be associated with a 'conditionally revealed' content block –
   * for example, a radio for 'Phone' could reveal an additional form field for
   * the user to enter their phone number.
   *
   * These associations are made using a `data-aria-controls` attribute, which
   * is promoted to an aria-controls attribute during initialisation.
   *
   * We also need to restore the state of any conditional reveals on the page
   * (for example if the user has navigated back), and set up event handlers to
   * keep the reveal in sync with the radio state.
   *
   * @param {Element | null} $module - HTML element to use for radios
   */
  constructor($module) {
    super();
    this.$module = void 0;
    this.$inputs = void 0;
    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Radios',
        element: $module,
        identifier: 'Root element (`$module`)'
      });
    }
    const $inputs = $module.querySelectorAll('input[type="radio"]');
    if (!$inputs.length) {
      throw new ElementError({
        componentName: 'Radios',
        identifier: 'Form inputs (`<input type="radio">`)'
      });
    }
    this.$module = $module;
    this.$inputs = $inputs;
    this.$inputs.forEach($input => {
      const targetId = $input.getAttribute('data-aria-controls');
      if (!targetId) {
        return;
      }
      if (!document.getElementById(targetId)) {
        throw new ElementError({
          componentName: 'Radios',
          identifier: `Conditional reveal (\`id="${targetId}"\`)`
        });
      }
      $input.setAttribute('aria-controls', targetId);
      $input.removeAttribute('data-aria-controls');
    });
    window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
    this.syncAllConditionalReveals();
    this.$module.addEventListener('click', event => this.handleClick(event));
  }
  syncAllConditionalReveals() {
    this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
  }
  syncConditionalRevealWithInputState($input) {
    const targetId = $input.getAttribute('aria-controls');
    if (!targetId) {
      return;
    }
    const $target = document.getElementById(targetId);
    if ($target != null && $target.classList.contains('govuk-radios__conditional')) {
      const inputIsChecked = $input.checked;
      $input.setAttribute('aria-expanded', inputIsChecked.toString());
      $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
    }
  }
  handleClick(event) {
    const $clickedInput = event.target;
    if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'radio') {
      return;
    }
    const $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');
    const $clickedInputForm = $clickedInput.form;
    const $clickedInputName = $clickedInput.name;
    $allInputs.forEach($input => {
      const hasSameFormOwner = $input.form === $clickedInputForm;
      const hasSameName = $input.name === $clickedInputName;
      if (hasSameName && hasSameFormOwner) {
        this.syncConditionalRevealWithInputState($input);
      }
    });
  }
}
Radios.moduleName = 'govuk-radios';

export { Radios };
//# sourceMappingURL=radios.mjs.map
