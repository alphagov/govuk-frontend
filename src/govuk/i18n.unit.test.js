/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import I18n from './i18n'

describe('i18n.t', () => {
  test('returns translation lookup by key', () => {
    const i18nFunction = new I18n({
      translations: {
        mycomponent: {
          hello: 'bonjour'
        }
      }
    })

    expect(i18nFunction.t('mycomponent.hello')).toBe('bonjour')
  })

  test('returns fallback if lookup key not present', () => {
    const i18nFunction = new I18n({
      translations: {
        mycomponent: {
          hello: 'bonjour'
        }
      }
    })

    expect(i18nFunction.t('mycomponent.goodbye', { fallback: 'bye' })).toBe('bye')
  })

  test('returns key if lookup key not present and no fallback provided', () => {
    const i18nFunction = new I18n({
      translations: {
        mycomponent: {
          hello: 'bonjour'
        }
      }
    })

    expect(i18nFunction.t('mycomponent.welcome')).toBe('mycomponent.welcome')
  })

  test('returns key with underscore if lookup key not present and no fallback provided', () => {
    const i18nFunction = new I18n({
      translations: {
        mycomponent: {
          hello: 'bonjour'
        }
      }
    })

    expect(i18nFunction.t('mycomponent.new_welcome')).toBe('mycomponent.new_welcome')
  })
})
