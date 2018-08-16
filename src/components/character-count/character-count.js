import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener and event.target normaliziation

function CharacterCount ($module) {
  this.$module = $module
  this.$textarea = $module.querySelector('.js-character-count')
}

CharacterCount.prototype.defaults = {
  characterCountAttribute: 'data-maxlength',
  wordCountAttribute: 'data-maxwords'
}

// Initialize component
CharacterCount.prototype.init = function (options) {
  // Check for module
  var $module = this.$module
  var $textarea = this.$textarea
  if (!$textarea) {
    return
  }

  // Read options set using dataset ('data-' values) and merge them with options
  var dataset = this.getDataset($module)
  this.options = this.merge(options || {}, dataset)

  // Determine the limit attribute (characters or words)
  var countAttribute = (this.options.maxwords) ? this.defaults.wordCountAttribute : this.defaults.characterCountAttribute

  // Set the element limit
  if ($module.getAttribute) {
    this.maxLength = $module.getAttribute(countAttribute)
  }

  // Generate and reference message
  var boundCreateCountMessage = this.createCountMessage.bind(this)
  this.countMessage = boundCreateCountMessage()

  // If there's a maximum length defined and the count message was successfully applied
  if (this.maxLength && this.countMessage) {
    // Replace maxlength attribute with data-maxlength to avoid hard limit
    $module.setAttribute('maxlength', '')
    $module.setAttribute('data-maxlength', $module.maxLength)

    // Bind event changes to the textarea
    var boundChangeEvents = this.bindChangeEvents.bind(this)
    boundChangeEvents()

    // Update count message
    var boundUpdateCountMessage = this.updateCountMessage.bind(this)
    boundUpdateCountMessage()
  }
}

// Fills in default values
CharacterCount.prototype.merge = function (obj) {
  for (var i = 1; i < arguments.length; i++) {
    var def = arguments[i]
    for (var n in def) {
      if (obj[n] === undefined) obj[n] = def[n]
    }
  }
  return obj
}

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
CharacterCount.prototype.count = function (text, options) {
  var length
  if (options.maxwords) {
    var tokens = text.match(/\S+/g) || [] // Matches consecutive non-whitespace chars
    length = tokens.length
  } else {
    length = text.length
  }
  return length
}

// Generate count message and bind it to the input
// returns reference to the generated element
CharacterCount.prototype.createCountMessage = function () {
  var countElement = this.$textarea
  var elementId = countElement.id
  // Check for existing info count message
  var countMessage = document.getElementById(elementId + '-info')
  // If there is no existing info count message we add one right after the field
  if (elementId && !countMessage) {
    countElement.insertAdjacentHTML('afterend', '<span id="' + elementId + '-info" class="govuk-hint govuk-character-count__message" aria-live="polite"></span>')
    this.describedBy = countElement.getAttribute('aria-describedby')
    this.describedByInfo = this.describedBy + ' ' + elementId + '-info'
    countElement.setAttribute('aria-describedby', this.describedByInfo)
    countMessage = document.getElementById(elementId + '-info')
  }
  return countMessage
}

// Bind input propertychange to the elements and update based on the change
CharacterCount.prototype.bindChangeEvents = function () {
  var $textarea = this.$textarea
  $textarea.addEventListener('keyup', this.updateCountMessage.bind(this))

  // Bind focus/blur events to start/stop polling
  $textarea.addEventListener('focus', this.handleFocus.bind(this))
  $textarea.addEventListener('blur', this.handleBlur.bind(this))
}

// Speech recognition software such as Dragon NaturallySpeaking will modify the
// fields by directly changing its `value`. These changes don't trigger events
// in JavaScript, so we need to poll to handle when and if they occur.
CharacterCount.prototype.checkIfValueChanged = function () {
  if (!this.oldValue) this.oldValue = ''
  if (this.$textarea.value !== this.oldValue) {
    this.oldValue = this.$textarea.value
    var boundUpdateCountMessage = this.updateCountMessage.bind(this)
    boundUpdateCountMessage()
  }
}

// Update message box
CharacterCount.prototype.updateCountMessage = function () {
  var countElement = this.$textarea
  var options = this.options
  var countMessage = this.countMessage

  // Determine the remaining number of characters/words
  var currentLength = this.count(countElement.value, options)
  var maxLength = this.maxLength
  var remainingNumber = maxLength - currentLength

  // Set threshold if presented in options
  var threshold = 0
  if (options.threshold) {
    threshold = options.threshold
  }
  var thresholdValue = maxLength * threshold / 100
  if (thresholdValue > currentLength) {
    countMessage.classList.add('govuk-character-count__message--disabled')
  } else {
    countMessage.classList.remove('govuk-character-count__message--disabled')
  }

  // Update styles
  if (remainingNumber < 0) {
    countElement.classList.add('govuk-textarea--error')
    if (options.validation) {
      countElement.parentNode.parentNode.classList.add('govuk-form-group--error')
    }
    countMessage.classList.remove('govuk-hint')
    countMessage.classList.add('govuk-error-message')
  } else {
    countElement.classList.remove('govuk-textarea--error')
    if (options.validation) {
      countElement.parentNode.parentNode.classList.remove('govuk-form-group--error')
    }
    countMessage.classList.remove('govuk-error-message')
    countMessage.classList.add('govuk-hint')
  }

  // Update message
  var charVerb = 'remaining'
  var charNoun = 'character'
  var displayNumber = remainingNumber
  if (options.maxwords) {
    charNoun = 'word'
  }
  charNoun = charNoun + ((remainingNumber === -1 || remainingNumber === 1) ? '' : 's')

  charVerb = (remainingNumber < 0) ? 'too many' : 'remaining'
  displayNumber = Math.abs(remainingNumber)

  countMessage.innerHTML = 'You have ' + displayNumber + ' ' + charNoun + ' ' + charVerb
}

CharacterCount.prototype.handleFocus = function () {
  // Check if value changed on focus
  this.valueChecker = setInterval(this.checkIfValueChanged.bind(this), 1000)
}

CharacterCount.prototype.handleBlur = function () {
  // Cancel value checking on blur
  clearInterval(this.valueChecker)
}

export default CharacterCount
