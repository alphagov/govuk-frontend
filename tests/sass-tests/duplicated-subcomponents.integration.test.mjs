import { compileSassStringLikeUsers } from './helpers/sass.js'

const uniqueStrings = {
  accordion: '.govuk-accordion-nav__chevron--down',
  'back-link': '.govuk-back-link::before',
  breadcrumbs: '.govuk-breadcrumbs--collapse-on-mobile',
  button: '.govuk-button--secondary',
  'character-count': '.govuk-character-count__message--disabled',
  checkboxes:
    '.govuk-checkboxes__input:checked + .govuk-checkboxes__label::after',
  'cookie-banner': '.govuk-cookie-banner__message',
  'date-input': '.govuk-date-input__item',
  details: '.govuk-details__text p',
  'error-message': '.govuk-error-message',
  'error-summary': '.govuk-error-summary__title',
  'exit-this-page': '.govuk-exit-this-page__button',
  fieldset: '.govuk-fieldset__heading',
  'file-upload': '.govuk-file-upload-button__instruction',
  footer: '.govuk-footer__crown',
  header: '.govuk-header__container--full-width',
  hint: '.govuk-fieldset__legend + .govuk-hint',
  input: '.govuk-input--error',
  'inset-text': '.govuk-inset-text',
  label: '.govuk-label-wrapper',
  'notification-banner': '.govuk-notification-banner__header',
  pagination: '.govuk-pagination__list',
  panel: '.govuk-panel--confirmation',
  'password-input': '.govuk-password-input__wrapper',
  'phase-banner': '.govuk-phase-banner__content__tag',
  radios: '.govuk-radios__input:checked + .govuk-radios__label::after',
  select: '.govuk-select--error',
  'service-navigation': '.govuk-service-navigation__item--active',
  'skip-link': '.govuk-skip-link-focused-element',
  'summary-list': '.govuk-summary-list__value > p',
  table: '.govuk-table--small-text-until-tablet',
  tabs: '.govuk-tabs__list-item--selected',
  tag: '.govuk-tag--green',
  'task-list': '.govuk-task-list__item:first-child',
  textarea: '.govuk-textarea--error',
  'warning-text': '.govuk-warning-text__icon'
}

describe.each(['@use', '@import'])('%s', (method) => {
  describe('components that use button', () => {
    let css

    beforeAll(async () => {
      css = await compileSassStringLikeUsers(
        `
        ${method} "node_modules/govuk-frontend/src/govuk/components/cookie-banner";
        ${method} "node_modules/govuk-frontend/src/govuk/components/exit-this-page";
        ${method} "node_modules/govuk-frontend/src/govuk/components/password-input";
        `
      )
    })

    it('does not duplicate custom properties', () => {
      expect(css.match(/--govuk-frontend-version/)).toHaveLength(1)
    })

    it('does not duplicate button', () => {
      expect(css.match(uniqueStrings.button)).toHaveLength(1)
    })
  })

  describe('components that use form-related components', () => {
    let css

    beforeAll(async () => {
      css = await compileSassStringLikeUsers(
        `
        ${method} "node_modules/govuk-frontend/src/govuk/components/character-count";
        ${method} "node_modules/govuk-frontend/src/govuk/components/checkboxes";
        ${method} "node_modules/govuk-frontend/src/govuk/components/date-input";
        ${method} "node_modules/govuk-frontend/src/govuk/components/file-upload";
        ${method} "node_modules/govuk-frontend/src/govuk/components/input";
        ${method} "node_modules/govuk-frontend/src/govuk/components/password-input";
        ${method} "node_modules/govuk-frontend/src/govuk/components/radios";
        ${method} "node_modules/govuk-frontend/src/govuk/components/select";
        ${method} "node_modules/govuk-frontend/src/govuk/components/textarea";
        `
      )
    })

    it('does not duplicate custom properties', () => {
      expect(css.match(/--govuk-frontend-version/)).toHaveLength(1)
    })

    it.each([
      'error-message',
      'fieldset',
      'hint',
      'input',
      'label',
      'textarea'
    ])('does not duplicate %s', (component) => {
      expect(css.match(RegExp.escape(uniqueStrings[component]))).toHaveLength(1)
    })
  })

  describe('components that use tag', () => {
    let css

    beforeAll(async () => {
      css = await compileSassStringLikeUsers(
        `
        ${method} "node_modules/govuk-frontend/src/govuk/components/phase-banner";
        ${method} "node_modules/govuk-frontend/src/govuk/components/task-list";
        ${method} "node_modules/govuk-frontend/src/govuk/components/date-input";
        ${method} "node_modules/govuk-frontend/src/govuk/components/file-upload";
        ${method} "node_modules/govuk-frontend/src/govuk/components/input";
        ${method} "node_modules/govuk-frontend/src/govuk/components/password-input";
        ${method} "node_modules/govuk-frontend/src/govuk/components/radios";
        ${method} "node_modules/govuk-frontend/src/govuk/components/select";
        ${method} "node_modules/govuk-frontend/src/govuk/components/textarea";
        `
      )
    })

    it('does not duplicate custom properties', () => {
      expect(css.match(/--govuk-frontend-version/)).toHaveLength(1)
    })

    it('does not duplicate tag', () => {
      expect(css.match(uniqueStrings.tag)).toHaveLength(1)
    })
  })

  describe('components that use core/lists', () => {
    let css

    beforeAll(async () => {
      css = await compileSassStringLikeUsers(
        `
        ${method} "node_modules/govuk-frontend/src/govuk/core/lists";
        ${method} "node_modules/govuk-frontend/src/govuk/components/error-summary";
        `
      )
    })

    it('does not duplicate custom properties', () => {
      expect(css.match(/--govuk-frontend-version/)).toHaveLength(1)
    })

    it('does not duplicate lists', () => {
      expect(css.match('.govuk-list--bullet')).toHaveLength(1)
    })
  })
})
