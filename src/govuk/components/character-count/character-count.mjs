/* eslint-disable es-x/no-date-now -- Polyfill imported */
/* eslint-disable es-x/no-function-prototype-bind -- Polyfill imported */

import { withConfiguration } from '../../common/class/mixins/withConfiguration.mjs'
import { withI18n } from '../../common/class/mixins/withI18n.mjs'
import { mixOnto } from '../../common/class/mixins.mjs'
import '../../vendor/polyfills/Date/now.mjs'
import '../../vendor/polyfills/Element/prototype/classList.mjs'
import '../../vendor/polyfills/Event.mjs' // addEventListener, event.target normalization and DOMContentLoaded
import '../../vendor/polyfills/Function/prototype/bind.mjs'
import BaseComponent from '../base-component.mjs'

/**
 * @constant
 * @type {CharacterCountTranslations}
 * @see Default value for {@link CharacterCountConfig.i18n}
 * @default
 */
const TRANSLATIONS = {
  // Characters
  charactersUnderLimit: {
    one: 'You have %{count} character remaining',
    other: 'You have %{count} characters remaining'
  },
  charactersAtLimit: 'You have 0 characters remaining',
  charactersOverLimit: {
    one: 'You have %{count} character too many',
    other: 'You have %{count} characters too many'
  },
  // Words
  wordsUnderLimit: {
    one: 'You have %{count} word remaining',
    other: 'You have %{count} words remaining'
  },
  wordsAtLimit: 'You have 0 words remaining',
  wordsOverLimit: {
    one: 'You have %{count} word too many',
    other: 'You have %{count} words too many'
  },
  textareaDescription: {
    other: ''
  }
}

const DEFAULT_CONFIGURATION = {
  threshold: 0,
  i18n: TRANSLATIONS
}

/**
 * JavaScript enhancements for the CharacterCount component
 *
 * Tracks the number of characters or words in the `.govuk-js-character-count`
 * `<textarea>` inside the element. Displays a message with the remaining number
 * of characters/words available, or the number of characters/words in excess.
 *
 * You can configure the message to only appear after a certain percentage
 * of the available characters/words has been entered.
 *
 * @class
 */
class CharacterCount extends mixOnto(BaseComponent, withConfiguration(DEFAULT_CONFIGURATION), withI18n) {
  static selector = 'govuk-character-count'

  /**
   * Constructor
   *
   * @param {HTMLElement} $module - HTML element to use for character count
   * @param {CharacterCountConfig} [config] - Character count config
   */
  constructor ($module, config) {
    super($module, config)

    // Determine the limit attribute (characters or words)
    if (this.config.maxwords) {
      this.maxLength = this.config.maxwords
    } else if (this.config.maxlength) {
      this.maxLength = this.config.maxlength
    } else {
      return
    }

    // this.$module = $module
    this.$textarea = $module.querySelector('.govuk-js-character-count')
    this.$visibleCountMessage = null
    this.$screenReaderCountMessage = null
    this.lastInputTimestamp = null

    this.init()
  }

  /**
   * To ensure data-attributes take complete precedence, even if they change the
   * type of count, we need to reset the `maxlength` and `maxwords` from the
   * JavaScript config.
   *
   * We can't mutate `javascriptConfiguration`, though, as it may be shared across multiple
   * components inside `initAll`.
   *
   * @override
   */
  gatherConfigurations (javascriptConfiguration) {
    return [
      this.defaultConfiguration,
      javascriptConfiguration,
      this.getConfigurationOverrides(),
      this.elementConfiguration
    ]
  }

  /**
   * Creates as configuration that resets `maxlength` and `maxwords`
   * if they're present in the dataset configuration
   *
   * @returns {Object<string,any>} A configration to reset `maxlenght` and `maxwords`
   */
  getConfigurationOverrides () {
    const datasetConfiguration = this.datasetConfiguration
    if ('maxwords' in datasetConfiguration || 'maxlength' in datasetConfiguration) {
      return {
        maxlength: false,
        maxwords: false
      }
    }

    return {}
  }

