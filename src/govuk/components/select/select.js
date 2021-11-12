import '../../vendor/polyfills/Function/prototype/bind'
// addEventListener, event.target normalization and DOMContentLoaded
import '../../vendor/polyfills/Event'
import '../../vendor/polyfills/Element/prototype/classList'
import { nodeListForEach } from '../../common'

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

  var $dropDownArrow = document.createElement('div')
  $dropDownArrow.setAttribute('class', 'govuk-select__drop-down-arrow')

  this.$ul = document.createElement('ul')
  this.$ul.setAttribute('id', $module.getAttribute('id') + '-listbox')
  this.$ul.addEventListener('click', this.handleOptionClicked.bind(this))
  this.$ul.addEventListener('keydown',this.handleOptionsKeyDown.bind(this))
  this.$ul.hidden = true
  this.$ul.setAttribute('class', 'govuk-select__option-list')
  this.$ul.setAttribute('role', 'listbox')

  this.$wrapper.appendChild($dropDownArrow)
  this.$wrapper.appendChild(this.$input)
  this.$wrapper.appendChild(this.$ul)

  $module.parentNode.insertBefore(this.$wrapper, $module)
  $module.style.display = 'none'
  $module.setAttribute('id', $module.getAttribute('id') + '-select')

  document.addEventListener('click', this.handleDocumentClick.bind(this))
}

Select.prototype.updateOptions = function(showAllOptions) {
  this.$ul.textContent = ''

  var options = this.$module.options

  for (var opt of options) {
    if (
      (opt.value != '') &&
      (
        this.$input.value == '' ||
        showAllOptions ||
        (opt.textContent.toLowerCase().indexOf(this.$input.value.toLowerCase()) > -1)
      )
    ) {

      var li = document.createElement('li')
      li.textContent = opt.textContent
      li.setAttribute('role', 'option')
      li.setAttribute('tabindex', '-1')
      li.setAttribute('aria-selected', opt.value == this.$module.value)
      li.setAttribute('data-value', opt.value)
      li.setAttribute('class', 'govuk-select__option')
      li.addEventListener('mouseenter', this.handleMouseEntered.bind(this))
      this.$ul.appendChild(li)
    }
  }
}


Select.prototype.handleInputKeyDown = function(event) {
  switch (event.keyCode) {
    // Down
    case 40:
      if (this.$ul.hidden == true) {
        this.updateOptions(true)
      } else {
        this.updateOptions(false)
      }
      this.moveFocusToOptions()
      event.preventDefault()
      break
    // Tab
    case 9:
      break
    // Up
    case 38:
      if (this.$ul.hidden == true) {
        this.updateOptions(true)
      } else {
        this.updateOptions(false)
      }
      this.moveFocusToOptions(false)
      event.preventDefault()
      break
    default:
      this.updateOptions(false)
      this.displayList()
  }
}

Select.prototype.handleOptionsKeyDown = function(event) {
  switch (event.keyCode) {
    // Down
    case 40:
      var optionSelected = this.$ul.querySelector('li:focus')

      if (optionSelected.nextSibling) {
        optionSelected.nextSibling.focus()
      } else {
        this.$ul.getElementsByTagName("li")[0].focus()
      }
      event.preventDefault()
      break
    // Up
    case 38:
      var optionSelected = this.$ul.querySelector('li:focus')
      if (optionSelected.previousSibling) {
        optionSelected.previousSibling.focus()
      } else {
        this.$ul.getElementsByTagName("li")[this.$ul.getElementsByTagName("li").length - 1].focus()
      }
      event.preventDefault()
      break
    // Enter
    case 13:
      var optionSelected = this.$ul.querySelector('li:focus')
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

Select.prototype.handleInputClick = function() {
  this.updateOptions(true)
  this.displayList()
}

Select.prototype.moveFocusToOptions = function(defaultToFirstItem = true) {
  this.displayList()

  if (this.$module.value != '') {
    var currentlySelectedOption = this.$ul.querySelector('li[data-value="' + this.$module.value + '"]')
  }

  if (currentlySelectedOption) {
    currentlySelectedOption.focus()
  } else if (defaultToFirstItem) {
    this.$ul.getElementsByTagName('li')[0].focus()
  } else {
    this.$ul.getElementsByTagName("li")[this.$ul.getElementsByTagName("li").length - 1].focus()
  }
}

Select.prototype.handleOptionClicked = function(event) {
  var optionSelected = event.target
  this.selectOption(optionSelected)
}

Select.prototype.selectOption = function(option) {
  // Un-select any previously selected option
  var previouslySelected = this.$ul.querySelector('li[aria-selected=true]')
  if (previouslySelected) {
    previouslySelected.setAttribute('aria-selected', 'false')
  }

  option.setAttribute('aria-selected', 'true')
  this.$input.value = option.textContent;
  this.$module.value = option.getAttribute('data-value')

  this.$input.focus()
  this.hideList()

}

Select.prototype.displayList = function() {
  this.$ul.hidden = false
  this.$wrapper.setAttribute('aria-expanded', 'true')
}

Select.prototype.hideList = function() {
  this.$ul.hidden = true
  this.$wrapper.setAttribute('aria-expanded', 'false')
}

Select.prototype.revertInputToCurrentlySelectedOption = function() {
  if (this.$module.value != '') {
    var currentlySelectedOption = this.$ul.querySelector('li[data-value="' + this.$module.value + '"]')
    this.$input.value = currentlySelectedOption.textContent
  }
}

Select.prototype.handleMouseEntered = function(event) {
  var optionHovered = event.target
  optionHovered.focus()
}

Select.prototype.handleDocumentClick = function(event) {
  var elementClicked = event.target
  if (!this.$wrapper.contains(elementClicked)) {
    this.revertInputToCurrentlySelectedOption()
    this.hideList()
  }
}

export default Select
