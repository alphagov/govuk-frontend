import { ConfigurableComponent } from '../../common/configuration.mjs'

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

  /**
   * @param {Element | null} $root - HTML element to use for button
   * @param {ButtonConfig} [config] - Button config
   */
  constructor($root, config = {}) {
    super($root, config)

    this.$root.addEventListener('keydown', (event) => this.handleKeyDown(event))
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
   * @satisfies {Schema<ButtonConfig>}
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
 * @import { Schema } from '../../common/configuration.mjs'
 */
