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
      expect(() => i18n.t()).toThrow('i18n: lookup key missing')
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

  describe('pluralisation', () => {
    it('throws an error if a required plural form is not provided ', () => {
      const i18n = new I18n({
        testOther: 'testing testing'
      }, {
        locale: 'en'
      })
      expect(() => { i18n.t('test', { count: 1 }) }).toThrowError('i18n: Plural form "One" is required for "en" locale')
    })

    it('interpolates the count variable into the correct plural form', () => {
      const i18n = new I18n({
        testOne: '%{count} test',
        testOther: '%{count} tests'
      }, {
        locale: 'en'
      })

      expect(i18n.t('test', { count: 1 })).toBe('1 test')
      expect(i18n.t('test', { count: 5 })).toBe('5 tests')
    })

    describe('fallback plural rules', () => {
      const testNumbers = [0, 1, 2, 5, 25, 100]

      it('returns the correct plural form for a given count (Arabic rules)', () => {
        const locale = 'ar'
        const localeNumbers = [105, 125]

        const i18n = new I18n({}, { locale: locale })
        const intl = new Intl.PluralRules(locale)

        testNumbers.concat(localeNumbers).forEach(num => {
          expect(i18n.pluralRules.arabic(num)).toEqual(intl.select(num))
        })
      })

      it('returns the correct plural form for a given count (Chinese rules)', () => {
        const locale = 'zh'
        const localeNumbers = []

        const i18n = new I18n({}, { locale: locale })
        const intl = new Intl.PluralRules(locale)

        testNumbers.concat(localeNumbers).forEach(num => {
          expect(i18n.pluralRules.chinese(num)).toEqual(intl.select(num))
        })
      })

      it('returns the correct plural form for a given count (French rules)', () => {
        const locale = 'fr'
        const localeNumbers = []

        const i18n = new I18n({}, { locale: locale })
        const intl = new Intl.PluralRules(locale)

        testNumbers.concat(localeNumbers).forEach(num => {
          expect(i18n.pluralRules.french(num)).toEqual(intl.select(num))
        })
      })

      it('returns the correct plural form for a given count (German rules)', () => {
        const locale = 'de'
        const localeNumbers = []

        const i18n = new I18n({}, { locale: locale })
        const intl = new Intl.PluralRules(locale)

        testNumbers.concat(localeNumbers).forEach(num => {
          expect(i18n.pluralRules.german(num)).toEqual(intl.select(num))
        })
      })

      it('returns the correct plural form for a given count (Irish rules)', () => {
        const locale = 'ga'
        const localeNumbers = [9]

        const i18n = new I18n({}, { locale: locale })
        const intl = new Intl.PluralRules(locale)

        testNumbers.concat(localeNumbers).forEach(num => {
          expect(i18n.pluralRules.irish(num)).toEqual(intl.select(num))
        })
      })

      it('returns the correct plural form for a given count (Russian rules)', () => {
        const locale = 'ru'
        const localeNumbers = [3, 13, 101]

        const i18n = new I18n({}, { locale: locale })
        const intl = new Intl.PluralRules(locale)

        testNumbers.concat(localeNumbers).forEach(num => {
          expect(i18n.pluralRules.russian(num)).toEqual(intl.select(num))
        })
      })

      it('returns the correct plural form for a given count (Scottish rules)', () => {
        const locale = 'gd'
        const localeNumbers = [15]

        const i18n = new I18n({}, { locale: locale })
        const intl = new Intl.PluralRules(locale)

        testNumbers.concat(localeNumbers).forEach(num => {
          expect(i18n.pluralRules.scottish(num)).toEqual(intl.select(num))
        })
      })

      it('returns the correct plural form for a given count (Spanish rules)', () => {
        const locale = 'es'
        const localeNumbers = [1000000, 2000000]

        const i18n = new I18n({}, { locale: locale })
        const intl = new Intl.PluralRules(locale)

        testNumbers.concat(localeNumbers).forEach(num => {
          expect(i18n.pluralRules.spanish(num)).toEqual(intl.select(num))
        })
      })

      it('returns the correct plural form for a given count (Welsh rules)', () => {
        const locale = 'cy'
        const localeNumbers = [3, 6]

        const i18n = new I18n({}, { locale: locale })
        const intl = new Intl.PluralRules(locale)

        testNumbers.concat(localeNumbers).forEach(num => {
          expect(i18n.pluralRules.welsh(num)).toEqual(intl.select(num))
        })
      })
    })
  })
})
