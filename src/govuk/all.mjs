/* eslint-disable no-new */

import { version } from './common/govuk-frontend-version.mjs'
import { Accordion } from './components/accordion/accordion.mjs'
import { Button } from './components/button/button.mjs'
import { CharacterCount } from './components/character-count/character-count.mjs'
import { Checkboxes } from './components/checkboxes/checkboxes.mjs'
import { ErrorSummary } from './components/error-summary/error-summary.mjs'
import { ExitThisPage } from './components/exit-this-page/exit-this-page.mjs'
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
 * @param {Config & { scope?: Element }} [config] - Config for all components (with optional scope)
 */
function initAll(config) {
  config = typeof config !== 'undefined' ? config : {}

  // Skip initialisation when GOV.UK Frontend is not supported
  if (!document.body.classList.contains('govuk-frontend-supported')) {
    return
  }

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  const $scope = config.scope instanceof HTMLElement ? config.scope : document

  const $accordions = $scope.querySelectorAll('[data-module="govuk-accordion"]')
  $accordions.forEach(($accordion) => {
    new Accordion($accordion, config.accordion)
  })

  const $buttons = $scope.querySelectorAll('[data-module="govuk-button"]')
  $buttons.forEach(($button) => {
    new Button($button, config.button)
  })

  const $characterCounts = $scope.querySelectorAll(
    '[data-module="govuk-character-count"]'
  )
  $characterCounts.forEach(($characterCount) => {
    new CharacterCount($characterCount, config.characterCount)
  })

  const $checkboxes = $scope.querySelectorAll(
    '[data-module="govuk-checkboxes"]'
  )
  $checkboxes.forEach(($checkbox) => {
    new Checkboxes($checkbox)
  })

  // Find first error summary module to enhance.
  const $errorSummary = $scope.querySelector(
    '[data-module="govuk-error-summary"]'
  )
  if ($errorSummary) {
    new ErrorSummary($errorSummary, config.errorSummary)
  }

  const $exitThisPageButtons = $scope.querySelectorAll(
    '[data-module="govuk-exit-this-page"]'
  )
  $exitThisPageButtons.forEach(($button) => {
    new ExitThisPage($button, config.exitThisPage)
  })

  // Find first header module to enhance.
  const $header = $scope.querySelector('[data-module="govuk-header"]')
  if ($header) {
    new Header($header)
  }

  const $notificationBanners = $scope.querySelectorAll(
    '[data-module="govuk-notification-banner"]'
  )
  $notificationBanners.forEach(($notificationBanner) => {
    new NotificationBanner($notificationBanner, config.notificationBanner)
  })

  const $radios = $scope.querySelectorAll('[data-module="govuk-radios"]')
  $radios.forEach(($radio) => {
    new Radios($radio)
  })

  // Find first skip link module to enhance.
  const $skipLink = $scope.querySelector('[data-module="govuk-skip-link"]')
  if ($skipLink) {
    new SkipLink($skipLink)
  }

  const $tabs = $scope.querySelectorAll('[data-module="govuk-tabs"]')
  $tabs.forEach(($tabs) => {
    new Tabs($tabs)
  })
}

export {
  initAll,
  version,

  // Components
  Accordion,
  Button,
  CharacterCount,
  Checkboxes,
  ErrorSummary,
  ExitThisPage,
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
 * @property {AccordionConfig} [accordion] - Accordion config
 * @property {ButtonConfig} [button] - Button config
 * @property {CharacterCountConfig} [characterCount] - Character Count config
 * @property {ErrorSummaryConfig} [errorSummary] - Error Summary config
 * @property {ExitThisPageConfig} [exitThisPage] - Exit This Page config
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
 * @typedef {import('./components/exit-this-page/exit-this-page.mjs').ExitThisPageConfig} ExitThisPageConfig
 * @typedef {import('./components/exit-this-page/exit-this-page.mjs').ExitThisPageTranslations} ExitThisPageTranslations
 * @typedef {import('./components/notification-banner/notification-banner.mjs').NotificationBannerConfig} NotificationBannerConfig
 */
