import { isObject, isScope, isSupported } from './common/index.mjs'
import { Accordion } from './components/accordion/accordion.mjs'
import { Button } from './components/button/button.mjs'
import { CharacterCount } from './components/character-count/character-count.mjs'
import { Checkboxes } from './components/checkboxes/checkboxes.mjs'
import { ErrorSummary } from './components/error-summary/error-summary.mjs'
import { ExitThisPage } from './components/exit-this-page/exit-this-page.mjs'
import { FileUpload } from './components/file-upload/file-upload.mjs'
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
 * @param {Config} [config] - Config for all components (with optional scope)
 */
function initAll(config) {
  config = typeof config !== 'undefined' ? config : {}

  try {
    // Skip initialisation when GOV.UK Frontend is not supported
    if (!isSupported()) {
      throw new SupportError()
    }
  } catch (error) {
    if (config.onError) {
      config.onError(error, {
        config
      })
    } else {
      console.log(error)
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
    [FileUpload, config.fileUpload],
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
 * @template {CompatibleClass} ComponentClass
 * @param {ComponentClass} Component - class of the component to create
 * @param {ComponentConfig<ComponentClass>} [config] - Config supplied to component
 * @param {OnErrorCallback<ComponentClass> | Element | Document | CreateAllOptions<ComponentClass> } [createAllOptions] - options for createAll including scope of the document to search within and callback function if error throw by component on init
 * @returns {Array<InstanceType<ComponentClass>>} - array of instantiated components
 */
function createAll(Component, config, createAllOptions) {
  let /** @type {Element | Document} */ $scope = document
  let /** @type {OnErrorCallback<ComponentClass> | undefined} */ onError

  if (isObject(createAllOptions)) {
    $scope = createAllOptions.scope ?? $scope
    onError = createAllOptions.onError
  }

  if (typeof createAllOptions === 'function') {
    onError = createAllOptions
  }

  if (isScope(createAllOptions)) {
    $scope = createAllOptions
  }

  const $elements = $scope.querySelectorAll(
    `[data-module="${Component.moduleName}"]`
  )

  try {
    // Skip initialisation when GOV.UK Frontend is not supported
    if (!isSupported()) {
      throw new SupportError()
    }
  } catch (error) {
    if (onError) {
      onError(error, {
        component: Component,
        config
      })
    } else {
      console.log(error)
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
        return typeof config !== 'undefined'
          ? new Component($element, config)
          : new Component($element)
      } catch (error) {
        if (onError) {
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
 * @typedef {{new (...args: any[]): any, moduleName: string}} CompatibleClass
 */

/* eslint-enable jsdoc/valid-types */

/**
 * Config for all components via `initAll()`
 *
 * @typedef {object} Config
 * @property {Element | Document | null} [scope] - Scope of the document to search within
 * @property {OnErrorCallback<CompatibleClass>} [onError] - Initialisation error callback
 * @property {AccordionConfig} [accordion] - Accordion config
 * @property {ButtonConfig} [button] - Button config
 * @property {CharacterCountConfig} [characterCount] - Character Count config
 * @property {ErrorSummaryConfig} [errorSummary] - Error Summary config
 * @property {ExitThisPageConfig} [exitThisPage] - Exit This Page config
 * @property {FileUploadConfig} [fileUpload] - File Upload config
 * @property {NotificationBannerConfig} [notificationBanner] - Notification Banner config
 * @property {PasswordInputConfig} [passwordInput] - Password input config
 */

/**
 * Config for individual components
 *
 * @import { AccordionConfig } from './components/accordion/accordion.mjs'
 * @import { ButtonConfig } from './components/button/button.mjs'
 * @import { CharacterCountConfig } from './components/character-count/character-count.mjs'
 * @import { ErrorSummaryConfig } from './components/error-summary/error-summary.mjs'
 * @import { ExitThisPageConfig } from './components/exit-this-page/exit-this-page.mjs'
 * @import { NotificationBannerConfig } from './components/notification-banner/notification-banner.mjs'
 * @import { PasswordInputConfig } from './components/password-input/password-input.mjs'
 * @import { FileUploadConfig } from './components/file-upload/file-upload.mjs'
 */

/**
 * Component config keys, e.g. `accordion` and `characterCount`
 *
 * @typedef {keyof Config} ConfigKey
 */

/**
 * @template {CompatibleClass} ComponentClass
 * @typedef {ConstructorParameters<ComponentClass>[1]} ComponentConfig
 */

/**
 * @template {CompatibleClass} ComponentClass
 * @typedef {object} ErrorContext
 * @property {Element} [element] - Element used for component module initialisation
 * @property {ComponentClass} [component] - Class of component
 * @property {Config | ComponentConfig<ComponentClass>} [config] - Config supplied to components
 */

/**
 * @template {CompatibleClass} ComponentClass
 * @callback OnErrorCallback
 * @param {unknown} error - Thrown error
 * @param {ErrorContext<ComponentClass>} context - Object containing the element, component class and configuration
 */

/**
 * @template {CompatibleClass} ComponentClass
 * @typedef {object} CreateAllOptions
 * @property {Element | Document} [scope] - scope of the document to search within
 * @property {OnErrorCallback<ComponentClass>} [onError] - callback function if error throw by component on init
 */
