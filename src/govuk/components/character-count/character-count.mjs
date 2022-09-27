import '../../vendor/polyfills/Function/prototype/bind.mjs'
import '../../vendor/polyfills/Event.mjs' // addEventListener and event.target normalisation
import '../../vendor/polyfills/Element/prototype/classList.mjs'
import { mergeConfigs, normaliseDataset } from '../../common.mjs'

function CharacterCount ($module, config) {
  if (!$module) {
    return this
  }

  // Read config set using dataset ('data-' values)
  var datasetConfig = normaliseDataset($module.dataset)

  this.config = mergeConfigs(
    config || {},
    datasetConfig
  )

  // Determine the limit attribute (characters or words)
  if (this.config.maxwords) {
    this.maxLength = this.config.maxwords
  } else if (this.config.maxlength) {
    this.maxLength = this.config.maxlength
  } else {
    return
  }

  this.$module = $module
  this.$textarea = $module.querySelector('.govuk-js-character-count')
  this.$visibleCountMessage = null
  this.$screenReaderCountMessage = null
  this.lastInputTimestamp = null
}

/**
 * Initialise component
 */
CharacterCount.prototype.init = function () {
  // Check that required elements are present
  if (!this.$textarea) {
    return
  }

  var $textarea = this.$textarea
  var $fallbackLimitMessage = document.getElementById($textarea.id + '-info')

  // Move the fallback count message to be immediately after the textarea
  // Kept for backwards compatibility
  $textarea.insertAdjacentElement('afterend', $fallbackLimitMessage)

  // Create the *screen reader* specific live-updating counter
  // This doesn't need any styling classes, as it is never visible
  var $screenReaderCountMessage = document.createElement('div')
  $screenReaderCountMessage.className = 'govuk-character-count__sr-status govuk-visually-hidden'
  $screenReaderCountMessage.setAttribute('aria-live', 'polite')
  this.$screenReaderCountMessage = $screenReaderCountMessage
  $fallbackLimitMessage.insertAdjacentElement('afterend', $screenReaderCountMessage)

  // Create our live-updating counter element, copying the classes from the
  // fallback element for backwards compatibility as these may have been
  // configured
  var $visibleCountMessage = document.createElement('div')
  $visibleCountMessage.className = $fallbackLimitMessage.className
  $visibleCountMessage.classList.add('govuk-character-count__status')
  $visibleCountMessage.setAttribute('aria-hidden', 'true')
  this.$visibleCountMessage = $visibleCountMessage
  $fallbackLimitMessage.insertAdjacentElement('afterend', $visibleCountMessage)

  // Hide the fallback limit message
  $fallbackLimitMessage.classList.add('govuk-visually-hidden')

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
CharacterCount.prototype.bindChangeEvents = function () {
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
CharacterCount.prototype.handleKeyUp = function () {
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
CharacterCount.prototype.handleFocus = function () {
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
CharacterCount.prototype.handleBlur = function () {
  // Cancel value checking on blur
  clearInterval(this.valueChecker)
}

/**
 * Update count message if textarea value has changed
 */
CharacterCount.prototype.updateIfValueChanged = function () {
  if (!this.$textarea.oldValue) this.$textarea.oldValue = ''
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
CharacterCount.prototype.updateCountMessage = function () {
  this.updateVisibleCountMessage()
  this.updateScreenReaderCountMessage()
}

/**
 * Update visible count message
 */
CharacterCount.prototype.updateVisibleCountMessage = function () {
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
  $visibleCountMessage.innerHTML = this.getCountMessage()
}

/**
 * Update screen reader count message
 */
CharacterCount.prototype.updateScreenReaderCountMessage = function () {
  var $screenReaderCountMessage = this.$screenReaderCountMessage

  // If over the threshold, remove the aria-hidden attribute, allowing screen
  // readers to announce the content of the element.
  if (this.isOverThreshold()) {
    $screenReaderCountMessage.removeAttribute('aria-hidden')
  } else {
    $screenReaderCountMessage.setAttribute('aria-hidden', true)
  }

  // Update message
  $screenReaderCountMessage.innerHTML = this.getCountMessage()
}

/**
 * Count the number of characters (or words, if `config.maxwords` is set)
 * in the given text
 *
 * @param {String} text - The text to count the characters of
 * @returns {Number} the number of characters (or words) in the text
 */
CharacterCount.prototype.count = function (text) {
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
 * @returns {String} Status message
 */
CharacterCount.prototype.getCountMessage = function () {
  var $textarea = this.$textarea
  var config = this.config
  var remainingNumber = this.maxLength - this.count($textarea.value)

  var charVerb = 'remaining'
  var charNoun = 'character'
  var displayNumber = remainingNumber
  if (config.maxwords) {
    charNoun = 'word'
  }
  charNoun = charNoun + ((remainingNumber === -1 || remainingNumber === 1) ? '' : 's')

  charVerb = (remainingNumber < 0) ? 'too many' : 'remaining'
  displayNumber = Math.abs(remainingNumber)

  return 'You have ' + displayNumber + ' ' + charNoun + ' ' + charVerb
}

/**
 * Check if count is over threshold
 *
 * Checks whether the value is over the configured threshold for the input.
 * If there is no configured threshold, it is set to 0 and this function will
 * always return true.
 *
 * @returns {Boolean} true if the current count is over the config.threshold
 *   (or no threshold is set)
 */
CharacterCount.prototype.isOverThreshold = function () {
  var $textarea = this.$textarea
  var config = this.config

  // Determine the remaining number of characters/words
  var currentLength = this.count($textarea.value)
  var maxLength = this.maxLength

  // Set threshold if presented in config
  var thresholdPercent = config.threshold ? config.threshold : 0
  var thresholdValue = maxLength * thresholdPercent / 100

  return (thresholdValue <= currentLength)
}

/**
 * Get dataset
 *
 * Get all of the data-* attributes from a given $element as map of key-value
 * pairs, with the data- prefix removed from the keys.
 *
 * This is a bit like HTMLElement.dataset, but it does not convert the keys to
 * camel case (and it works in browsers that do not support HTMLElement.dataset)
 *
 * @todo Replace with HTMLElement.dataset
 *
 * @param {HTMLElement} $element - The element to read data attributes from
 * @returns {Object} Object of key-value pairs representing the data attributes
 */
CharacterCount.prototype.getDataset = function ($element) {
  var dataset = {}
  var attributes = $element.attributes
  if (attributes) {
    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i]
      var match = attribute.name.match(/^data-(.+)/)
      if (match) {
        dataset[match[1]] = attribute.value
      }
    }
  }
  return dataset
}

export default CharacterCount