  /**
   * Initialise component
   */
  init () {
    // Check that required elements are present
    if (!this.$textarea) {
      return
    }

    var $textarea = this.$textarea
    var $textareaDescription = document.getElementById($textarea.id + '-info')

    // Inject a decription for the textarea if none is present already
    // for when the component was rendered with no maxlength, maxwords
    // nor custom textareaDescriptionText
    if ($textareaDescription.innerText.match(/^\s*$/)) {
      $textareaDescription.innerText = this.i18n.t('textareaDescription', { count: this.maxLength })
    }

    // Move the textarea description to be immediately after the textarea
    // Kept for backwards compatibility
    $textarea.insertAdjacentElement('afterend', $textareaDescription)

    // Create the *screen reader* specific live-updating counter
    // This doesn't need any styling classes, as it is never visible
    var $screenReaderCountMessage = document.createElement('div')
    $screenReaderCountMessage.className = 'govuk-character-count__sr-status govuk-visually-hidden'
    $screenReaderCountMessage.setAttribute('aria-live', 'polite')
    this.$screenReaderCountMessage = $screenReaderCountMessage
    $textareaDescription.insertAdjacentElement('afterend', $screenReaderCountMessage)

    // Create our live-updating counter element, copying the classes from the
    // textarea description for backwards compatibility as these may have been
    // configured
    var $visibleCountMessage = document.createElement('div')
    $visibleCountMessage.className = $textareaDescription.className
    $visibleCountMessage.classList.add('govuk-character-count__status')
    $visibleCountMessage.setAttribute('aria-hidden', 'true')
    this.$visibleCountMessage = $visibleCountMessage
    $textareaDescription.insertAdjacentElement('afterend', $visibleCountMessage)

    // Hide the textarea description
    $textareaDescription.classList.add('govuk-visually-hidden')

    // Remove hard limit if set
    $textarea.removeAttribute('maxlength')

    this.bindChangeEvents()

    // When the page is restored after navigating 'back' in some browsers the
    // state of the character count is not restored until *after* the
    // DOMContentLoaded event is fired, so we need to manually update it after the
    // pageshow event in browsers that support it.
    if ('onpageshow' in window) {
      window.addEventListener('pageshow', this.updateCountMessage.bind(this))
    } else {
      window.addEventListener('DOMContentLoaded', this.updateCountMessage.bind(this))
    }
    this.updateCountMessage()
  }

  /**
   * Bind change events
   *
   * Set up event listeners on the $textarea so that the count messages update
   * when the user types.
   */
  bindChangeEvents () {
    var $textarea = this.$textarea
    $textarea.addEventListener('keyup', this.handleKeyUp.bind(this))

    // Bind focus/blur events to start/stop polling
    $textarea.addEventListener('focus', this.handleFocus.bind(this))
    $textarea.addEventListener('blur', this.handleBlur.bind(this))
  }

  /**
   * Handle key up event
   *
   * Update the visible character counter and keep track of when the last update
   * happened for each keypress
   */
  handleKeyUp () {
    this.updateVisibleCountMessage()
    this.lastInputTimestamp = Date.now()
  }

  /**
   * Handle focus event
   *
   * Speech recognition software such as Dragon NaturallySpeaking will modify the
   * fields by directly changing its `value`. These changes don't trigger events
   * in JavaScript, so we need to poll to handle when and if they occur.
   *
   * Once the keyup event hasn't been detected for at least 1000 ms (1s), check if
   * the textarea value has changed and update the count message if it has.
   *
   * This is so that the update triggered by the manual comparison doesn't
   * conflict with debounced KeyboardEvent updates.
   */
  handleFocus () {
    this.valueChecker = setInterval(function () {
      if (!this.lastInputTimestamp || (Date.now() - 500) >= this.lastInputTimestamp) {
        this.updateIfValueChanged()
      }
    }.bind(this), 1000)
  }

  /**
   * Handle blur event
   *
   * Stop checking the textarea value once the textarea no longer has focus
   */
  handleBlur () {
    // Cancel value checking on blur
    clearInterval(this.valueChecker)
  }

  /**
   * Update count message if textarea value has changed
   */
  updateIfValueChanged () {
    if (!this.$textarea.oldValue) {
      this.$textarea.oldValue = ''
    }

    if (this.$textarea.value !== this.$textarea.oldValue) {
      this.$textarea.oldValue = this.$textarea.value
      this.updateCountMessage()
    }
  }

