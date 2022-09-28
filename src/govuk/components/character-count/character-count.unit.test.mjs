/**
 * @jest-environment jsdom
 */

import CharacterCount from './character-count.mjs'

describe('CharacterCount', () => {
  describe('formatCountMessage', () => {
    let component
    beforeAll(() => {
      // The component won't initialise if we don't pass it an element
      component = new CharacterCount(document.createElement('div'))
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
})
