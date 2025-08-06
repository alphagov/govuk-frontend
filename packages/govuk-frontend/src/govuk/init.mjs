import { normaliseOptions } from './common/configuration.mjs'
import { isSupported } from './common/index.mjs'
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
import { ElementError, SupportError } from './errors/index.mjs'

/**
 * Initialise all components
 *
 * Use the `data-module` attributes to find, instantiate and init all of the
 * components provided as part of GOV.UK Frontend.
 *
 * @param {Config} [config] - Config for all components (with optional scope)
 */
function initAll(config = {}) {
  const options = normaliseOptions(config)

  try {
    // Skip initialisation when GOV.UK Frontend is not supported
    if (!isSupported()) {
      throw new SupportError()
    }

    // Users can initialise GOV.UK Frontend in certain sections of the page
    // unless the scope is null (for example, query selector not found)
    if (options.scope === null) {
      throw new ElementError({
        element: options.scope,
        identifier: 'GOV.UK Frontend scope element (`$scope`)'
      })
    }
  } catch (error) {
    if (options.onError) {
      options.onError(error, {
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
 * @template {CompatibleClass | CompatibleClass<typeof ConfigurableComponent>} ComponentClass
 * @param {ComponentClass} Component - class of the component to create
 * @param {ComponentConfig<ComponentClass>} [config] - Config supplied to component
 * @param {OnErrorCallback<ComponentClass> | Element | Document | null | CreateAllOptions<ComponentClass>} [createAllOptions] - options for createAll including scope of the document to search within and callback function if error throw by component on init
 * @returns {Array<InstanceType<ComponentClass>>} - array of instantiated components
 */
function createAll(Component, config, createAllOptions) {
  let /** @type {NodeListOf<Element> | undefined} */ $elements

  // Extract initialisation options
  const options = normaliseOptions(createAllOptions)

  try {
    // Skip initialisation when GOV.UK Frontend is not supported
    if (!isSupported()) {
      throw new SupportError()
    }

    // Users can initialise GOV.UK Frontend in certain sections of the page
    // unless the scope is null (for example, query selector not found)
    if (options.scope === null) {
      throw new ElementError({
        element: options.scope,
        component: Component,
        identifier: 'Scope element (`$scope`)'
      })
    }

    $elements = options.scope?.querySelectorAll(
      `[data-module="${Component.moduleName}"]`
    )
  } catch (error) {
    if (options.onError) {
      options.onError(error, {
        component: Component,
        config
      })
    } else {
      console.log(error)
    }

    return []
  }

  return Array.from($elements ?? [])
    .map(($element) => {
      try {
        return /** @type {InstanceType<ComponentClass>} */ (
          // Only pass config to components that accept it
          'defaults' in Component
            ? new Component($element, config)
            : new Component($element)
        )
      } catch (error) {
        if (options.onError) {
          options.onError(error, {
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
 * `{new(...args: any[] ): any}` is not recognised as valid
 * https://github.com/gajus/eslint-plugin-jsdoc/issues/145#issuecomment-1308722878
 * https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/131
 **/

/**
 * Component compatible class
 *
 * @template {typeof Component | typeof ConfigurableComponent} [ChildConstructor=typeof Component]
 * @typedef {{
 *   new(...args: ConstructorParameters<ChildConstructor>): InstanceType<ChildConstructor>,
 *   defaults?: ObjectNested,
 *   schema?: Schema<ObjectNested>
 *   moduleName: string
 * }} CompatibleClass
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
 * @property {Element | Document | null} [scope] - scope of the document to search within
 * @property {OnErrorCallback<ComponentClass>} [onError] - callback function if error throw by component on init
 */

/**
 * @import { ConfigurableComponent, ObjectNested, Schema } from './common/configuration.mjs'
 * @import { Component } from './component.mjs'
 */
