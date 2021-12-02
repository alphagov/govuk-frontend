import '../../vendor/polyfills/Function/prototype/bind'
// addEventListener, event.target normalization and DOMContentLoaded
import '../../vendor/polyfills/Event'
import '../../vendor/polyfills/Element/prototype/classList'

function Select ($module) {
  this.$module = $module
}

/**
 * Initialise Select
 *
 */
Select.prototype.init = function () {
  var $module = this.$module

  this.$wrapper = document.createElement('div')
  this.$wrapper.setAttribute('role', 'combobox')
  this.$wrapper.setAttribute('aria-owns', $module.getAttribute('id'))
  this.$wrapper.setAttribute('aria-haspopup', 'listbox')
  this.$wrapper.setAttribute('aria-expanded', 'false')
  this.$wrapper.setAttribute('class', 'govuk-select__wrapper')

  this.$input = document.createElement('input')
  this.$input.setAttribute('type', 'text')
  this.$input.setAttribute('id', $module.getAttribute('id'))
  this.$input.setAttribute('class', 'govuk-input govuk-select__input')
  this.$input.setAttribute('autocomplete', 'off')
  this.$input.setAttribute('name', $module.getAttribute('name'))
  this.$input.setAttribute('aria-autocomplete', 'list')
  this.$input.setAttribute('aria-controls', $module.getAttribute('id') + '-listbox')

  this.$input.addEventListener('click', this.handleInputClick.bind(this))
  this.$input.addEventListener('keydown', this.handleInputKeyDown.bind(this))
  this.$input.addEventListener('input', this.handleInputInput.bind(this))

  var $dropDownArrow = document.createElement('div')
  $dropDownArrow.setAttribute('class', 'govuk-select__drop-down-arrow')

  this.$ul = document.createElement('ul')
  this.$ul.setAttribute('id', $module.getAttribute('id') + '-listbox')
  this.$ul.addEventListener('click', this.handleOptionClicked.bind(this))
  this.$ul.addEventListener('keydown', this.handleOptionsKeyDown.bind(this))
  this.$ul.hidden = true
  this.$ul.setAttribute('class', 'govuk-select__option-list')
  this.$ul.setAttribute('role', 'listbox')

  this.$wrapper.appendChild(this.$input)
  this.$wrapper.appendChild($dropDownArrow)
  this.$wrapper.appendChild(this.$ul)

  $module.parentNode.insertBefore(this.$wrapper, $module)
  $module.style.display = 'none'
  $module.setAttribute('id', $module.getAttribute('id') + '-select')

  document.addEventListener('click', this.handleDocumentClick.bind(this))
}

