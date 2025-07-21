import { ConfigurableComponent } from '../../common/configuration.mjs'
import { setFocus } from '../../common/index.mjs'

/**
 * Error summary component
 *
 * Takes focus on initialisation for accessible announcement, unless disabled in
 * configuration.
 *
 * @preserve
 * @augments ConfigurableComponent<ErrorSummaryConfig>
 */
export class ErrorSummary extends ConfigurableComponent {
  /**
   * @param {Element | null} $root - HTML element to use for error summary
   * @param {ErrorSummaryConfig} [config] - Error summary config
   */
  constructor($root, config = {}) {
    super($root, config)

    /**
     * Focus the error summary
     */
    if (!this.config.disableAutoFocus) {
      setFocus(this.$root)
    }

    this.$root.addEventListener('click', (event) => this.handleClick(event))
  }

  /**
   * Click event handler
   *
   * @private
   * @param {MouseEvent} event - Click event
   */
  handleClick(event) {
    const $target = event.target
    if ($target && this.focusTarget($target)) {
      event.preventDefault()
    }
  }

  /**
   * Focus the target element
   *
   * By default, the browser will scroll the target into view. Because our
   * labels or legends appear above the input, this means the user will be
   * presented with an input without any context, as the label or legend will be
   * off the top of the screen.
   *
   * Manually handling the click event, scrolling the question into view and
   * then focussing the element solves this.
   *
   * This also results in the label and/or legend being announced correctly in
   * NVDA (as tested in 2018.3.2) - without this only the field type is
   * announced (e.g. "Edit, has autocomplete").
   *
   * @private
   * @param {EventTarget} $target - Event target
   * @returns {boolean} True if the target was able to be focussed
   */
  focusTarget($target) {
    // If the element that was clicked was not a link, return early
    if (!($target instanceof HTMLAnchorElement)) {
      return false
    }

    const inputId = $target.hash.replace('#', '')
    if (!inputId) {
      return false
    }

    const $input = document.getElementById(inputId)
    if (!$input) {
      return false
    }

    const $legendOrLabel = this.getAssociatedLegendOrLabel($input)
    if (!$legendOrLabel) {
      return false
    }

    // Scroll the legend or label into view *before* calling focus on the input
    // to avoid extra scrolling in browsers that don't support `preventScroll`
    // (which at time of writing is most of them...)
    $legendOrLabel.scrollIntoView()
    $input.focus({ preventScroll: true })

    return true
  }

  /**
   * Get associated legend or label
   *
   * Returns the first element that exists from this list:
   *
   * - The `<legend>` associated with the closest `<fieldset>` ancestor, as long
   *   as the top of it is no more than half a viewport height away from the
   *   bottom of the input
   * - The first `<label>` that is associated with the input using for="inputId"
   * - The closest parent `<label>`
   *
   * @private
   * @param {Element} $input - The input
   * @returns {Element | null} Associated legend or label, or null if no
   *   associated legend or label can be found
   */
  getAssociatedLegendOrLabel($input) {
    const $fieldset = $input.closest('fieldset')

    if ($fieldset) {
      const $legends = $fieldset.getElementsByTagName('legend')

      if ($legends.length) {
        const $candidateLegend = $legends[0]

        // If the input type is radio or checkbox, always use the legend if
        // there is one.
        if (
          $input instanceof HTMLInputElement &&
          ($input.type === 'checkbox' || $input.type === 'radio')
        ) {
          return $candidateLegend
        }

        // For other input types, only scroll to the fieldset’s legend (instead
        // of the label associated with the input) if the input would end up in
        // the top half of the screen.
        //
        // This should avoid situations where the input either ends up off the
        // screen, or obscured by a software keyboard.
        const legendTop = $candidateLegend.getBoundingClientRect().top
        const inputRect = $input.getBoundingClientRect()

        // If the browser doesn't support Element.getBoundingClientRect().height
        // or window.innerHeight (like IE8), bail and just link to the label.
        if (inputRect.height && window.innerHeight) {
          const inputBottom = inputRect.top + inputRect.height

          if (inputBottom - legendTop < window.innerHeight / 2) {
            return $candidateLegend
          }
        }
      }
    }

    return (
      document.querySelector(`label[for='${$input.getAttribute('id')}']`) ??
      $input.closest('label')
    )
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-error-summary'

  /**
   * Error summary default config
   *
   * @see {@link ErrorSummaryConfig}
   * @constant
   * @type {ErrorSummaryConfig}
   */
  static defaults = Object.freeze({
    disableAutoFocus: false
  })

  /**
   * Error summary config schema
   *
   * @constant
   * @satisfies {Schema<ErrorSummaryConfig>}
   */
  static schema = Object.freeze({
    properties: {
      disableAutoFocus: { type: 'boolean' }
    }
  })
}

/**
 * Error summary config
 *
 * @typedef {object} ErrorSummaryConfig
 * @property {boolean} [disableAutoFocus=false] - If set to `true` the error
 *   summary will not be focussed when the page loads.
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 */
