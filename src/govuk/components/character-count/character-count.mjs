import '../../vendor/polyfills/Function/prototype/bind.mjs'
import '../../vendor/polyfills/Event.mjs' // addEventListener and event.target normaliziation
import '../../vendor/polyfills/Element/prototype/classList.mjs'

function CharacterCount ($module) {
  this.$module = $module
  this.$textarea = $module.querySelector('.govuk-js-character-count')
  this.$visibleCountMessage = null
  this.$screenReaderCountMessage = null
  this.lastInputTimestamp = null
}

CharacterCount.prototype.defaults = {
  characterCountAttribute: 'data-maxlength',
  wordCountAttribute: 'data-maxwords'
}

// Initialize component
CharacterCount.prototype.init = function () {
  // Check that required elements are present
  if (!this.$textarea) {
    return
  }

  // Check for module
  var $module = this.$module
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
  // fallback element for backwards compatibility as these may have been configured
  var $visibleCountMessage = document.createElement('div')
  $visibleCountMessage.className = $fallbackLimitMessage.className
  $visibleCountMessage.classList.add('govuk-character-count__status')
  $visibleCountMessage.setAttribute('aria-hidden', 'true')
  this.$visibleCountMessage = $visibleCountMessage
  $fallbackLimitMessage.insertAdjacentElement('afterend', $visibleCountMessage)

  // Hide the fallback limit message
  $fallbackLimitMessage.classList.add('govuk-visually-hidden')

  // Read options set using dataset ('data-' values)
  this.options = this.getDataset($module)

  // Determine the limit attribute (characters or words)
  var countAttribute = this.defaults.characterCountAttribute
  if (this.options.maxwords) {
    countAttribute = this.defaults.wordCountAttribute
  }

  // Save the element limit
  this.maxLength = $module.getAttribute(countAttribute)

  // Check for limit
  if (!this.maxLength) {
    return
  }

  // Remove hard limit if set
  $textarea.removeAttribute('maxlength')

  this.bindChangeEvents()

  // When the page is restored after navigating 'back' in some browsers the
  // state of the character count is not restored until *after* the DOMContentLoaded
  // event is fired, so we need to manually update it after the pageshow event
  // in browsers that support it.
  if ('onpageshow' in window) {
    window.addEventListener('pageshow', this.updateCountMessage.bind(this))
  } else {
    window.addEventListener('DOMContentLoaded', this.updateCountMessage.bind(this))
  }
  this.updateCountMessage()
}

// Read data attributes
CharacterCount.prototype.getDataset = function (element) {
  var dataset = {}
  var attributes = element.attributes
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

// Counts characters or words in text
CharacterCount.prototype.count = function (text) {
  var length
  if (this.options.maxwords) {
    var tokens = text.match(/\S+/g) || [] // Matches consecutive non-whitespace chars
    length = tokens.length
  } else {
    length = text.length
  }
  return length
}

// Bind input propertychange to the elements and update based on the change
CharacterCount.prototype.bindChangeEvents = function () {
  var $textarea = this.$textarea
  $textarea.addEventListener('keyup', this.handleKeyUp.bind(this))

  // Bind focus/blur events to start/stop polling
  $textarea.addEventListener('focus', this.handleFocus.bind(this))
  $textarea.addEventListener('blur', this.handleBlur.bind(this))
}

// Speech recognition software such as Dragon NaturallySpeaking will modify the
// fields by directly changing its `value`. These changes don't trigger events
// in JavaScript, so we need to poll to handle when and if they occur.
CharacterCount.prototype.checkIfValueChanged = function () {
  if (!this.$textarea.oldValue) this.$textarea.oldValue = ''
  if (this.$textarea.value !== this.$textarea.oldValue) {
    this.$textarea.oldValue = this.$textarea.value
    this.updateCountMessage()
  }
}

// Helper function to update both the visible and screen reader-specific
// counters simultaneously (e.g. on init)
CharacterCount.prototype.updateCountMessage = function () {
  this.updateVisibleCountMessage()
  this.updateScreenReaderCountMessage()
}

// Update visible counter
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
  $visibleCountMessage.innerHTML = this.formattedUpdateMessage()
}

// Update screen reader-specific counter
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
  $screenReaderCountMessage.innerHTML = this.formattedUpdateMessage()
}

// Format update message
CharacterCount.prototype.formattedUpdateMessage = function () {
  var $textarea = this.$textarea
  var options = this.options
  var remainingNumber = this.maxLength - this.count($textarea.value)

  var charVerb = 'remaining'
  var charNoun = 'character'
  var displayNumber = remainingNumber
  if (options.maxwords) {
    charNoun = 'word'
  }
  charNoun = charNoun + ((remainingNumber === -1 || remainingNumber === 1) ? '' : 's')

  charVerb = (remainingNumber < 0) ? 'too many' : 'remaining'
  displayNumber = Math.abs(remainingNumber)

  return 'You have ' + displayNumber + ' ' + charNoun + ' ' + charVerb
}

// Checks whether the value is over the configured threshold for the input.
// If there is no configured threshold, it is set to 0 and this function will
// always return true.
CharacterCount.prototype.isOverThreshold = function () {
  var $textarea = this.$textarea
  var options = this.options

  // Determine the remaining number of characters/words
  var currentLength = this.count($textarea.value)
  var maxLength = this.maxLength

  // Set threshold if presented in options
  var thresholdPercent = options.threshold ? options.threshold : 0
  var thresholdValue = maxLength * thresholdPercent / 100

  return (thresholdValue <= currentLength)
}

// Update the visible character counter and keep track of when the last update
// happened for each keypress
CharacterCount.prototype.handleKeyUp = function () {
  this.updateVisibleCountMessage()
  this.lastInputTimestamp = Date.now()
}

CharacterCount.prototype.handleFocus = function () {
  // If the field is focused, and a keyup event hasn't been detected for at
  // least 1000 ms (1 second), then run the manual change check.
  // This is so that the update triggered by the manual comparison doesn't
  // conflict with debounced KeyboardEvent updates.
  this.valueChecker = setInterval(function () {
    if (!this.lastInputTimestamp || (Date.now() - 500) >= this.lastInputTimestamp) {
      this.checkIfValueChanged()
    }
  }.bind(this), 1000)
}

CharacterCount.prototype.handleBlur = function () {
  // Cancel value checking on blur
  clearInterval(this.valueChecker)
}

export default CharacterCount
