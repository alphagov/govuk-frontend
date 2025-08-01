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
function initAll(config = {}) {
  let /** @type {Element | Document | null} */ $scope = document
  let /** @type {OnErrorCallback<CompatibleClass> | undefined} */ onError

  // Scope must be valid or null
  if (isScope(config.scope) || config.scope === null) {
    $scope = config.scope
  }

  // Error handler must be a function
  if (typeof config.onError === 'function') {
    onError = config.onError
  }

  // Skip initialisation when GOV.UK Frontend is not supported
  if (!isSupported()) {
    if (onError) {
      onError(new SupportError(), {
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
  // Defaults to the entire document in `createAll` if scope is undefined but not null
  const options = {
    scope: $scope,
    onError
  }

  components.forEach(([Component, componentConfig]) => {
    createAll(Component, componentConfig, options)
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
 * @param {OnErrorCallback<ComponentClass> | Element | Document | null | CreateAllOptions<ComponentClass>} [scopeOrOptions] - options for createAll including scope of the document to search within and callback function if error throw by component on init
 * @returns {Array<InstanceType<ComponentClass>>} - array of instantiated components
 */
function createAll(Component, config, scopeOrOptions = {}) {
  let /** @type {Element | Document | null} */ $scope = document
  let /** @type {OnErrorCallback<ComponentClass> | undefined} */ onError

  // Handle options object
  if (isObject(scopeOrOptions)) {
    const options = scopeOrOptions

    // Scope must be valid or null
    if (isScope(options.scope) || options.scope === null) {
      $scope = options.scope
    }

    // Error handler must be a function
    if (typeof options.onError === 'function') {
      onError = options.onError
    }
  }

  if (isScope(scopeOrOptions)) {
    $scope = scopeOrOptions
  } else if (scopeOrOptions === null) {
    $scope = null
  } else if (typeof scopeOrOptions === 'function') {
    onError = scopeOrOptions
  }

  const $elements =
    $scope?.querySelectorAll(`[data-module="${Component.moduleName}"]`) ?? []

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
    .filter((instance) => !!instance) // Exclude components that errored
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
 * @property {ComponentConfig<typeof Accordion>} [accordion] - Accordion config
 * @property {ComponentConfig<typeof Button>} [button] - Button config
 * @property {ComponentConfig<typeof CharacterCount>} [characterCount] - Character Count config
 * @property {ComponentConfig<typeof ErrorSummary>} [errorSummary] - Error Summary config
 * @property {ComponentConfig<typeof ExitThisPage>} [exitThisPage] - Exit This Page config
 * @property {ComponentConfig<typeof FileUpload>} [fileUpload] - File Upload config
 * @property {ComponentConfig<typeof NotificationBanner>} [notificationBanner] - Notification Banner config
 * @property {ComponentConfig<typeof PasswordInput>} [passwordInput] - Password input config
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
 * @property {Config | ComponentConfig<ComponentClass>} config - Config supplied to components
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
 * @property {Element | Document | null} [scope] - scope of the document to search within
 * @property {OnErrorCallback<ComponentClass>} [onError] - callback function if error throw by component on init
 */
