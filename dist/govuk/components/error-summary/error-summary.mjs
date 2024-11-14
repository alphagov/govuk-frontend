import { ConfigurableComponent } from '../../common/configuration.mjs';
import { setFocus, getFragmentFromUrl } from '../../common/index.mjs';

/**
 * Error summary component
 *
 * Takes focus on initialisation for accessible announcement, unless disabled in
 * configuration.
 *
 * @preserve
 * @augments ConfigurableComponent<ErrorSummaryConfig>
 */
class ErrorSummary extends ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for error summary
   * @param {ErrorSummaryConfig} [config] - Error summary config
   */
  constructor($root, config = {}) {
    super($root, config);
    if (!this.config.disableAutoFocus) {
      setFocus(this.$root);
    }
    this.$root.addEventListener('click', event => this.handleClick(event));
  }
  handleClick(event) {
    const $target = event.target;
    if ($target && this.focusTarget($target)) {
      event.preventDefault();
    }
  }
  focusTarget($target) {
    if (!($target instanceof HTMLAnchorElement)) {
      return false;
    }
    const inputId = getFragmentFromUrl($target.href);
    if (!inputId) {
      return false;
    }
    const $input = document.getElementById(inputId);
    if (!$input) {
      return false;
    }
    const $legendOrLabel = this.getAssociatedLegendOrLabel($input);
    if (!$legendOrLabel) {
      return false;
    }
    $legendOrLabel.scrollIntoView();
    $input.focus({
      preventScroll: true
    });
    return true;
  }
  getAssociatedLegendOrLabel($input) {
    var _document$querySelect;
    const $fieldset = $input.closest('fieldset');
    if ($fieldset) {
      const $legends = $fieldset.getElementsByTagName('legend');
      if ($legends.length) {
        const $candidateLegend = $legends[0];
        if ($input instanceof HTMLInputElement && ($input.type === 'checkbox' || $input.type === 'radio')) {
          return $candidateLegend;
        }
        const legendTop = $candidateLegend.getBoundingClientRect().top;
        const inputRect = $input.getBoundingClientRect();
        if (inputRect.height && window.innerHeight) {
          const inputBottom = inputRect.top + inputRect.height;
          if (inputBottom - legendTop < window.innerHeight / 2) {
            return $candidateLegend;
          }
        }
      }
    }
    return (_document$querySelect = document.querySelector(`label[for='${$input.getAttribute('id')}']`)) != null ? _document$querySelect : $input.closest('label');
  }
}

/**
 * Error summary config
 *
 * @typedef {object} ErrorSummaryConfig
 * @property {boolean} [disableAutoFocus=false] - If set to `true` the error
 *   summary will not be focussed when the page loads.
 */

/**
 * @typedef {import('../../common/configuration.mjs').Schema} Schema
 */
ErrorSummary.moduleName = 'govuk-error-summary';
ErrorSummary.defaults = Object.freeze({
  disableAutoFocus: false
});
ErrorSummary.schema = Object.freeze({
  properties: {
    disableAutoFocus: {
      type: 'boolean'
    }
  }
});

export { ErrorSummary };
//# sourceMappingURL=error-summary.mjs.map
