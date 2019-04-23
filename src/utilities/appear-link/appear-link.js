function SndAppearLink ($module) {
  this.$module = $module
  this.$appear = null
  this.$disappear = null
}

SndAppearLink.prototype.init = function () {
  // Check for module
  var $module = this.$module
  if (!$module) {
    return
  }

  $module.addEventListener('click', this.handleClick.bind(this))
  var appearId = $module.dataset['appear']
  var disappearId = $module.dataset['disappear']

  this.$appear = document.getElementById(appearId)
  this.$disappear = document.getElementById(disappearId)
}

SndAppearLink.prototype.handleClick = function (event) {
  event.preventDefault()

  if (this.$appear) {
    this.$appear.classList.remove('sdn-appear-link-hide')
  }
  if (this.$disappear) {
    this.$disappear.classList.add('sdn-appear-link-hide')
  }
}

export default SndAppearLink
