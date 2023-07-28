import { mergeConfigs } from '../../common/index.mjs'
import { normaliseDataset } from '../../common/normalise-dataset.mjs'

const KEY_SPACE = 32
const DEBOUNCE_TIMEOUT_IN_SECONDS = 1

/**
 * JavaScript enhancements for the Button component
 *
 * @preserve
 */
export class Button {
  /** @private */
  $module

  /**
   * @private
   * @type {ButtonConfig}
   */
  config

  /**
   * @private
   * @type {number | null}
   */
  debounceFormSubmitTimer = null

  /**
   * @param {Element} $module - HTML element to use for button
   * @param {ButtonConfig} [config] - Button config
   */
  constructor($module, config) {
    if (
      !($module instanceof HTMLElement) ||
      !document.body.classList.contains('govuk-frontend-supported')
    ) {
      return this
    }

    this.$module = $module

    this.config = mergeConfigs(
      Button.defaults,
      config || {},
      normaliseDataset($module.dataset)
    )

    this.$module.addEventListener('keydown', (event) =>
      this.handleKeyDown(event)
    )
    this.$module.addEventListener('click', (event) => this.debounce(event))
  }

  /**
   * Trigger a click event when the space key is pressed
   *
   * Some screen readers tell users they can activate things with the 'button'
   * role, so we need to match the functionality of native HTML buttons
   *
   * See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
   *
   * @private
   * @param {KeyboardEvent} event - Keydown event
   */
  handleKeyDown(event) {
    const $target = event.target

    // Handle space bar only
    if (event.keyCode !== KEY_SPACE) {
      return
    }

    // Handle elements with [role="button"] only
    if (
      $target instanceof HTMLElement &&
      $target.getAttribute('role') === 'button'
    ) {
      event.preventDefault() // prevent the page from scrolling
      $target.click()
    }
  }

  /**
   * Debounce double-clicks
   *
   * If the click quickly succeeds a previous click then nothing will happen. This
   * stops people accidentally causing multiple form submissions by double
   * clicking buttons.
   *
   * @private
   * @param {MouseEvent} event - Mouse click event
   * @returns {undefined | false} Returns undefined, or false when debounced
   */
  debounce(event) {
    // Check the button that was clicked has preventDoubleClick enabled
    if (!this.config.preventDoubleClick) {
      return
    }

    // If the timer is still running, prevent the click from submitting the form
    if (this.debounceFormSubmitTimer) {
      event.preventDefault()
      return false
    }

    this.debounceFormSubmitTimer = window.setTimeout(() => {
      this.debounceFormSubmitTimer = null
    }, DEBOUNCE_TIMEOUT_IN_SECONDS * 1000)
  }

  /**
   * Button default config
   *
   * @see {@link ButtonConfig}
   * @constant
   * @default
   * @type {ButtonConfig}
   */
  static defaults = Object.freeze({
    preventDoubleClick: false
  })
}

/**
 * Button config
 *
 * @typedef {object} ButtonConfig
 * @property {boolean} [preventDoubleClick=false] - Prevent accidental double
 *   clicks on submit buttons from submitting forms multiple times.
 */
