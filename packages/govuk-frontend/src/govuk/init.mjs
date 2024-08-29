import { isSupported } from './common/index.mjs'
import { Accordion } from './components/accordion/accordion.mjs'
import { Button } from './components/button/button.mjs'
import { CharacterCount } from './components/character-count/character-count.mjs'
import { Checkboxes } from './components/checkboxes/checkboxes.mjs'
import { ErrorSummary } from './components/error-summary/error-summary.mjs'
import { ExitThisPage } from './components/exit-this-page/exit-this-page.mjs'
import { Header } from './components/header/header.mjs'
import { NotificationBanner } from './components/notification-banner/notification-banner.mjs'
import { PasswordInput } from './components/password-input/password-input.mjs'
import { Radios } from './components/radios/radios.mjs'
import { ServiceNavigation } from './components/service-navigation/service-navigation.mjs'
import { SkipLink } from './components/skip-link/skip-link.mjs'
import { Tabs } from './components/tabs/tabs.mjs'
import { SupportError } from './errors/index.mjs'

/**
 * Initialise all components
 *
 * Use the `data-module` attributes to find, instantiate and init all of the
 * components provided as part of GOV.UK Frontend.
 *
 * @param {Config & { scope?: Element, onError?: OnErrorCallback<CompatibleClass> }} [config] - Config for all components (with optional scope)
 */
function initAll(config) {
  config = typeof config !== 'undefined' ? config : {}

  // Skip initialisation when GOV.UK Frontend is not supported
  if (!isSupported()) {
    if (config.onError) {
      config.onError(new SupportError(), {
        config
      })
    } else {
      console.log(new SupportError())
    }
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
    [PasswordInput, config.passwordInput],
    [Radios],
    [ServiceNavigation],
    [SkipLink],
    [Tabs]
  ])

  // Allow the user to initialise GOV.UK Frontend in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  // const $scope = config.scope ?? document

  const options = {
    scope: config.scope ?? document,
    onError: config.onError
  }

  components.forEach(([Component, config]) => {
    createAll(Component, config, options)
  })
}

/**
 * Create all instances of a specific component on the page
 *
 * Uses the `data-module` attribute to find all elements matching the specified
 * component on the page, creating instances of the component object for each
 * of them.
 *
 * Any component errors will be caught and logged to the console.
 *
 * @template {CompatibleClass} T
 * @param {T} Component - class of the component to create
 * @param {T["defaults"]} [config] - Config supplied to component
 * @param {OnErrorCallback<T> | Element | Document | CreateAllOptions<T> } [createAllOptions] - options for createAll including scope of the document to search within and callback function if error throw by component on init
 * @returns {Array<InstanceType<T>>} - array of instantiated components
 */
function createAll(Component, config, createAllOptions) {
  let /** @type {Element | Document} */ $scope = document
  let /** @type {OnErrorCallback<Component> | undefined} */ onError

  if (typeof createAllOptions === 'object') {
    createAllOptions = /** @type {CreateAllOptions<Component>} */ (
      // eslint-disable-next-line no-self-assign
      createAllOptions
    )

    $scope = createAllOptions.scope ?? $scope
    onError = createAllOptions.onError
  }

  if (typeof createAllOptions === 'function') {
    onError = createAllOptions
  }

  if (createAllOptions instanceof HTMLElement) {
    $scope = createAllOptions
  }

  const $elements = $scope.querySelectorAll(
    `[data-module="${Component.moduleName}"]`
  )

  // Skip initialisation when GOV.UK Frontend is not supported
  if (!isSupported()) {
    if (onError) {
      onError(new SupportError(), {
        component: Component,
        config
      })
    } else {
      console.log(new SupportError())
    }
    return []
  }

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-return --
   * We can't define CompatibleClass as `{new(): CompatibleClass, moduleName: string}`,
   * as when doing `typeof Accordion` (or any component), TypeScript doesn't seem
   * to acknowledge the static `moduleName` that's set in our component classes.
   * This means we have to set the constructor of `CompatibleClass` as `{new(): any}`,
   * leading to ESLint frowning that we're returning `any[]`.
   */
  return Array.from($elements)
    .map(($element) => {
      try {
        // Only pass config to components that accept it
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return 'defaults' in Component && typeof config !== 'undefined'
          ? new Component($element, config)
          : new Component($element)
      } catch (error) {
        if (onError && error instanceof Error) {
          onError(error, {
            element: $element,
            component: Component,
            config
          })
        } else {
          console.log(error)
        }

        return null
      }
    })
    .filter(Boolean) // Exclude components that errored
}

export { initAll, createAll }

/* eslint-disable jsdoc/valid-types --
 * `{new(...args: any[] ): object}` is not recognised as valid
 * https://github.com/gajus/eslint-plugin-jsdoc/issues/145#issuecomment-1308722878
 * https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/131
 **/

/**
 * @typedef {{new (...args: any[]): any, defaults?: object, moduleName: string}} CompatibleClass
 */

/* eslint-enable jsdoc/valid-types */

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
 * @property {PasswordInputConfig} [passwordInput] - Password input config
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
 * @typedef {import('./components/password-input/password-input.mjs').PasswordInputConfig} PasswordInputConfig
 */

/**
 * Component config keys, e.g. `accordion` and `characterCount`
 *
 * @typedef {keyof Config} ConfigKey
 */

/**
 * @template {CompatibleClass} T
 * @typedef {object} ErrorContext
 * @property {Element} [element] - Element used for component module initialisation
 * @property {T} [component] - Class of component
 * @property {T["defaults"]} config - Config supplied to component
 */

/**
 * @template {CompatibleClass} T
 * @callback OnErrorCallback
 * @param {Error} error - Thrown error
 * @param {ErrorContext<T>} context - Object containing the element, component class and configuration
 */

/**
 * @template {CompatibleClass} T
 * @typedef {object} CreateAllOptions
 * @property {Element | Document} [scope] - scope of the document to search within
 * @property {OnErrorCallback<T>} [onError] - callback function if error throw by component on init
 */