  /**
   * Update count message
   *
   * Helper function to update both the visible and screen reader-specific
   * counters simultaneously (e.g. on init)
   */
  updateCountMessage () {
    this.updateVisibleCountMessage()
    this.updateScreenReaderCountMessage()
  }

  /**
   * Update visible count message
   */
  updateVisibleCountMessage () {
    var $textarea = this.$textarea
    var $visibleCountMessage = this.$visibleCountMessage
    var remainingNumber = this.maxLength - this.count($textarea.value)

    // If input is over the threshold, remove the disabled class which renders the
    // counter invisible.
    if (this.isOverThreshold()) {
      $visibleCountMessage.classList.remove('govuk-character-count__message--disabled')
    } else {
      $visibleCountMessage.classList.add('govuk-character-count__message--disabled')
    }

    // Update styles
    if (remainingNumber < 0) {
      $textarea.classList.add('govuk-textarea--error')
      $visibleCountMessage.classList.remove('govuk-hint')
      $visibleCountMessage.classList.add('govuk-error-message')
    } else {
      $textarea.classList.remove('govuk-textarea--error')
      $visibleCountMessage.classList.remove('govuk-error-message')
      $visibleCountMessage.classList.add('govuk-hint')
    }

    // Update message
    $visibleCountMessage.innerText = this.getCountMessage()
  }

  /**
   * Update screen reader count message
   */
  updateScreenReaderCountMessage () {
    var $screenReaderCountMessage = this.$screenReaderCountMessage

    // If over the threshold, remove the aria-hidden attribute, allowing screen
    // readers to announce the content of the element.
    if (this.isOverThreshold()) {
      $screenReaderCountMessage.removeAttribute('aria-hidden')
    } else {
      $screenReaderCountMessage.setAttribute('aria-hidden', true)
    }

    // Update message
    $screenReaderCountMessage.innerText = this.getCountMessage()
  }

  /**
   * Count the number of characters (or words, if `config.maxwords` is set)
   * in the given text
   *
   * @param {string} text - The text to count the characters of
   * @returns {number} the number of characters (or words) in the text
   */
  count (text) {
    if (this.config.maxwords) {
      var tokens = text.match(/\S+/g) || [] // Matches consecutive non-whitespace chars
      return tokens.length
    } else {
      return text.length
    }
  }

  /**
   * Get count message
   *
   * @returns {string} Status message
   */
  getCountMessage () {
    var remainingNumber = this.maxLength - this.count(this.$textarea.value)

    var countType = this.config.maxwords ? 'words' : 'characters'
    return this.formatCountMessage(remainingNumber, countType)
  }

  /**
   * Formats the message shown to users according to what's counted
   * and how many remain
   *
   * @param {number} remainingNumber - The number of words/characaters remaining
   * @param {string} countType - "words" or "characters"
   * @returns {string} Status message
   */
  formatCountMessage (remainingNumber, countType) {
    if (remainingNumber === 0) {
      return this.i18n.t(countType + 'AtLimit')
    }

    var translationKeySuffix = remainingNumber < 0 ? 'OverLimit' : 'UnderLimit'

    return this.i18n.t(countType + translationKeySuffix, { count: Math.abs(remainingNumber) })
  }

  /**
   * Check if count is over threshold
   *
   * Checks whether the value is over the configured threshold for the input.
   * If there is no configured threshold, it is set to 0 and this function will
   * always return true.
   *
   * @returns {boolean} true if the current count is over the config.threshold
   *   (or no threshold is set)
   */
  isOverThreshold () {
    // No threshold means we're always above threshold so save some computation
    if (!this.config.threshold) {
      return true
    }

    var $textarea = this.$textarea

    // Determine the remaining number of characters/words
    var currentLength = this.count($textarea.value)
    var maxLength = this.maxLength

    var thresholdValue = maxLength * this.config.threshold / 100

    return (thresholdValue <= currentLength)
  }

