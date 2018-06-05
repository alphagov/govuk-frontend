import { nodeListForEach } from './common'
import Button from './components/button/button'
import Details from './components/details/details'
import Checkboxes from './components/checkboxes/checkboxes'
import ErrorSummary from './components/error-summary/error-summary'
import Header from './components/header/header'
import Radios from './components/radios/radios'

function initAll () {
  new Button(document).init()

  var $details = document.querySelectorAll('details')
  nodeListForEach($details, function ($detail) {
    new Details($detail).init()
  })

  var $checkboxes = document.querySelectorAll('[data-module="checkboxes"]')
  nodeListForEach($checkboxes, function ($checkbox) {
    new Checkboxes($checkbox).init()
  })

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
