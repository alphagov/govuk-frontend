import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener and event.target normaliziation

function CharacterCount ($module) {
  this.$module = $module
}

CharacterCount.prototype.defaults = {
  characterCountAttribute: 'maxlength',
  wordCountAttribute: 'data-maxwords'
}

// Initialize component
CharacterCount.prototype.init = function (options) {
  // Check for module
  var $module = this.$module
  if (!$module) {
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
  this.countMessage = this.createCountMessage($module)

  // Highlights
  if (this.options.highlight) {
    // Generate and reference highlight
    this.countHighlight = this.createCountHighlight($module)

    // We need to disable resize on highlighted components to avoid the async scroll and boundaries
    // because there is no cross-browser, native-web-API way to capture the resize of elements
    // Note: Resize Observer API allows this type of detection, but is poorly supported
    $module.style.resize = 'none'

    // Fix iOS default padding
    if (this.isIOS()) {
      this.fixIOSInput(this.countHighlight)
    }
  }

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

// Escape tags and ampersand
CharacterCount.prototype.escape = function (string) {
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  }
  return string.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag
  })
}

// Wrap element in a div with a specified wrapper class
CharacterCount.prototype.wrapElement = function (element, wrapperClass) {
  var wrapper = document.createElement('div')
  wrapper.className = wrapperClass
  element.parentNode.insertBefore(wrapper, element)
  element.parentNode.removeChild(element)
  wrapper.appendChild(element)
  return wrapper
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

// Get style attribute of an element
CharacterCount.prototype.getStyle = function (element, attributeName) {
  var attributeValue = ''
  if (document.defaultView && document.defaultView.getComputedStyle) {
    attributeValue = document.defaultView.getComputedStyle(element, '').getPropertyValue(attributeName)
  } else if (element.currentStyle) {
    attributeName = attributeName.replace(/-(\w)/g, function (strMatch, p1) {
      return p1.toUpperCase()
    })
    attributeValue = element.currentStyle[attributeName]
  }
  return attributeValue
}

// Browser sniffing is bad, but there are browser-specific quirks to handle that
// are not a matter of feature detection
CharacterCount.prototype.isIOS = function () {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    return true
  } else {
    return false
  }
}

// Fix iOS default padding
// iOS adds 3px of (unremovable) padding to the left and right of a textarea, so
// adjust highlights element to match the textarea element
CharacterCount.prototype.fixIOSInput = function (element) {
  var paddingLeft = parseInt(this.getStyle(element, 'padding-left'))
  var paddingRight = parseInt(this.getStyle(element, 'padding-right'))
  element.style.paddingLeft = paddingLeft + 3 + 'px'
  element.style.paddingRight = paddingRight + 3 + 'px'
}

// Counts characters or words in text
CharacterCount.prototype.count = function (text, options) {
  var length
  if (options.maxwords) {
    // var tokens = text.split(' ')
    // length = tokens.length-1
    var tokens = text.match(/\S+/g) || [] // Matches consecutive non-whitespace chars
    length = tokens.length
  } else {
    length = text.length
  }
  return length
}

// Highlight text from a specific limit to end
CharacterCount.prototype.highlight = function (text, limit) {
  text = text.replace(/\n$/g, '\n\n')
  var textBeforeLimit = this.escape(text.slice(0, limit))
  var textAfterLimit = this.escape(text.slice(limit))
  text = [textBeforeLimit, '<mark>', textAfterLimit, '</mark>'].join('')
  return text
}

// Generate count message and bind it to the input
// returns reference to the generated element
CharacterCount.prototype.createCountMessage = function (countElement) {
  var elementId = countElement.id
  // Check for existing info count message
  var countMessage = document.getElementById(elementId + '-info')
  // If there is no existing info count message we add one right after the field
  if (elementId && !countMessage) {
    countElement.insertAdjacentHTML('afterend', '<span id="' + elementId + '-info" class="govuk-hint govuk-character-count__message" aria-live="polite"></span>')
    countElement.setAttribute('aria-describedby', elementId + '-info')
    countMessage = document.getElementById(elementId + '-info')
  }
  return countMessage
}

