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
import SdnHeader from './components/_custom/header/header'
import SdnTimeline from './components/_custom/timeline/timeline'
import SdnAppearLink from './utilities/appear-link/appear-link'

function initAll (options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {}

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document

  // Find all buttons with [role=button] on the scope to enhance.
  new Button(scope).init()

  // Find all global accordion components to enhance.
  var $accordions = scope.querySelectorAll('[data-module="accordion"]')
  nodeListForEach($accordions, function ($accordion) {
    new Accordion($accordion).init()
  })

  // Find all global details elements to enhance.
  var $details = scope.querySelectorAll('details')
  nodeListForEach($details, function ($detail) {
    new Details($detail).init()
  })

  var $characterCount = scope.querySelectorAll('[data-module="character-count"]')
  nodeListForEach($characterCount, function ($characterCount) {
    new CharacterCount($characterCount).init()
  })

  var $checkboxes = scope.querySelectorAll('[data-module="checkboxes"]')
  nodeListForEach($checkboxes, function ($checkbox) {
    new Checkboxes($checkbox).init()
  })

  // Find first error summary module to enhance.
  var $errorSummary = scope.querySelector('[data-module="error-summary"]')
  new ErrorSummary($errorSummary).init()

  // Find first header module to enhance.
  var $toggleButton = scope.querySelector('[data-module="header"]')
  new Header($toggleButton).init()

  var $radios = scope.querySelectorAll('[data-module="radios"]')
  nodeListForEach($radios, function ($radio) {
    new Radios($radio).init()
  })

  var $tabs = scope.querySelectorAll('[data-module="tabs"]')
  nodeListForEach($tabs, function ($tabs) {
    new Tabs($tabs).init()
  })

  // Find first sdn header module to enhance.
  new SdnHeader(document.querySelector('[data-module="sdn-header"]')).init()

  // Find first sdn header module to enhance.
  new SdnTimeline(document.querySelector('[data-module="sdn-timeline"]')).init()

  var $appearLinks = document.querySelectorAll('[data-module="sdn-appear-link"]')
  nodeListForEach($appearLinks, function ($link) {
    new SdnAppearLink($link).init()
  })
}

export {
  initAll,
  Accordion,
  Button,
  Details,
  CharacterCount,
  Checkboxes,
  ErrorSummary,
  Header,
  Radios,
  Tabs,
  SdnHeader,
  SdnTimeline
}
