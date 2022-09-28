/**
 * @jest-environment jsdom
 */

import CharacterCount from './character-count.mjs'

describe('CharacterCount', () => {
  describe('formatCountMessage', () => {
    describe('default configuration', () => {
      let component
      beforeAll(() => {
        // The component won't initialise if we don't pass it an element
        component = new CharacterCount(createElement('div'))
      })

      it('formats singular remaining characters', () => {
        expect(component.formatCountMessage(1, 'characters')).toEqual('You have 1 character remaining')
      })
      it('formats plural remaining characters', () => {
        expect(component.formatCountMessage(10, 'characters')).toEqual('You have 10 characters remaining')
      })
      it('formats singular exceeding characters', () => {
        expect(component.formatCountMessage(-1, 'characters')).toEqual('You have 1 character too many')
      })
      it('formats plural exceeding characters', () => {
        expect(component.formatCountMessage(-10, 'characters')).toEqual('You have 10 characters too many')
      })
      it('formats character limit being met', () => {
        expect(component.formatCountMessage(0, 'characters')).toEqual('You have 0 characters remaining')
      })

      it('formats singular remaining words', () => {
        expect(component.formatCountMessage(1, 'words')).toEqual('You have 1 word remaining')
      })
      it('formats plural remaining words', () => {
        expect(component.formatCountMessage(10, 'words')).toEqual('You have 10 words remaining')
      })
      it('formats singular exceeding words', () => {
        expect(component.formatCountMessage(-1, 'words')).toEqual('You have 1 word too many')
      })
      it('formats plural exceeding words', () => {
        expect(component.formatCountMessage(-10, 'words')).toEqual('You have 10 words too many')
      })
      it('formats word limit being met', () => {
        expect(component.formatCountMessage(0, 'words')).toEqual('You have 0 words remaining')
      })
    })

    describe('i18n', () => {
      describe('JavaScript configuration', () => {
        it('overrides the default configuration', () => {
          const component = new CharacterCount(createElement('div'), {
            i18n: { charactersUnderLimitOne: 'Custom text. Count: %{count}' },
            'i18n.charactersOverLimitOther': 'Different custom text. Count: %{count}'
          })
          expect(component.formatCountMessage(1, 'characters')).toEqual('Custom text. Count: 1')
          expect(component.formatCountMessage(-10, 'characters')).toEqual('Different custom text. Count: 10')
          // Other keys remain untouched
          expect(component.formatCountMessage(10, 'characters')).toEqual('You have 10 characters remaining')
        })
      })

      describe('Data attribute configuration', () => {
        it('overrides the default configuration', () => {
          const $div = createElement('div', { 'data-i18n.characters-under-limit-one': 'Custom text. Count: %{count}' })
          const component = new CharacterCount($div)
          expect(component.formatCountMessage(1, 'characters')).toEqual('Custom text. Count: 1')
          // Other keys remain untouched
          expect(component.formatCountMessage(10, 'characters')).toEqual('You have 10 characters remaining')
        })

        it('overrides the JavaScript configuration', () => {
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

function createElement (tagName, { ...attributes } = {}) {
  const el = document.createElement(tagName)

  Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
    el.setAttribute(attributeName, attributeValue)
  })

  return el
}
