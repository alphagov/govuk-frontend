import '../../../vendor/polyfills/Function/prototype/bind'
import '../../../vendor/polyfills/Event' // addEventListener and event.target normalization

function SdnHeader ($module) {
  this.$module = $module
  this.$menu = null
  this.$menuButton = null
}

SdnHeader.prototype.init = function () {
  // Check for module
  var $module = this.$module
  if (!$module) {
    return
  }

  var $toggles = $module.querySelectorAll(".js-dropdown-toggle")
  for (var i = 0; i < $toggles.length; i++) {
    // IE11 doesn't support .forEach on NodeList returned by querySelectorAll
    this.setupDropdown($toggles.item(i))
  }

  var $menuToggleButton = $module.querySelector('.js-header-toggle')
  if ($menuToggleButton) {
    this.setupMenuButton($menuToggleButton);
  }
}

SdnHeader.prototype.toggleClass = function (node, className) {
  if (node.className.indexOf(className) > 0) {
    node.className = node.className.replace(' ' + className, '')
  } else {
    node.className += ' ' + className
  }
}

SdnHeader.prototype.setupDropdown = function($node) {
  var $module = this.$module
  var $dropdown = $module.querySelector('#' + $node.getAttribute('aria-controls'))
  var blurEnabled = true
  $node.addEventListener("click", function(e) {
    if ($dropdown.style.display === "block") {
      $dropdown.style.display = "none";
    } else {
      $dropdown.style.display = "block";
    }

    e.target.addEventListener("blur", function() {
      if (blurEnabled) {
        $dropdown.style.display = "none";
      }
    })
  })
  $node.addEventListener("blur", function() {
    if (blurEnabled) {
      $dropdown.style.display = "none";
    }
  })
  $dropdown.addEventListener("mouseenter", function() {
    blurEnabled = false
  })
  $dropdown.addEventListener("mouseleave", function() {
    blurEnabled = true
  })

  var $links = $dropdown.querySelectorAll('.sdn-header__dropdown a')
  for (var i = 0; i < $links.length; i++) {
    // IE11 doesn't support .forEach on NodeList returned by querySelectorAll
    var $node = $links.item(i)
    $node.addEventListener('click', function () {
      $dropdown.style.display = 'none'
      blurEnabled = true
      this.toggleMenu()
    }.bind(this))
  }
}

SdnHeader.prototype.setupMenuButton = function ($toggleButton) {
  var $module = this.$module
  this.$menu = $module.querySelector('#' + $toggleButton.getAttribute('aria-controls'))
  this.$menuButton = $toggleButton

  $toggleButton.addEventListener("click", this.toggleMenu.bind(this))
}

SdnHeader.prototype.toggleMenu = function() {
  if (this.$menu && this.$menuButton) {
    this.toggleClass(this.$menu, "sdn-header__navigation--open")
    this.toggleClass(this.$menuButton, "sdn-header__navigation--open")

    this.$menuButton.setAttribute('aria-expanded', this.$menuButton.getAttribute('aria-expanded') !== 'true')
    this.$menu.setAttribute('aria-hidden', this.$menu.getAttribute('aria-hidden') === 'false')
  }
}

export default SdnHeader
