
;(function (global) {
  'use strict'

  var APP = global.APP || {}

  APP.helpers = {
    addEvent: function (node, event, fn) {
      if (node.attachEvent) {
        return node.attachEvent('on' + event, fn)
      } else {
        return node.addEventListener(event, fn, false)
      }
    },
    hasClass: function (el, className) {
      if (el.classList) {
        return el.classList.contains(className)
      } else {
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
      }
    },
    addClass: function (el, className) {
      if (el.classList) {
        el.classList.add(className)
      } else if (!APP.helpers.hasClass(el, className)) el.className += ' ' + className
    },
    removeClass: function (el, className) {
      if (el.classList) {
        el.classList.remove(className)
      } else if (APP.helpers.hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className = el.className.replace(reg, ' ')
      }
    }
  }

  APP.functions = {
    toggleContainerWidth: function () {
      var el = document.querySelector('.js-toggle-component-width')
      var container = document.querySelector('.govuk-o-width-container')
      APP.helpers.addEvent(el, 'click', function () {
        if (APP.helpers.hasClass(container, 'govuk-o-width-container')) {
          APP.helpers.removeClass(container, 'govuk-o-width-container')
        } else {
          APP.helpers.addClass(container, 'govuk-o-width-container')
        }
      })
    },
    init: function () {
      APP.functions.toggleContainerWidth()
    }
  }

  // hand back to global
  global.APP = APP

  // auto-initialise
  APP.functions.init()
})(window)
