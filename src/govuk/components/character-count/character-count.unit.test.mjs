import CharacterCount from './character-count.mjs'

describe('CharacterCount', () => {
  let $container
  let $textarea

  beforeAll(() => {
    $container = document.createElement('div')
    $textarea = document.createElement('textarea')

    // Component checks that required elements are present
    $textarea.classList.add('govuk-js-character-count')
    $container.appendChild($textarea)
  })

  describe('formatCountMessage', () => {
    describe('default configuration', () => {
      let component

      beforeAll(() => {
        const $div = $container.cloneNode(true)
        component = new CharacterCount($div)
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
          const $div = $container.cloneNode(true)
          const component = new CharacterCount($div, {
            i18n: { charactersUnderLimit: { one: 'Custom text. Count: %{count}' } }
          })

          expect(component.formatCountMessage(1, 'characters')).toEqual('Custom text. Count: 1')
          // Other keys remain untouched
          expect(component.formatCountMessage(10, 'characters')).toEqual('You have 10 characters remaining')
        })

        it('uses specific keys for when limit is reached', () => {
          const $div = $container.cloneNode(true)
          const component = new CharacterCount($div, {
            i18n: {
              charactersAtLimit: 'Custom text.',
              wordsAtLimit: 'Different custom text.'
            }
          })

          expect(component.formatCountMessage(0, 'characters')).toEqual('Custom text.')
          expect(component.formatCountMessage(0, 'words')).toEqual('Different custom text.')
        })
      })

      describe('lang attribute configuration', () => {
        it('overrides the locale when set on the element', () => {
          const $div = $container.cloneNode(true)
          $div.setAttribute('lang', 'de')

          const component = new CharacterCount($div)

          expect(component.formatCountMessage(10000, 'words')).toEqual('You have 10.000 words remaining')
        })

        it('overrides the locale when set on an ancestor', () => {
          const $parent = document.createElement('div')
          $parent.setAttribute('lang', 'de')

          const $div = $container.cloneNode(true)
          $parent.appendChild($div)

          const component = new CharacterCount($div)

          expect(component.formatCountMessage(10000, 'words')).toEqual('You have 10.000 words remaining')
        })
      })

      describe('Data attribute configuration', () => {
        it('overrides the default translation keys', () => {
          const $div = $container.cloneNode(true)
          $div.setAttribute('data-i18n.characters-under-limit.one', 'Custom text. Count: %{count}')

          const component = new CharacterCount($div)

          expect(component.formatCountMessage(1, 'characters')).toEqual('Custom text. Count: 1')
          // Other keys remain untouched
          expect(component.formatCountMessage(10, 'characters')).toEqual('You have 10 characters remaining')
        })

        describe('precedence over JavaScript configuration', () => {
          it('overrides translation keys', () => {
            const $div = $container.cloneNode(true)
            $div.setAttribute('data-i18n.characters-under-limit.one', 'Custom text. Count: %{count}')

            const component = new CharacterCount($div, {
              i18n: {
                charactersUnderLimit: {
                  one: 'Different custom text. Count: %{count}'
                }
              }
            })
            expect(component.formatCountMessage(1, 'characters')).toEqual('Custom text. Count: 1')
            // Other keys remain untouched
            expect(component.formatCountMessage(-10, 'characters')).toEqual('You have 10 characters too many')
            expect(component.formatCountMessage(0, 'characters')).toEqual('You have 0 characters remaining')
          })
        })
      })
    })
  })
})
