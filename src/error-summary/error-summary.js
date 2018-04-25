function ErrorSummary ($module) {
  this.$module = $module
}

ErrorSummary.prototype.init = function () {
  var $module = this.$module
  if (!$module) {
    return
  }
  window.addEventListener('load', function () {
    $module.focus()
  })
}

export default ErrorSummary
