/**
 * @jest-environment jsdom
 */

import { createElement } from '../../../../lib/dom-helpers.mjs'
import CharacterCount from './character-count.mjs'

describe('CharacterCount', () => {
  describe('formatCountMessage', () => {
    describe('default configuration', () => {
      let component
      beforeAll(() => {
        // The component won't initialise if we don't pass it an element
        component = new CharacterCount(createElement('div'))
      })

      const cases = [
        { number: 1, type: 'characters', expected: 'You have 1 character remaining' },
        { number: 10, type: 'characters', expected: 'You have 10 characters remaining' },
        { number: -1, type: 'characters', expected: 'You have 1 character too many' },
        { number: -10, type: 'characters', expected: 'You have 10 characters too many' },
        { number: 0, type: 'characters', expected: 'You have 0 characters remaining' },
        { number: 1, type: 'words', expected: 'You have 1 word remaining' },
        { number: 10, type: 'words', expected: 'You have 10 words remaining' },
        { number: -1, type: 'words', expected: 'You have 1 word too many' },
        { number: -10, type: 'words', expected: 'You have 10 words too many' },
        { number: 0, type: 'words', expected: 'You have 0 words remaining' }
      ]
      it.each(cases)(
        'picks the relevant translation for $number $type',
        function test ({ number, type, expected }) {
          expect(component.formatCountMessage(number, type)).toEqual(expected)
        }
      )

      it('formats the number inserted in the message', () => {
        expect(component.formatCountMessage(10000, 'words')).toEqual('You have 10,000 words remaining')
        expect(component.formatCountMessage(-10000, 'words')).toEqual('You have 10,000 words too many')
      })
    })

    describe('i18n', () => {
      describe('JavaScript configuration', () => {
        it('overrides the default translation keys', () => {
          const component = new CharacterCount(createElement('div'), {
            i18n: { charactersUnderLimitOne: 'Custom text. Count: %{count}' },
            'i18n.charactersOverLimitOther': 'Different custom text. Count: %{count}'
          })
          expect(component.formatCountMessage(1, 'characters')).toEqual('Custom text. Count: 1')
          expect(component.formatCountMessage(-10, 'characters')).toEqual('Different custom text. Count: 10')
          // Other keys remain untouched
          expect(component.formatCountMessage(10, 'characters')).toEqual('You have 10 characters remaining')
        })

        it('uses specific keys for when limit is reached', () => {
          const component = new CharacterCount(createElement('div'), {
            i18n: { charactersAtLimit: 'Custom text.' },
            'i18n.wordsAtLimit': 'Different custom text.'
          })
          expect(component.formatCountMessage(0, 'characters')).toEqual('Custom text.')
          expect(component.formatCountMessage(0, 'words')).toEqual('Different custom text.')
        })
      })

      describe('lang attribute configuration', () => {
        it('overrides the locale when set on the element', () => {
          const $div = createElement('div', {
            lang: 'de'
          })
          const component = new CharacterCount($div)

          expect(component.formatCountMessage(10000, 'words')).toEqual('You have 10.000 words remaining')
        })

        it('overrides the locale when set on an ancestor', () => {
          const $parent = createElement('div', { lang: 'de' })
          const $div = createElement('div')
          $parent.appendChild($div)
          const component = new CharacterCount($div)

          expect(component.formatCountMessage(10000, 'words')).toEqual('You have 10.000 words remaining')
        })
      })

      describe('Data attribute configuration', () => {
        it('overrides the default translation keys', () => {
          const $div = createElement('div', { 'data-i18n.characters-under-limit-one': 'Custom text. Count: %{count}' })
          const component = new CharacterCount($div)
          expect(component.formatCountMessage(1, 'characters')).toEqual('Custom text. Count: 1')
          // Other keys remain untouched
          expect(component.formatCountMessage(10, 'characters')).toEqual('You have 10 characters remaining')
        })

        describe('precedence over JavaScript configuration', () => {
          it('overrides translation keys', () => {
            const $div = createElement('div', { 'data-i18n.characters-under-limit-one': 'Custom text. Count: %{count}' })
            const component = new CharacterCount($div, {
              i18n: {
                charactersUnderLimitOne: 'Different custom text. Count: %{count}'
              }
            })
            expect(component.formatCountMessage(1, 'characters')).toEqual('Custom text. Count: 1')
            // Other keys remain untouched
            expect(component.formatCountMessage(10, 'characters')).toEqual('You have 10 characters remaining')
          })
        })
      })
    })
  })
})