// Generate count highlight
// returns reference to the generated element
CharacterCount.prototype.createCountHighlight = function (countElement) {
  var wrapper = this.wrapElement(countElement, 'govuk-character-count__wrapper')
  var elementId = countElement.id
  var countHighlightClass = 'govuk-character-count__highlight'
  wrapper.insertAdjacentHTML('afterbegin', '<div id="' + elementId + '-hl" class="govuk-character-count ' + countHighlightClass + '" aria-hidden="true" role="presentation"></div>')
  // Get highlight
  var countHighlight = document.getElementById(elementId + '-hl')

  countHighlight.style.height = countElement.offsetHeight + 'px'
  countHighlight.style.width = countElement.offsetWidth + 'px'

  return countHighlight
}

// Bind input propertychange to the elements and update based on the change
CharacterCount.prototype.bindChangeEvents = function () {
  var $module = this.$module
  if ($module.addEventListener) {
    // W3C event model
    //
    // countElementExtended.countElement.addEventListener('input', this.handleInput.bind(countElementExtended))
    // countElementExtended.countElement.addEventListener('onpropertychange', this.updateCountMessage.bind(countElementExtended))
    //
    // IE 9 does not fire an input event when the user deletes characters from
    // an input (e.g. by pressing Backspace or Delete, or using the "Cut" operation).
    $module.addEventListener('keyup', this.updateCountMessage.bind(this))
  } else {
    // Microsoft event model: onpropertychange/onkeyup
    $module.attachEvent('onkeyup', this.handleInput.bind(this))
  }

  // Bind scroll event if highlight is set
  if (this.options.highlight) {
    $module.addEventListener('scroll', this.handleScroll.bind(this))
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  // Bind focus/blur events to start/stop polling
  $module.addEventListener('focus', this.handleFocus.bind(this))
  $module.addEventListener('blur', this.handleBlur.bind(this))
}

// Speech recognition software such as Dragon NaturallySpeaking will modify the
// fields by directly changing its `value`. These changes don't trigger events
// in JavaScript, so we need to poll to handle when and if they occur.
CharacterCount.prototype.checkIfValueChanged = function () {
  if (!this.oldValue) this.oldValue = ''
  if (this.$module.value !== this.oldValue) {
    this.oldValue = this.$module.value
    var boundUpdateCountMessage = this.updateCountMessage.bind(this)
    boundUpdateCountMessage()
  }
}

// Update message box
CharacterCount.prototype.updateCountMessage = function () {
  var countElement = this.$module
  var options = this.options
  var countMessage = this.countMessage
  var countHighlight = this.countHighlight

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
    countElement.classList.add('govuk-character-count--error')
    if (options.validation) {
      countElement.parentNode.parentNode.classList.add('govuk-form-group--error')
    }
    countMessage.classList.remove('govuk-hint')
    countMessage.classList.add('govuk-error-message')
  } else {
    countElement.classList.remove('govuk-character-count--error')
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
  displayNumber = Math.abs(remainingNumber) // postive count of numbers

  countMessage.innerHTML = 'You have ' + displayNumber + ' ' + charNoun + ' ' + charVerb

  // Update highlight
  if (countHighlight) {
    var highlightedText = this.highlight(countElement.value, maxLength)
    countHighlight.innerHTML = highlightedText
  }
}

// Check if value changed after input triggered
CharacterCount.prototype.handleInput = function () {
  var boundCheckIfValueChanged = this.checkIfValueChanged.bind(this)
  boundCheckIfValueChanged()
}

CharacterCount.prototype.handleFocus = function () {
  // Check if value changed on focus
  this.valueChecker = setInterval(this.checkIfValueChanged.bind(this), 1000)

  // Set the height properly when the component is hidden at load time
  if (this.options.highlight) {
    var boundHandleResize = this.handleResize.bind(this)
    boundHandleResize()
  }
}

CharacterCount.prototype.handleBlur = function () {
  // Cancel value checking on blur
  clearInterval(this.valueChecker)
}

// Sync field scroll with the backdrop highlight scroll
CharacterCount.prototype.handleScroll = function () {
  this.countHighlight.scrollTop = this.$module.scrollTop
  this.countHighlight.scrollLeft = this.$module.scrollLeft
}

// Update element's height after window resize
CharacterCount.prototype.handleResize = function () {
  this.countHighlight.style.height = this.$module.getBoundingClientRect().height + 'px'
  this.countHighlight.style.width = this.$module.getBoundingClientRect().width + 'px'
}

export default CharacterCount
