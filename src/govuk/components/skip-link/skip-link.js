function SkipLink ($module) {
  this.$module = $module
}

/**
 * Initialise the component
 */
SkipLink.prototype.init = function () {
  var $module = this.$module
  // Check for module
  if (!$module) {
    return
  }
}

export default SkipLink
