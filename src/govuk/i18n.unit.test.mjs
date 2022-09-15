/**
 * @jest-environment jsdom
 */

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

    it('returns the text for a given lookup key', () => {
      const i18n = new I18n(config)
      const returnString = i18n.t('textString')
      expect(returnString).toBe('Hello world')
    })

    it('returns the HTML for a given lookup key', () => {
      const i18n = new I18n(config)
      const returnString = i18n.t('htmlString')
      expect(returnString).toBe('Hello<span class="govuk-visually-hidden"> world</span>')
    })

    it('returns the lookup key if no translation is defined', () => {
      const i18n = new I18n(config)
      const returnString = i18n.t('missingString')
      expect(returnString).toBe('missingString')
    })

    it('throws an error if no lookup key is provided', () => {
      const i18n = new I18n(config)
      expect(() => i18n.t()).toThrow('i18n lookup key missing.')
    })
  })

  describe('string interpolation', () => {
    const config = {
      nameString: 'My name is %{name}'
    }

    it('throws an error if the options data is not present', () => {
      const i18n = new I18n(config)
      expect(() => { i18n.t('nameString') }).toThrowError('i18n: cannot replace placeholders in string if no option data provided')
    })

    it('throws an error if the options object is empty', () => {
      const i18n = new I18n(config)
      expect(() => { i18n.t('nameString', {}) }).toThrowError('i18n: no data found to replace %{name} placeholder in string')
    })

    it('throws an error if the options object does not have a matching key', () => {
      const i18n = new I18n(config)
      expect(() => { i18n.t('nameString', { unrelatedThing: 'hello' }) }).toThrowError('i18n: no data found to replace %{name} placeholder in string')
    })

    it('only matches %{} as a placeholder', () => {
      const i18n = new I18n({
        price: '%{name}, this } item %{ costs $5.00'
      })
      expect(i18n.t('price', { name: 'John' })).toBe('John, this } item %{ costs $5.00')
    })

    it('can lookup a placeholder value with non-alphanumeric key', () => {
      const i18n = new I18n({
        age: 'My age is %{current-age}'
      })
      expect(i18n.t('age', { 'current-age': 55 })).toBe('My age is 55')
    })

    it('can lookup a placeholder value with reserved name as key', () => {
      const i18n = new I18n({
        age: 'My age is %{valueOf}'
      })
      expect(i18n.t('age', { valueOf: 55 })).toBe('My age is 55')
    })

    it('throws an expected error if placeholder key with reserved name is not present in options', () => {
      const i18n = new I18n({
        age: 'My age is %{valueOf}'
      })
      expect(() => { i18n.t('age', {}) }).toThrowError('i18n: no data found to replace %{valueOf} placeholder in string')
    })

    it('replaces the placeholder with the provided data', () => {
      const i18n = new I18n(config)
      expect(i18n.t('nameString', { name: 'John' })).toBe('My name is John')
    })

    it('can replace a placeholder with a falsey value', () => {
      const i18n = new I18n({
        nameString: 'My name is %{name}',
        stock: 'Stock level: %{quantity}'
      })
      expect(i18n.t('nameString', { name: '' })).toBe('My name is ')
      expect(i18n.t('stock', { quantity: 0 })).toBe('Stock level: 0')
    })

    it('can pass false as a placeholder replacement to hide the value', () => {
      const i18n = new I18n({
        personalDetails: 'John Smith %{age}'
      })
      expect(i18n.t('personalDetails', { age: false })).toBe('John Smith ')
    })

    it('selects the correct data to replace in the string', () => {
      const i18n = new I18n(config)
      expect(i18n.t('nameString', { number: 50, name: 'Claire', otherName: 'Zoe' })).toBe('My name is Claire')
    })

    it('replaces multiple placeholders, if present', () => {
      const i18n = new I18n({
        nameString: 'Their name is %{name}. %{name} is %{age} years old'
      })
      expect(i18n.t('nameString', { number: 50, name: 'Andrew', otherName: 'Vic', age: 22 })).toBe('Their name is Andrew. Andrew is 22 years old')
    })

    it('nested placeholder only resolves with a matching key', () => {
      const i18n = new I18n({
        nameString: 'Their name is %{name%{age}}'
      })
      expect(i18n.t('nameString', { name: 'Andrew', age: 55, 'name%{age}': 'Testing' })).toBe('Their name is Testing')
    })

    it('handles placeholder-style text within options values', () => {
      const i18n = new I18n(config)
      expect(i18n.t('nameString', { name: '%{name}' })).toBe('My name is %{name}')
    })
  })
})
