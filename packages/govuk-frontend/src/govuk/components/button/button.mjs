import { ConfigurableComponent } from '../../common/configuration.mjs'

const DEBOUNCE_TIMEOUT_IN_SECONDS = 1

/**
 * JavaScript enhancements for the Button component
 *
 * @preserve
 * @augments ConfigurableComponent<ButtonConfig>
 */
export class Button extends ConfigurableComponent {
  /**
   * @private
   * @type {number | null}
   */
  debounceFormSubmitTimer = null

  /**
   * @param {Element | null} $root - HTML element to use for button
   * @param {ButtonConfig} [config] - Button config
   */
  constructor($root, config = {}) {
    super($root, config)

    this.$root.addEventListener('keydown', (event) => this.handleKeyDown(event))
    this.$root.addEventListener('click', (event) => this.debounce(event))
  }

  /**
   * Trigger a click event when the space key is pressed
   *
   * Some screen readers tell users they can use the space bar to activate
   * things with the 'button' role, so we need to match the functionality of
   * native HTML buttons.
   *
   * See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
   *
   * @private
   * @param {KeyboardEvent} event - Keydown event
   */
  handleKeyDown(event) {
    const $target = event.target

    // Handle space bar only
    if (event.key !== ' ') {
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
   * If the click quickly succeeds a previous click then nothing will happen.
   * This stops people accidentally causing multiple form submissions by double
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
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-button'

  /**
   * Button default config
   *
   * @see {@link ButtonConfig}
   * @constant
   * @type {ButtonConfig}
   */
  static defaults = Object.freeze({
    preventDoubleClick: false
  })

  /**
   * Button config schema
   *
   * @constant
   * @satisfies {Schema}
   */
  static schema = Object.freeze({
    properties: {
      preventDoubleClick: { type: 'boolean' }
    }
  })
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
