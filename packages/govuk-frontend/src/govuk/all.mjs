/* eslint-disable no-new */

import { version } from './common/govuk-frontend-version.mjs'
import {
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
} from './components/index.mjs'

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
  const $scope = config.scope instanceof HTMLElement ? config.scope : document

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
 * @typedef {keyof import('./components/index.mjs')} ComponentName - Component names, e.g. `'Accordion'`, `'CharacterCount'`
 * @typedef {import('./components/index.mjs')[ComponentName]} Component - Component types, e.g. `Accordion`, `CharacterCount`
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
