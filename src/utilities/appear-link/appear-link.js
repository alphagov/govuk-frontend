function SndAppearLink($module) {
  console.log($module);
  this.$module = $module;
  this.$appear = null;
  this.$disappear = null;
}

SndAppearLink.prototype.init = function() {
  // Check for module
  var $module = this.$module;
  if (!$module) {
    return;
  }

  $module.addEventListener("click", this.handleClick.bind(this));
  var appearId = $module.dataset["appear"];
  var disappearId = $module.dataset["disappear"];

  this.$appear = document.getElementById(appearId);
  this.$disappear = document.getElementById(disappearId);

  console.log($module, appearId, disappearId, this.$appear, this.$disappear);
};

SndAppearLink.prototype.handleClick = function(event) {
  event.preventDefault();

  if (this.$appear) {
    this.$appear.classList.remove("appear-link-hide");
    this.$appear.classList.add("appear-link-show");
  }
  if (this.$disappear) {
    this.$disappear.classList.remove("appear-link-show");
    this.$disappear.classList.add("appear-link-hide");
  }
  console.log(this.$appear, this.$disappear);

  // this.parentNode.classList.toggle("sdn-timeline__step--dropdown-active");
};

// SndAppearLink.prototype.handleBlur = function (event) {
//   event.preventDefault()

//   setTimeout(function () {
//     this.parentNode.classList.remove('sdn-timeline__step--dropdown-active')
//   }.bind(this), 100)
// }

export default SndAppearLink;
