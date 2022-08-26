/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import I18n from './i18n.mjs'

describe('I18n', () => {
  describe('retrieving translations', () => {
    let config = {}

    beforeEach(() => {
      config = {
        textString: 'Hello world',
        htmlString: 'Hello<span class="govuk-visually-hidden"> world</span>'
      }
    })

    test('returns the text for a given lookup key', () => {
      const i18n = new I18n(config)
      const returnString = i18n.t('textString')
      expect(returnString).toBe('Hello world')
    })

    test('returns the HTML for a given lookup key', () => {
      const i18n = new I18n(config)
      const returnString = i18n.t('htmlString')
      expect(returnString).toBe('Hello<span class="govuk-visually-hidden"> world</span>')
    })

    test('returns the lookup key if no translation is defined', () => {
      const i18n = new I18n(config)
      const returnString = i18n.t('missingString')
      expect(returnString).toBe('missingString')
    })

    test('throws an error if no lookup key is provided', () => {
      const i18n = new I18n(config)
      expect(() => i18n.t()).toThrow('i18n lookup key missing.')
    })
  })
})
