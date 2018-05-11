import { nodeListForEach } from './globals/common'
import Button from './components/button/button'
import Details from './components/details/details'
import Checkboxes from './components/checkboxes/checkboxes'
import ErrorSummary from './components/error-summary/error-summary'
import Radios from './components/radios/radios'

export function initAll () {
  new Button().init()
  new Details().init()

  var $checkboxes = document.querySelectorAll('[data-module="checkboxes"]')
  nodeListForEach($checkboxes, function ($checkbox) {
    new Checkboxes($checkbox).init()
  })

  // Find first Error Summary module to enhance.
  var $errorSummary = document.querySelector('[data-module="error-summary"]')
  new ErrorSummary($errorSummary).init()

  var $radios = document.querySelectorAll('[data-module="radios"]')
  nodeListForEach($radios, function ($radio) {
    new Radios($radio).init()
  })
}

(initAll())
