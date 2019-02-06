import { nodeListForEach } from './common'
import Accordion from './components/accordion/accordion'
import Button from './components/button/button'
import Details from './components/details/details'
import CharacterCount from './components/character-count/character-count'
import Checkboxes from './components/checkboxes/checkboxes'
import ErrorSummary from './components/error-summary/error-summary'
import Header from './components/header/header'
import Radios from './components/radios/radios'
import Tabs from './components/tabs/tabs'

function initAll () {
  // Find all buttons with [role=button] on the document to enhance.
  var $buttons = document.querySelectorAll('button, input[type="button"], [role="button"]')
  nodeListForEach($buttons, function ($button) {
    new Button($button).init()
  })

  // Find all global accordion components to enhance.
  var $accordions = document.querySelectorAll('[data-module="accordion"]')
  nodeListForEach($accordions, function ($accordion) {
    new Accordion($accordion).init()
  })

  // Find all global details elements to enhance.
  var $details = document.querySelectorAll('details')
  nodeListForEach($details, function ($detail) {
    new Details($detail).init()
  })

  var $characterCount = document.querySelectorAll('[data-module="character-count"]')
  nodeListForEach($characterCount, function ($characterCount) {
    new CharacterCount($characterCount).init()
  })

  var $checkboxes = document.querySelectorAll('[data-module="checkboxes"]')
  nodeListForEach($checkboxes, function ($checkbox) {
    new Checkboxes($checkbox).init()
  })

  // Find first error summary module to enhance.
  var $errorSummary = document.querySelector('[data-module="error-summary"]')
  new ErrorSummary($errorSummary).init()

  // Find first header module to enhance.
  var $toggleButton = document.querySelector('[data-module="header"]')
  new Header($toggleButton).init()

  var $radios = document.querySelectorAll('[data-module="radios"]')
  nodeListForEach($radios, function ($radio) {
    new Radios($radio).init()
  })

  var $tabs = document.querySelectorAll('[data-module="tabs"]')
  nodeListForEach($tabs, function ($tabs) {
    new Tabs($tabs).init()
  })
}

export {
  initAll,
  Button,
  Details,
  CharacterCount,
  Checkboxes,
  ErrorSummary,
  Header,
  Radios,
  Tabs
}
