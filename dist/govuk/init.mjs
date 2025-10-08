import { normaliseOptions } from './common/configuration.mjs';
import { isSupported, isObject } from './common/index.mjs';
import { Accordion } from './components/accordion/accordion.mjs';
import { Button } from './components/button/button.mjs';
import { CharacterCount } from './components/character-count/character-count.mjs';
import { Checkboxes } from './components/checkboxes/checkboxes.mjs';
import { ErrorSummary } from './components/error-summary/error-summary.mjs';
import { ExitThisPage } from './components/exit-this-page/exit-this-page.mjs';
import { FileUpload } from './components/file-upload/file-upload.mjs';
import { Header } from './components/header/header.mjs';
import { NotificationBanner } from './components/notification-banner/notification-banner.mjs';
import { PasswordInput } from './components/password-input/password-input.mjs';
import { Radios } from './components/radios/radios.mjs';
import { ServiceNavigation } from './components/service-navigation/service-navigation.mjs';
import { SkipLink } from './components/skip-link/skip-link.mjs';
import { Tabs } from './components/tabs/tabs.mjs';
import { SupportError, ElementError } from './errors/index.mjs';

/**
 * Initialise all components
 *
 * Use the `data-module` attributes to find, instantiate and init all of the
 * components provided as part of GOV.UK Frontend.
 *
 * @param {Config | Element | Document | null} [scopeOrConfig] - Scope of the document to search within or config for all components (with optional scope)
 */
function initAll(scopeOrConfig = {}) {
  const config = isObject(scopeOrConfig) ? scopeOrConfig : {};
  const options = normaliseOptions(scopeOrConfig);
  try {
    if (!isSupported()) {
      throw new SupportError();
    }
    if (options.scope === null) {
      throw new ElementError({
        element: options.scope,
        identifier: 'GOV.UK Frontend scope element (`$scope`)'
      });
    }
  } catch (error) {
    if (options.onError) {
      options.onError(error, {
        config
      });
    } else {
      console.log(error);
    }
    return;
  }
  const components = [[Accordion, config.accordion], [Button, config.button], [CharacterCount, config.characterCount], [Checkboxes], [ErrorSummary, config.errorSummary], [ExitThisPage, config.exitThisPage], [FileUpload, config.fileUpload], [Header], [NotificationBanner, config.notificationBanner], [PasswordInput, config.passwordInput], [Radios], [ServiceNavigation], [SkipLink], [Tabs]];
  components.forEach(([Component, componentConfig]) => {
    createAll(Component, componentConfig, options);
  });
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
function createAll(Component, config, scopeOrOptions) {
  let $elements;
  const options = normaliseOptions(scopeOrOptions);
  try {
    var _options$scope;
    if (!isSupported()) {
      throw new SupportError();
    }
    if (options.scope === null) {
      throw new ElementError({
        element: options.scope,
        component: Component,
        identifier: 'Scope element (`$scope`)'
      });
    }
    $elements = (_options$scope = options.scope) == null ? void 0 : _options$scope.querySelectorAll(`[data-module="${Component.moduleName}"]`);
  } catch (error) {
    if (options.onError) {
      options.onError(error, {
        component: Component,
        config
      });
    } else {
      console.log(error);
    }
    return [];
  }
  return Array.from($elements != null ? $elements : []).map($element => {
    try {
      return typeof config !== 'undefined' ? new Component($element, config) : new Component($element);
    } catch (error) {
      if (options.onError) {
        options.onError(error, {
          element: $element,
          component: Component,
          config
        });
      } else {
        console.log(error);
      }
      return null;
    }
  }).filter(Boolean);
}
/**
 * @typedef {{new (...args: any[]): any, moduleName: string}} CompatibleClass
 */
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
 * @typedef {keyof Omit<Config, 'scope' | 'onError'>} ConfigKey
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

export { createAll, initAll };
//# sourceMappingURL=init.mjs.map
