/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import I18n from './i18n'

describe('with translations', () => {
  it('looks up a translation by key', () => {
    const i18nInstance = new I18n({
      translations: {
        hello: 'bonjour'
      }
    })

    expect(i18nInstance.t('hello')).toBe('bonjour')
  })
})
