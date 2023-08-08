import { I18n } from './i18n.mjs'

describe('I18n', () => {
  describe('.t', () => {
    /** @type {{ [key: string]: unknown }} */
    let translations = {}

    beforeEach(() => {
      translations = {
        textString: 'Hello world',
        htmlString: 'Hello<span class="govuk-visually-hidden"> world</span>'
      }
    })

    it('returns the text for a given lookup key', () => {
      const i18n = new I18n(translations)
      const returnString = i18n.t('textString')
      expect(returnString).toBe('Hello world')
    })

    it('returns the HTML for a given lookup key', () => {
      const i18n = new I18n(translations)
      const returnString = i18n.t('htmlString')
      expect(returnString).toBe(
        'Hello<span class="govuk-visually-hidden"> world</span>'
      )
    })

    it('returns the lookup key if no translation is defined', () => {
      const i18n = new I18n(translations)
      const returnString = i18n.t('missingString')
      expect(returnString).toBe('missingString')
    })

    it('throws an error if no lookup key is provided', () => {
      const i18n = new I18n(translations)

      // @ts-expect-error Parameter 'lookupKey' not provided
      expect(() => i18n.t()).toThrow('i18n: lookup key missing')
    })

    describe('string interpolation', () => {
      /** @type {{ [key: string]: unknown }} */
      const translations = {
        nameString: 'My name is %{name}'
      }

      it('throws an error if the options data is not present', () => {
        const i18n = new I18n(translations)
        expect(() => {
          i18n.t('nameString')
        }).toThrowError(
          'i18n: cannot replace placeholders in string if no option data provided'
        )
      })

      it('throws an error if the options object is empty', () => {
        const i18n = new I18n(translations)
        expect(() => {
          i18n.t('nameString', {})
        }).toThrowError(
          'i18n: no data found to replace %{name} placeholder in string'
        )
      })

      it('throws an error if the options object does not have a matching key', () => {
        const i18n = new I18n(translations)
        expect(() => {
          i18n.t('nameString', { unrelatedThing: 'hello' })
        }).toThrowError(
          'i18n: no data found to replace %{name} placeholder in string'
        )
      })

      it('only matches %{} as a placeholder', () => {
        const i18n = new I18n({
          price: '%{name}, this } item %{ costs $5.00'
        })
        expect(i18n.t('price', { name: 'John' })).toBe(
          'John, this } item %{ costs $5.00'
        )
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
        expect(() => {
          i18n.t('age', {})
        }).toThrowError(
          'i18n: no data found to replace %{valueOf} placeholder in string'
        )
      })

      it('replaces the placeholder with the provided data', () => {
        const i18n = new I18n(translations)
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
        const i18n = new I18n(translations)
        expect(
          i18n.t('nameString', { number: 50, name: 'Claire', otherName: 'Zoe' })
        ).toBe('My name is Claire')
      })

      it('replaces multiple placeholders, if present', () => {
        const i18n = new I18n({
          nameString: 'Their name is %{name}. %{name} is %{age} years old'
        })
        expect(
          i18n.t('nameString', {
            number: 50,
            name: 'Andrew',
            otherName: 'Vic',
            age: 22
          })
        ).toBe('Their name is Andrew. Andrew is 22 years old')
      })

      it('replaces very long placeholders', () => {
        const i18n = new I18n({
          nameString:
            'Hi %{aVeryLongPlaceholderName}. %{aVeryLongPlaceholderName}, it sure is nice to meet you.'
        })
        expect(i18n.t('nameString', { aVeryLongPlaceholderName: 'Bob' })).toBe(
          'Hi Bob. Bob, it sure is nice to meet you.'
        )
      })

      it('nested placeholder only resolves with a matching key', () => {
        const i18n = new I18n({
          nameString: 'Their name is %{name%{age}}'
        })
        expect(
          i18n.t('nameString', {
            name: 'Andrew',
            age: 55,
            'name%{age}': 'Testing'
          })
        ).toBe('Their name is Testing')
      })

      it('handles placeholder-style text within options values', () => {
        const i18n = new I18n(translations)
        expect(i18n.t('nameString', { name: '%{name}' })).toBe(
          'My name is %{name}'
        )
      })

      it('formats numbers that are passed as placeholders', () => {
        /** @type {{ [key: string]: unknown }} */
        const translations = { ageString: 'I am %{age} years old' }

        const i18nEn = new I18n(translations, { locale: 'en' })
        const i18nDe = new I18n(translations, { locale: 'de' })

        expect(i18nEn.t('ageString', { age: 2000 })).toBe(
          'I am 2,000 years old'
        )
        expect(i18nDe.t('ageString', { age: 2000 })).toBe(
          'I am 2.000 years old'
        )
      })

      it('does not format number-like strings that are passed as placeholders', () => {
        const i18n = new I18n({
          yearString: 'Happy new year %{year}'
        })

        expect(i18n.t('yearString', { year: '2023' })).toBe(
          'Happy new year 2023'
        )
      })
    })

    describe('pluralisation', () => {
      it('interpolates the count variable into the correct plural form', () => {
        const i18n = new I18n(
          {
            'test.one': '%{count} test',
            'test.other': '%{count} tests'
          },
          {
            locale: 'en'
          }
        )

        expect(i18n.t('test', { count: 1 })).toBe('1 test')
        expect(i18n.t('test', { count: 5 })).toBe('5 tests')
      })
    })
  })

  describe('.getPluralSuffix', () => {
    let consoleWarn

    beforeEach(() => {
      // Silence warnings in test output, and allow us to 'expect' them
      consoleWarn = jest
        .spyOn(global.console, 'warn')
        .mockImplementation(() => {
          /* noop */
        })
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('uses `Intl.PluralRules` when available', () => {
      const IntlPluralRulesSelect = jest
        .spyOn(global.Intl.PluralRules.prototype, 'select')
        .mockImplementation(() => 'one')

      const i18n = new I18n(
        {
          'test.one': 'test',
          'test.other': 'test'
        },
        {
          locale: 'en'
        }
      )

      expect(i18n.getPluralSuffix('test', 1)).toBe('one')
      expect(IntlPluralRulesSelect).toBeCalledWith(1)
    })

    it('falls back to internal fallback rules', () => {
      const i18n = new I18n(
        {
          'test.one': 'test',
          'test.other': 'test'
        },
        {
          locale: 'en'
        }
      )

      jest
        .spyOn(i18n, 'hasIntlPluralRulesSupport')
        .mockImplementation(() => false)

      const selectPluralFormUsingFallbackRules = jest.spyOn(
        i18n,
        'selectPluralFormUsingFallbackRules'
      )

      i18n.getPluralSuffix('test', 1)
      expect(selectPluralFormUsingFallbackRules).toBeCalledWith(1)
    })

    it('returns the preferred plural form for the locale if a translation exists', () => {
      const i18n = new I18n(
        {
          'test.one': 'test',
          'test.other': 'test'
        },
        {
          locale: 'en'
        }
      )
      expect(i18n.getPluralSuffix('test', 1)).toBe('one')
    })

    it.each([
      { form: 'one', count: 1 },
      { form: 'two', count: 2 },
      { form: 'few', count: 3 },
      { form: 'many', count: 6 }
    ])(
      '`$form` falls back to `other` if preferred form `$form` is missing',
      ({ count }) => {
        const i18n = new I18n(
          {
            'test.other': 'test'
          },
          {
            locale: 'cy'
          }
        )

        expect(i18n.getPluralSuffix('test', count)).toBe('other')
      }
    )

    it('logs a console warning when falling back to `other`', () => {
      const i18n = new I18n(
        {
          'test.other': 'test'
        },
        {
          locale: 'en'
        }
      )

      i18n.getPluralSuffix('test', 1)

      expect(consoleWarn).toHaveBeenCalledWith(
        'i18n: Missing plural form ".one" for "en" locale. Falling back to ".other".'
      )
    })

    it('throws an error if trying to use `other` but `other` is not provided', () => {
      const i18n = new I18n(
        {},
        {
          locale: 'en'
        }
      )

      expect(() => {
        i18n.getPluralSuffix('test', 2)
      }).toThrowError('i18n: Plural form ".other" is required for "en" locale')
    })

    it('throws an error if a plural form is not provided and neither is `other`', () => {
      const i18n = new I18n(
        {
          'test.one': 'test'
        },
        {
          locale: 'en'
        }
      )

      expect(() => {
        i18n.getPluralSuffix('test', 2)
      }).toThrowError('i18n: Plural form ".other" is required for "en" locale')
    })

    it('returns `other` for non-numbers', () => {
      const i18n = new I18n(
        {
          'test.other': 'test'
        },
        {
          locale: 'en'
        }
      )

      // @ts-expect-error Parameter 'count' not a number
      expect(i18n.getPluralSuffix('test', 'nonsense')).toBe('other')
    })
  })

  describe('.getPluralRulesForLocale', () => {
    it('returns the correct rules for a locale in the map', () => {
      const locale = 'ar'
      const i18n = new I18n({}, { locale })
      expect(i18n.getPluralRulesForLocale()).toBe('arabic')
    })

    it('returns the correct rules for a locale in the map with regional indicator', () => {
      const locale = 'pt-PT'
      const i18n = new I18n({}, { locale })
      expect(i18n.getPluralRulesForLocale()).toBe('spanish')
    })

    it('returns the correct rules for a locale allowing for no regional indicator', () => {
      const locale = 'cy-GB'
      const i18n = new I18n({}, { locale })
      expect(i18n.getPluralRulesForLocale()).toBe('welsh')
    })
  })

  describe('.selectPluralFormUsingFallbackRules', () => {
    // The locales we want to test, with numbers for any 'special cases' in
    // those locales we want to ensure are handled correctly
    /** @type {[string, number[]][]} */
    const locales = [
      ['ar', [105, 125]],
      ['zh', []],
      ['fr', []],
      ['de', []],
      ['ga', [9]],
      ['ru', [3, 13, 101]],
      ['gd', [15]],
      ['es', [1000000, 2000000]],
      ['cy', [3, 6]]
    ]

    it.each(locales)(
      'matches `Intl.PluralRules.select()` for %s locale',
      (locale, localeNumbers) => {
        const i18n = new I18n({}, { locale })
        const intl = new Intl.PluralRules(locale)

        const numbersToTest = [0, 1, 2, 5, 25, 100, ...localeNumbers]

        numbersToTest.forEach((num) => {
          expect(i18n.selectPluralFormUsingFallbackRules(num)).toBe(
            intl.select(num)
          )
        })
      }
    )

    it('returns "other" for unsupported locales', () => {
      const locale = 'la'
      const i18n = new I18n({}, { locale })

      const numbersToTest = [0, 1, 2, 5, 25, 100]

      numbersToTest.forEach((num) => {
        expect(i18n.selectPluralFormUsingFallbackRules(num)).toBe('other')
      })
    })
  })
})
