
import Config from '../../common/config.mjs'
import '../../vendor/polyfills/Event.mjs' // addEventListener, event.target normalization and DOMContentLoaded
import '../../vendor/polyfills/Function/prototype/bind.mjs'
import BaseComponent from '../base-component.mjs'

/**
 * JavaScript enhancements for the Button component
 */
class Button extends BaseComponent {
  static defaultConfig = {
    preventDoubleClick: false
  }

  static selector = 'govuk-button'

  static DEBOUNCE_TIMEOUT_IN_SECONDS = 1
  static KEY_SPACE = 32

  debounceFormSubmitTimer = null

  /**
   * Constructor
   *
   * @param {HTMLElement} $module - HTML element to use for button
   * @param {ButtonConfig} config - Button config
   */
  constructor ($module, config) {
    super($module)

    this.config = new Config(
      Button.defaultConfig,
      config || {},
      Config.normaliseDataset($module.dataset)
    )

    this.$module.addEventListener('keydown', this.#handleKeyDown)
    this.$module.addEventListener('click', this.#debounce.bind(this))
  }

  /**
   * Trigger a click event when the space key is pressed
   *
   * Some screen readers tell users they can activate things with the 'button'
   * role, so we need to match the functionality of native HTML buttons
   *
   * See https://github.com/alphagov/govuk_elements/pull/272#issuecomment-233028270
   *
   * @param {KeyboardEvent} event - Keydown event
   */
  #handleKeyDown (event) {
    var $target = event.target

    if ($target.getAttribute('role') === 'button' && event.keyCode === Button.KEY_SPACE) {
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
   * @param {MouseEvent} event - Mouse click event
   * @returns {undefined | false} Returns undefined, or false when debounced
   */
  #debounce (event) {
    // Check the button that was clicked has preventDoubleClick enabled
    if (!this.config.preventDoubleClick) {
      return
    }

    // If the timer is still running, prevent the click from submitting the form
    if (this.debounceFormSubmitTimer) {
      event.preventDefault()
      return false
    }

    this.debounceFormSubmitTimer = setTimeout(function () {
      this.debounceFormSubmitTimer = null
    }.bind(this), Button.DEBOUNCE_TIMEOUT_IN_SECONDS * 1000)
  }

  /**
   * Find or create button
   *
   * @param {HTMLElement} $element - Button element
   * @param {ButtonConfig} configObject - Config object
   * @returns {Button} Instantiated Button component
   */
  static findOrCreate ($element, configObject) {
    return super.findOrCreate($element, configObject)
  }

  /**
   * Create all buttons
   *
   * @param {HTMLElement} $scope
   * @param {ButtonConfig} configObject - Config object
   */
  static createAll ($scope, configObject) {
    super.createAll($scope, configObject)
  }
}

export default Button

/**
 * Button config
 *
 * @typedef {object} ButtonConfig
 * @property {boolean} [preventDoubleClick = false] -
 *  Prevent accidental double clicks on submit buttons from submitting forms
 *  multiple times.
 */
