import { compileSassStringLikeUsers } from './helpers/sass.js'

/**
 * These are regex patterns which are unique in the compiled css output, and so
 * can be used to look for any duplication.
 *
 * They may fail if we update a component's styles and a previously unique
 * string either doesn't exist anymore, or is now repeated.
 */
const uniquePatterns = {
  button: /\.govuk-button--secondary:active/g,
  'error-message':
    /\.govuk-error-message\s*\{\s*font-family:\s*"GDS Transport"/g,
  fieldset: /\.govuk-fieldset__heading/g,
  hint: /\.govuk-fieldset__legend \+ \.govuk-hint/g,
  input: /\.govuk-input--error\s*\{/g,
  label: /\.govuk-label-wrapper/g,
  tag: /\.govuk-tag--green/g,
  textarea: /\.govuk-textarea--error\s*\{/g
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
      expect([...css.matchAll(/--govuk-frontend-version/g)]).toHaveLength(1)
    })

    it('does not duplicate button', () => {
      expect([...css.matchAll(uniquePatterns.button)]).toHaveLength(1)
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
      expect([...css.matchAll(/--govuk-frontend-version/g)]).toHaveLength(1)
    })

    it.each([
      'error-message',
      'fieldset',
      'hint',
      'input',
      'label',
      'textarea'
    ])('does not duplicate %s', (component) => {
      expect([...css.matchAll(uniquePatterns[component])]).toHaveLength(1)
    })
  })

  describe('components that use tag', () => {
    let css

    beforeAll(async () => {
      css = await compileSassStringLikeUsers(
        `
        ${method} "node_modules/govuk-frontend/src/govuk/components/phase-banner";
        ${method} "node_modules/govuk-frontend/src/govuk/components/task-list";
        `
      )
    })

    it('does not duplicate custom properties', () => {
      expect([...css.matchAll(/--govuk-frontend-version/g)]).toHaveLength(1)
    })

    it('does not duplicate tag', () => {
      expect([...css.matchAll(uniquePatterns.tag)]).toHaveLength(1)
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
      expect([...css.matchAll(/--govuk-frontend-version/g)]).toHaveLength(1)
    })

    it('does not duplicate lists', () => {
      expect([...css.matchAll(/list-style-type: disc/g)]).toHaveLength(1)
    })
  })
})
