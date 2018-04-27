import { nodeListForEach } from './globals/common'
import Button from './button/button'
import Details from './details/details'
import Checkboxes from './checkboxes/checkboxes'
import ErrorSummary from './error-summary/error-summary'
import Radios from './radios/radios'

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
