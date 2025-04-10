import { isSupported } from './common/index.mjs';
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
import { SupportError } from './errors/index.mjs';

/**
 * Initialise all components
 *
 * Use the `data-module` attributes to find, instantiate and init all of the
 * components provided as part of GOV.UK Frontend.
 *
 * @param {Config & { scope?: Element, onError?: OnErrorCallback<CompatibleClass> }} [config] - Config for all components (with optional scope)
 */
function initAll(config) {
  var _config$scope;
  config = typeof config !== 'undefined' ? config : {};
  if (!isSupported()) {
    if (config.onError) {
      config.onError(new SupportError(), {
        config
      });
    } else {
      console.log(new SupportError());
    }
    return;
  }
  const components = [[Accordion, config.accordion], [Button, config.button], [CharacterCount, config.characterCount], [Checkboxes], [ErrorSummary, config.errorSummary], [ExitThisPage, config.exitThisPage], [FileUpload, config.fileUpload], [Header], [NotificationBanner, config.notificationBanner], [PasswordInput, config.passwordInput], [Radios], [ServiceNavigation], [SkipLink], [Tabs]];
  const options = {
    scope: (_config$scope = config.scope) != null ? _config$scope : document,
    onError: config.onError
  };
  components.forEach(([Component, config]) => {
    createAll(Component, config, options);
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
 * @param {OnErrorCallback<ComponentClass> | Element | Document | CreateAllOptions<ComponentClass> } [createAllOptions] - options for createAll including scope of the document to search within and callback function if error throw by component on init
 * @returns {Array<InstanceType<ComponentClass>>} - array of instantiated components
 */
function createAll(Component, config, createAllOptions) {
  let $scope = document;
  let onError;
  if (typeof createAllOptions === 'object') {
    var _createAllOptions$sco;
    createAllOptions = createAllOptions;
    $scope = (_createAllOptions$sco = createAllOptions.scope) != null ? _createAllOptions$sco : $scope;
    onError = createAllOptions.onError;
  }
  if (typeof createAllOptions === 'function') {
    onError = createAllOptions;
  }
  if (createAllOptions instanceof HTMLElement) {
    $scope = createAllOptions;
  }
  const $elements = $scope.querySelectorAll(`[data-module="${Component.moduleName}"]`);
  if (!isSupported()) {
    if (onError) {
      onError(new SupportError(), {
        component: Component,
        config
      });
    } else {
      console.log(new SupportError());
    }
    return [];
  }
  return Array.from($elements).map($element => {
    try {
      return typeof config !== 'undefined' ? new Component($element, config) : new Component($element);
    } catch (error) {
      if (onError) {
        onError(error, {
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
 * @property {ComponentConfig<ComponentClass>} config - Config supplied to component
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

export { createAll, initAll };
//# sourceMappingURL=init.mjs.map
