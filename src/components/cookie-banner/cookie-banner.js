;(function () {
  'use strict'
  var root = this
  if (typeof root.GOVUK === 'undefined') { root.GOVUK = {} }

  /*
    Cookie methods
    ==============

    Usage:

      Setting a cookie:
      GOVUK.cookie('hobnob', 'tasty', { days: 30 });

      Reading a cookie:
      GOVUK.cookie('hobnob');

      Deleting a cookie:
      GOVUK.cookie('hobnob', null);
  */
  root.GOVUK.cookie = function (name, value, options) {
    if (typeof value !== 'undefined') {
      if (value === false || value === null) {
        return root.GOVUK.setCookie(name, '', { days: -1 })
      } else {
        return root.GOVUK.setCookie(name, value, options)
      }
    } else {
      return root.GOVUK.getCookie(name)
    }
  }
  root.GOVUK.setCookie = function (name, value, options) {
    if (typeof options === 'undefined') {
      options = {}
    }
    var cookieString = name + '=' + value + '; path=/'
    if (options.days) {
      var date = new Date()
      date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000))
      cookieString = cookieString + '; expires=' + date.toGMTString()
    }
    if (document.location.protocol === 'https:') {
      cookieString = cookieString + '; Secure'
    }
    document.cookie = cookieString
  }
  root.GOVUK.getCookie = function (name) {
    var nameEQ = name + '='
    var cookies = document.cookie.split(';')
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i]
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length)
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length))
      }
    }
    return null
  }
  root.GOVUK.addCookieMessage = function () {
    var message = document.getElementsByClassName('js-cookie-banner')[0]
    var hasCookieMessage = (message && root.GOVUK.cookie('seen_cookie_message') === null)

    if (hasCookieMessage) {
      message.style.display = 'block'
      root.GOVUK.cookie('seen_cookie_message', 'yes', { days: 28 })
    }
  }
  // add cookie message
  if (root.GOVUK && root.GOVUK.addCookieMessage) {
    root.GOVUK.addCookieMessage()
  }
}).call(this)
