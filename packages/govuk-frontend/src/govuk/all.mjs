export { version } from './common/govuk-frontend-version.mjs'
export { Accordion } from './components/accordion/accordion.mjs'
export { Button } from './components/button/button.mjs'
export { CharacterCount } from './components/character-count/character-count.mjs'
export { Checkboxes } from './components/checkboxes/checkboxes.mjs'
export { ErrorSummary } from './components/error-summary/error-summary.mjs'
export { ExitThisPage } from './components/exit-this-page/exit-this-page.mjs'
export { FileUpload } from './components/file-upload/file-upload.mjs'
export { Header } from './components/header/header.mjs'
export { NotificationBanner } from './components/notification-banner/notification-banner.mjs'
export { PasswordInput } from './components/password-input/password-input.mjs'
export { Radios } from './components/radios/radios.mjs'
export { ServiceNavigation } from './components/service-navigation/service-navigation.mjs'
export { SkipLink } from './components/skip-link/skip-link.mjs'
export { Tabs } from './components/tabs/tabs.mjs'
export { initAll, createAll } from './init.mjs'
export { isSupported } from './common/index.mjs'
export { Component } from './component.mjs'
export { ConfigurableComponent } from './common/configuration.mjs'

/**
 * @typedef {import('./init.mjs').Config} Config for all components via `initAll()`
 * @typedef {import('./init.mjs').ConfigKey} ConfigKey - Component config keys, e.g. `accordion` and `characterCount`
 */
