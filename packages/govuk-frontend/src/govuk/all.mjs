import { version } from './common/govuk-frontend-version.mjs'
import { Accordion } from './components/accordion/accordion.mjs'
import { Button } from './components/button/button.mjs'
import { CharacterCount } from './components/character-count/character-count.mjs'
import { Checkboxes } from './components/checkboxes/checkboxes.mjs'
import { Details } from './components/details/details.mjs'
import { ErrorSummary } from './components/error-summary/error-summary.mjs'
import { Header } from './components/header/header.mjs'
import { NotificationBanner } from './components/notification-banner/notification-banner.mjs'
import { Radios } from './components/radios/radios.mjs'
import { SkipLink } from './components/skip-link/skip-link.mjs'
import { Tabs } from './components/tabs/tabs.mjs'

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
  const $scope = config.scope instanceof HTMLElement ? config.scope : document

  const $accordions = $scope.querySelectorAll('[data-module="govuk-accordion"]')
  $accordions.forEach(($accordion) => {
    new Accordion($accordion, config.accordion).init()
  })

  const $buttons = $scope.querySelectorAll('[data-module="govuk-button"]')
  $buttons.forEach(($button) => {
    new Button($button, config.button).init()
  })

  const $characterCounts = $scope.querySelectorAll('[data-module="govuk-character-count"]')
  $characterCounts.forEach(($characterCount) => {
    new CharacterCount($characterCount, config.characterCount).init()
  })

  const $checkboxes = $scope.querySelectorAll('[data-module="govuk-checkboxes"]')
  $checkboxes.forEach(($checkbox) => {
    new Checkboxes($checkbox).init()
  })

  const $details = $scope.querySelectorAll('[data-module="govuk-details"]')
  $details.forEach(($detail) => {
    new Details($detail).init()
  })

  // Find first error summary module to enhance.
  const $errorSummary = $scope.querySelector('[data-module="govuk-error-summary"]')
  if ($errorSummary) {
    new ErrorSummary($errorSummary, config.errorSummary).init()
  }

  // Find first header module to enhance.
  const $header = $scope.querySelector('[data-module="govuk-header"]')
  if ($header) {
    new Header($header).init()
  }

  const $notificationBanners = $scope.querySelectorAll('[data-module="govuk-notification-banner"]')
  $notificationBanners.forEach(($notificationBanner) => {
    new NotificationBanner($notificationBanner, config.notificationBanner).init()
  })

  const $radios = $scope.querySelectorAll('[data-module="govuk-radios"]')
  $radios.forEach(($radio) => {
    new Radios($radio).init()
  })

  // Find first skip link module to enhance.
  const $skipLink = $scope.querySelector('[data-module="govuk-skip-link"]')
  if ($skipLink) {
    new SkipLink($skipLink).init()
  }

  const $tabs = $scope.querySelectorAll('[data-module="govuk-tabs"]')
  $tabs.forEach(($tabs) => {
    new Tabs($tabs).init()
  })
}

export {
  initAll,
  version,

  // Components
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
 * Config for all components via `initAll()`
 *
 * @typedef {object} Config
 * @property {Element} [scope=document] - Scope to query for components
 * @property {AccordionConfig} [accordion] - Accordion config
 * @property {ButtonConfig} [button] - Button config
 * @property {CharacterCountConfig} [characterCount] - Character Count config
 * @property {ErrorSummaryConfig} [errorSummary] - Error Summary config
 * @property {NotificationBannerConfig} [notificationBanner] - Notification Banner config
 */

/**
 * Config for individual components
 *
 * @typedef {import('./components/accordion/accordion.mjs').AccordionConfig} AccordionConfig
 * @typedef {import('./components/accordion/accordion.mjs').AccordionTranslations} AccordionTranslations
 * @typedef {import('./components/button/button.mjs').ButtonConfig} ButtonConfig
 * @typedef {import('./components/character-count/character-count.mjs').CharacterCountConfig} CharacterCountConfig
 * @typedef {import('./components/character-count/character-count.mjs').CharacterCountConfigWithMaxLength} CharacterCountConfigWithMaxLength
 * @typedef {import('./components/character-count/character-count.mjs').CharacterCountConfigWithMaxWords} CharacterCountConfigWithMaxWords
 * @typedef {import('./components/character-count/character-count.mjs').CharacterCountTranslations} CharacterCountTranslations
 * @typedef {import('./components/error-summary/error-summary.mjs').ErrorSummaryConfig} ErrorSummaryConfig
 * @typedef {import('./components/notification-banner/notification-banner.mjs').NotificationBannerConfig} NotificationBannerConfig
 */
