var DATE_REGEX = /^[\s]*([0-9]{1,2})([ /\-\.])([0-9]{1,2})(\2)([0-9]{4})[\s]*$/

function DateInput ($module) {
  this.$module = $module
}

DateInput.prototype.handlePaste = function (event) {
  var paste = (event.clipboardData || window.clipboardData).getData('text')
  var $inputs = this.$module.querySelectorAll('input')

  var match = paste.match(DATE_REGEX)

  if (match) {
    event.preventDefault()

    var [_, day, _, month, _, year] = match

    $inputs[0].value = day .padStart(2,0)
    $inputs[1].value = month.padStart(2,0)
    $inputs[2].value = year

    $inputs[2].focus()
  }
}

DateInput.prototype.init = function () {
  this.$module.addEventListener('paste', this.handlePaste.bind(this))
}

export default DateInput
