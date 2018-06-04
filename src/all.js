import { nodeListForEach } from './common'
import Button from './components/button/button'
import Details from './components/details/details'
import Checkboxes from './components/checkboxes/checkboxes'
import CookieBanner from './components/cookie-banner/cookie-banner'
import ErrorSummary from './components/error-summary/error-summary'
import Header from './components/header/header'
import Radios from './components/radios/radios'

function initAll () {
  new Button().init()
  new Details().init()

  var $checkboxes = document.querySelectorAll('[data-module="checkboxes"]')
  nodeListForEach($checkboxes, function ($checkbox) {
    new Checkboxes($checkbox).init()
  })

  // Find first Cookie Banner module to enhance.
  var $cookieBanner = document.querySelector('[data-module="cookie-banner"]')
  new CookieBanner($cookieBanner).init()

  // Find first Error Summary module to enhance.
  var $errorSummary = document.querySelector('[data-module="error-summary"]')
  new ErrorSummary($errorSummary).init()

  // Find first header module to enhance.
  var $toggleButton = document.querySelector('[data-module="header"]')
  new Header($toggleButton).init()

  var $radios = document.querySelectorAll('[data-module="radios"]')
  nodeListForEach($radios, function ($radio) {
    new Radios($radio).init()
  })
}

export {
  initAll,
  Button,
  Details,
  Checkboxes,
  ErrorSummary,
  Header,
  Radios
}
