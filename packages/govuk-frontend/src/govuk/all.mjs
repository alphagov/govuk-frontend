/* eslint-disable no-new */

import { version } from './common/govuk-frontend-version.mjs'
import { isSupported } from './common/index.mjs'
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
import { SupportError } from './errors/index.mjs'

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
  if (!isSupported()) {
    console.log(new SupportError())
    return
  }

  const components = /** @type {const} */ ([
    [Accordion, config.accordion],
    [Button, config.button],
    [CharacterCount, config.characterCount],
    [Checkboxes],
    [ErrorSummary, config.errorSummary],
    [ExitThisPage, config.exitThisPage],
    [Header],
    [NotificationBanner, config.notificationBanner],
    [Radios],
    [SkipLink],
    [Tabs]
  ])

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  const $scope = config.scope ?? document

  components.forEach(([Component, config]) => {
    const $elements = $scope.querySelectorAll(
      `[data-module="${Component.moduleName}"]`
    )

    $elements.forEach(($element) => {
      try {
        // Only pass config to components that accept it
        'defaults' in Component
          ? new Component($element, config)
          : new Component($element)
      } catch (error) {
        console.log(error)
      }
    })
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
 * @typedef {import('./components/character-count/character-count.mjs').CharacterCountTranslations} CharacterCountTranslations
 * @typedef {import('./components/error-summary/error-summary.mjs').ErrorSummaryConfig} ErrorSummaryConfig
 * @typedef {import('./components/exit-this-page/exit-this-page.mjs').ExitThisPageConfig} ExitThisPageConfig
 * @typedef {import('./components/exit-this-page/exit-this-page.mjs').ExitThisPageTranslations} ExitThisPageTranslations
 * @typedef {import('./components/notification-banner/notification-banner.mjs').NotificationBannerConfig} NotificationBannerConfig
 */

/**
 * Component config keys, e.g. `accordion` and `characterCount`
 *
 * @typedef {keyof Config} ConfigKey
 */