Select.prototype.updateOptions = function (showAllOptions) {
  // Remove all the existing suggestions
  this.$ul.textContent = ''

  // Filter to only options with a non-blank value. Often the first option is blank to avoid
  // setting an initial default option.
  var optionsWithAValue = [].filter.call(this.$module.options, function (option) {
    return option.value !== ''
  })

  // Build an array of regexes that search for each word of the query
  var queryRegexes = this.$input.value.trim()
    .replace(/['’]/g, '')
    .replace(/[.,"/#!$%^&*;:{}=\-_~()]/g, ' ')
    .split(/\s+/).map(function (word) {
      return new RegExp('\\b' + word, 'i')
    })

  var matchingOptions = []

  for (var option of optionsWithAValue) {
    var optionTextAndSynonyms = [option.textContent]
    var synonyms = option.getAttribute('data-synonyms')

    if (synonyms) {
      optionTextAndSynonyms = optionTextAndSynonyms.concat(synonyms.split('|'))
    }

    if (
      this.$input.value === '' ||
      showAllOptions ||
      (
        optionTextAndSynonyms.find(function (name) {
          return (queryRegexes.filter(function (regex) { return name.search(regex) >= 0 }).length === queryRegexes.length)
        })
      )
    ) { matchingOptions.push(option) }
  }

  if (matchingOptions.length > 0) {
    this.updateSuggestionsWithOptions(matchingOptions)
  } else {
    this.displayNoSuggestionsFound()
  }
}

Select.prototype.updateSuggestionsWithOptions = function (options) {
  for (var option of options) {
    var li = document.createElement('li')
    li.textContent = option.textContent
    li.setAttribute('role', 'option')
    li.setAttribute('tabindex', '-1')
    li.setAttribute('aria-selected', option.value === this.$module.value)
    li.setAttribute('data-value', option.value)
    li.setAttribute('class', 'govuk-select__option')
    li.addEventListener('mouseenter', this.handleMouseEntered.bind(this))
    this.$ul.appendChild(li)
  }
}

Select.prototype.displayNoSuggestionsFound = function () {
  var noResults = document.createElement('li')
  noResults.setAttribute('class', 'govuk-select__option govuk-select__option--no-results')
  noResults.textContent = 'No results'
  this.$ul.appendChild(noResults)
}

// On key down, check if the key pressed an up/down arrow or tab
Select.prototype.handleInputKeyDown = function (event) {
  switch (event.keyCode) {
    // Down
    case 40:
      if (this.$ul.hidden === true) {
        this.updateOptions(true)
      }
      // Move focus to first option if there are any.
      if (this.$ul.querySelector('li[role="option"]')) {
        this.moveFocusToOptions()
      }
      event.preventDefault()
      break
    // Up
    case 38:
      if (this.$ul.hidden === true) {
        this.updateOptions(true)
      } else {
        this.updateOptions(false)
      }

      // Move focus to last option if there are any.
      if (this.$ul.querySelector('li[role="option"]')) {
        this.moveFocusToOptions(false)
      }
      event.preventDefault()
      break
    // Tab
    case 9:
      this.$ul.hidden = true
      break
  }
}

// On input, update the options and display the list
Select.prototype.handleInputInput = function (event) {
  this.updateOptions(false)
  this.displayList()
}

// On keydown when focused on an option, check if the key
// was:
// * an arrow – if so move the focus
// * enter - select the focused option
// * escape - hide the options and revert to selected option
// * any other character - return focus to the input
//
// Note: this has to be triggered on keydown instead of keyup so that if another
// character is pressed, the focus can be moved to the input before the keyup event
// is fired, allowing the character to be entered into the input.
Select.prototype.handleOptionsKeyDown = function (event) {
  var optionSelected
  switch (event.keyCode) {
    // Down
    case 40:
      optionSelected = this.$ul.querySelector('li:focus')

      if (optionSelected.nextSibling) {
        optionSelected.nextSibling.focus()
      }
      event.preventDefault()
      break
    // Up
    case 38:
      optionSelected = this.$ul.querySelector('li:focus')
      if (optionSelected.previousSibling) {
        optionSelected.previousSibling.focus()
      } else {
        this.$input.focus()
      }
      event.preventDefault()
      break
    // Enter
    case 13:
      optionSelected = this.$ul.querySelector('li:focus')
      this.selectOption(optionSelected)
      event.preventDefault()
      break
    // Escape
    case 27:
      this.revertInputToCurrentlySelectedOption()
      this.hideList()
      this.$input.focus()
      event.preventDefault()
      break
    default:
      this.$input.focus()
      // console.log(event.keyCode)
  }
}

Select.prototype.handleInputClick = function () {
  this.updateOptions(true)
  this.displayList()
}

Select.prototype.moveFocusToOptions = function (defaultToFirstItem = true) {
  this.displayList()

  if (this.$module.value !== '') {
    var currentlySelectedOption = this.$ul.querySelector('li[data-value="' + this.$module.value + '"]')
  }

  if (currentlySelectedOption) {
    currentlySelectedOption.focus()
  } else if (defaultToFirstItem) {
    this.$ul.getElementsByTagName('li')[0].focus()
  } else {
    this.$ul.getElementsByTagName('li')[this.$ul.getElementsByTagName('li').length - 1].focus()
  }
}

Select.prototype.handleOptionClicked = function (event) {
  var optionSelected = event.target
  this.selectOption(optionSelected)
}

Select.prototype.selectOption = function (option) {
  // Un-select any previously selected option
  var previouslySelected = this.$ul.querySelector('li[aria-selected=true]')
  if (previouslySelected) {
    previouslySelected.setAttribute('aria-selected', 'false')
  }

  option.setAttribute('aria-selected', 'true')
  this.$input.value = option.textContent
  this.$module.value = option.getAttribute('data-value')

  this.$input.focus()
  this.hideList()
}

Select.prototype.displayList = function () {
  this.$ul.hidden = false
  this.$wrapper.setAttribute('aria-expanded', 'true')
}

Select.prototype.hideList = function () {
  this.$ul.hidden = true
  this.$wrapper.setAttribute('aria-expanded', 'false')
}

Select.prototype.revertInputToCurrentlySelectedOption = function () {
  if (this.$module.selectedOptions.length === 1) {
    this.$input.value = this.$module.selectedOptions[0].textContent
  }
}

Select.prototype.clearInput = function () {
  this.$module.value = ''
  this.$input.value = ''
}

Select.prototype.handleMouseEntered = function (event) {
  var optionHovered = event.target
  optionHovered.focus()
}

Select.prototype.handleDocumentClick = function (event) {
  var elementClicked = event.target
  if (!this.$wrapper.contains(elementClicked)) {
    if (this.$module.value !== '' && this.$input.value !== '') {
      this.revertInputToCurrentlySelectedOption()
    } else {
      this.clearInput()
    }
    this.hideList()
  }
}

export default Select