  /**
   * Find or create character count
   *
   * @param {HTMLElement} $element - Button element
   * @param {CharacterCountConfig} configObject - Config object
   * @returns {CharacterCount} Instantiated Character Count component
   */
  static findOrCreate ($element, configObject) {
    return super.findOrCreate($element, configObject)
  }

  /**
   * Create all character counts
   *
   * @param {HTMLElement} $scope
   * @param {CharacterCountConfig} configObject - Config object
   */
  static createAll ($scope, configObject) {
    super.createAll($scope, configObject)
  }
}

export default CharacterCount

/**
 * Character count config
 *
 * @typedef {CharacterCountConfigWithMaxLength | CharacterCountConfigWithMaxWords} CharacterCountConfig
 */

/**
 * Character count config (with maximum number of characters)
 *
 * @typedef {object} CharacterCountConfigWithMaxLength
 * @property {number} [maxlength] - The maximum number of characters.
 *  If maxwords is provided, the maxlength option will be ignored.
 * @property {number} [threshold = 0] - The percentage value of the limit at
 *  which point the count message is displayed. If this attribute is set, the
 *  count message will be hidden by default.
 * @property {CharacterCountTranslations} [i18n = CHARACTER_COUNT_TRANSLATIONS] - See constant {@link CHARACTER_COUNT_TRANSLATIONS}
 */

/**
 * Character count config (with maximum number of words)
 *
 * @typedef {object} CharacterCountConfigWithMaxWords
 * @property {number} [maxwords] - The maximum number of words. If maxwords is
 *  provided, the maxlength option will be ignored.
 * @property {number} [threshold = 0] - The percentage value of the limit at
 *  which point the count message is displayed. If this attribute is set, the
 *  count message will be hidden by default.
 * @property {CharacterCountTranslations} [i18n = CHARACTER_COUNT_TRANSLATIONS] - See constant {@link CHARACTER_COUNT_TRANSLATIONS}
 */

/**
 * Character count translations
 *
 * @typedef {object} CharacterCountTranslations
 *
 * Messages shown to users as they type. It provides feedback on how many words
 * or characters they have remaining or if they are over the limit. This also
 * includes a message used as an accessible description for the textarea.
 * @property {TranslationPluralForms} [charactersUnderLimit] - Message displayed
 *   when the number of characters is under the configured maximum, `maxlength`.
 *   This message is displayed visually and through assistive technologies. The
 *   component will replace the `%{count}` placeholder with the number of
 *   remaining characters. This is a [pluralised list of
 *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
 * @property {string} [charactersAtLimit] - Message displayed when the number of
 *   characters reaches the configured maximum, `maxlength`. This message is
 *   displayed visually and through assistive technologies.
 * @property {TranslationPluralForms} [charactersOverLimit] - Message displayed
 *   when the number of characters is over the configured maximum, `maxlength`.
 *   This message is displayed visually and through assistive technologies. The
 *   component will replace the `%{count}` placeholder with the number of
 *   remaining characters. This is a [pluralised list of
 *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
 * @property {TranslationPluralForms} [wordsUnderLimit] - Message displayed when
 *   the number of words is under the configured maximum, `maxlength`. This
 *   message is displayed visually and through assistive technologies. The
 *   component will replace the `%{count}` placeholder with the number of
 *   remaining words. This is a [pluralised list of
 *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
 * @property {string} [wordsAtLimit] - Message displayed when the number of
 *   words reaches the configured maximum, `maxlength`. This message is
 *   displayed visually and through assistive technologies.
 * @property {TranslationPluralForms} [wordsOverLimit] - Message displayed when
 *   the number of words is over the configured maximum, `maxlength`. This
 *   message is displayed visually and through assistive technologies. The
 *   component will replace the `%{count}` placeholder with the number of
 *   remaining words. This is a [pluralised list of
 *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
 * @property {TranslationPluralForms} [textareaDescription] - Message made
 *   available to assistive technologies, if none is already present in the
 *   HTML, to describe that the component accepts only a limited amount of
 *   content. It is visible on the page when JavaScript is unavailable. The
 *   component will replace the `%{count}` placeholder with the value of the
 *   `maxlength` or `maxwords` parameter.
 */

/**
 * @typedef {import('../../i18n.mjs').TranslationPluralForms} TranslationPluralForms
 */
