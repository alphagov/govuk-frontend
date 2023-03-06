import { nodeListForEach } from './common/index.mjs'
import Accordion from './components/accordion/accordion.mjs'
import Button from './components/button/button.mjs'
import CharacterCount from './components/character-count/character-count.mjs'
import Checkboxes from './components/checkboxes/checkboxes.mjs'
import Details from './components/details/details.mjs'
import ErrorSummary from './components/error-summary/error-summary.mjs'
import Header from './components/header/header.mjs'
import NotificationBanner from './components/notification-banner/notification-banner.mjs'
import Radios from './components/radios/radios.mjs'
import SkipLink from './components/skip-link/skip-link.mjs'
import Tabs from './components/tabs/tabs.mjs'

/**
 * Initialise all components
 *
 * Use the `data-module` attributes to find, instantiate and init all of the
 * components provided as part of GOV.UK Frontend.
 *
 * @param {Config} [config] - Config for all components
 */
function initAll (config) {
  config = typeof config !== 'undefined' ? config : {}

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var $scope = config.scope instanceof HTMLElement ? config.scope : document

  withEvents($scope, 'init', { $scope, config }, function () {
    var $accordions = $scope.querySelectorAll('[data-module="govuk-accordion"]')
    nodeListForEach($accordions, function ($accordion) {
      new Accordion($accordion, config.accordion).init()
    })

    var $buttons = $scope.querySelectorAll('[data-module="govuk-button"]')
    nodeListForEach($buttons, function ($button) {
      new Button($button, config.button).init()
    })

    var $characterCounts = $scope.querySelectorAll(
      '[data-module="govuk-character-count"]'
    )
    nodeListForEach($characterCounts, function ($characterCount) {
      new CharacterCount($characterCount, config.characterCount).init()
    })

    var $checkboxes = $scope.querySelectorAll(
      '[data-module="govuk-checkboxes"]'
    )
    nodeListForEach($checkboxes, function ($checkbox) {
      new Checkboxes($checkbox).init()
    })

    var $details = $scope.querySelectorAll('[data-module="govuk-details"]')
    nodeListForEach($details, function ($detail) {
      new Details($detail).init()
    })

    // Find first error summary module to enhance.
    var $errorSummary = $scope.querySelector(
      '[data-module="govuk-error-summary"]'
    )
    if ($errorSummary) {
      new ErrorSummary($errorSummary, config.errorSummary).init()
    }

    // Find first header module to enhance.
    var $header = $scope.querySelector('[data-module="govuk-header"]')
    if ($header) {
      new Header($header).init()
    }

    var $notificationBanners = $scope.querySelectorAll(
      '[data-module="govuk-notification-banner"]'
    )
    nodeListForEach($notificationBanners, function ($notificationBanner) {
      new NotificationBanner(
        $notificationBanner,
        config.notificationBanner
      ).init()
    })

    var $radios = $scope.querySelectorAll('[data-module="govuk-radios"]')
    nodeListForEach($radios, function ($radio) {
      new Radios($radio).init()
    })

    // Find first skip link module to enhance.
    var $skipLink = $scope.querySelector('[data-module="govuk-skip-link"]')
    if ($skipLink) {
      new SkipLink($skipLink).init()
    }

    var $tabs = $scope.querySelectorAll('[data-module="govuk-tabs"]')
    nodeListForEach($tabs, function ($tabs) {
      new Tabs($tabs).init()
    })
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
  NotificationBanner,
  Radios,
  SkipLink,
  Tabs
}

/**
 * Surrounds the given `callback` with events notifying:
 *
 * - its upcoming execution with a `before-<action-name>` event (cancellable)
 * - its cancellation with a `prevented-<action-name>` event
 * - the start of its execution with an `<action-name>` event
 * - the end of its execution with an `after-<action-name>` event
 *
 * @param {EventTarget} $element
 * @param {string} actionName
 * @param {Object<string,any>} detail
 * @param {Function} callback
 * @returns {any} Whatever the callback returns
 */
function withEvents ($element, actionName, detail, callback) {
  // Create a cancellable event that allows other scripts to cancel
  // the initialisation of GOVUK Frontend (eg. if it's starting in a browser they don't want to run our components in)
  // Those scripts can call `event.preventDefault()` to let us know
  // they don't want the initialisation to carry on
  var beforeEvent = new CustomEvent('govuk-frontend:before-' + actionName, {
    bubbles: true,
    cancelable: true,
    detail
  })
  $element.dispatchEvent(beforeEvent)

  // Break if users prevented default
  if (beforeEvent.defaultPrevented) {
    var preventedEvent = new CustomEvent(
      'govuk-frontend:prevented-' + actionName,
      {
        bubbles: true,
        cancelable: false
      }
    )
    $element.dispatchEvent(preventedEvent)

    return
  }

  // Dispatch an event to notify other scripts that GOV.UK Frontend
  // is actually initialising
  var event = new CustomEvent('govuk-frontend:' + actionName, {
    bubbles: true,
    cancelable: false
  })
  $element.dispatchEvent(event)

  try {
    return callback()
  } finally {
    var afterEvent = new CustomEvent('govuk-frontend:after-' + actionName, {
      bubbles: true,
      cancelable: true
    })
    $element.dispatchEvent(afterEvent)
  }
}

/**
 * Config for all components
 *
 * @typedef {object} Config
 * @property {Element} [scope=document] - Scope to query for components
 * @property {import('./components/accordion/accordion.mjs').AccordionConfig} [accordion] - Accordion config
 * @property {import('./components/button/button.mjs').ButtonConfig} [button] - Button config
 * @property {import('./components/character-count/character-count.mjs').CharacterCountConfig} [characterCount] - Character Count config
 * @property {import('./components/error-summary/error-summary.mjs').ErrorSummaryConfig} [errorSummary] - Error Summary config
 * @property {import('./components/notification-banner/notification-banner.mjs').NotificationBannerConfig} [notificationBanner] - Notification Banner config
 */
