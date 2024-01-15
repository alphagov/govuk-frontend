export { version } from './common/govuk-frontend-version.mjs';
import { isSupported } from './common/index.mjs';
import { Accordion } from './components/accordion/accordion.mjs';
import { Button } from './components/button/button.mjs';
import { CharacterCount } from './components/character-count/character-count.mjs';
import { Checkboxes } from './components/checkboxes/checkboxes.mjs';
import { ErrorSummary } from './components/error-summary/error-summary.mjs';
import { ExitThisPage } from './components/exit-this-page/exit-this-page.mjs';
import { Header } from './components/header/header.mjs';
import { NotificationBanner } from './components/notification-banner/notification-banner.mjs';
import { PasswordInput } from './components/password-input/password-input.mjs';
import { Radios } from './components/radios/radios.mjs';
import { SkipLink } from './components/skip-link/skip-link.mjs';
import { Tabs } from './components/tabs/tabs.mjs';
import { SupportError } from './errors/index.mjs';

/**
 * Initialise all components
 *
 * Use the `data-module` attributes to find, instantiate and init all of the
 * components provided as part of GOV.UK Frontend.
 *
 * @param {Config & { scope?: Element }} [config] - Config for all components (with optional scope)
 */
function initAll(config) {
  var _config$scope;
  config = typeof config !== 'undefined' ? config : {};
  if (!isSupported()) {
    console.log(new SupportError());
    return;
  }
  const components = [[Accordion, config.accordion], [Button, config.button], [CharacterCount, config.characterCount], [Checkboxes], [ErrorSummary, config.errorSummary], [ExitThisPage, config.exitThisPage], [Header], [NotificationBanner, config.notificationBanner], [PasswordInput, config.passwordInput], [Radios], [SkipLink], [Tabs]];
  const $scope = (_config$scope = config.scope) != null ? _config$scope : document;
  components.forEach(([Component, config]) => {
    const $elements = $scope.querySelectorAll(`[data-module="${Component.moduleName}"]`);
    $elements.forEach($element => {
      try {
        'defaults' in Component ? new Component($element, config) : new Component($element);
      } catch (error) {
        console.log(error);
      }
    });
  });
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

export { Accordion, Button, CharacterCount, Checkboxes, ErrorSummary, ExitThisPage, Header, NotificationBanner, PasswordInput, Radios, SkipLink, Tabs, initAll };
//# sourceMappingURL=all.mjs.map
