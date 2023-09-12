import { CharacterCount } from './character-count.mjs'

describe('CharacterCount', () => {
  let $container
  let $textarea

  beforeAll(() => {
    $container = document.createElement('div')
    $textarea = document.createElement('textarea')

    // Component checks that GOV.UK Frontend is supported
    document.body.classList.add('govuk-frontend-supported')

    // Component checks that required elements are present
    $textarea.classList.add('govuk-js-character-count')
    $container.appendChild($textarea)
  })

  describe('formatCountMessage', () => {
    describe('default configuration', () => {
      let componentWithMaxLength
      let componentWithMaxWords

      beforeAll(() => {
        const $div = $container.cloneNode(true)
        componentWithMaxLength = new CharacterCount($div, { maxlength: 100 })
        componentWithMaxWords = new CharacterCount($div, { maxwords: 100 })
      })

      const cases = [
        {
          number: 1,
          type: 'characters',
          expected: 'You have 1 character remaining'
        },
        {
          number: 10,
          type: 'characters',
          expected: 'You have 10 characters remaining'
        },
        {
          number: -1,
          type: 'characters',
          expected: 'You have 1 character too many'
        },
        {
          number: -10,
          type: 'characters',
          expected: 'You have 10 characters too many'
        },
        {
          number: 0,
          type: 'characters',
          expected: 'You have 0 characters remaining'
        },
        { number: 1, type: 'words', expected: 'You have 1 word remaining' },
        { number: 10, type: 'words', expected: 'You have 10 words remaining' },
        { number: -1, type: 'words', expected: 'You have 1 word too many' },
        { number: -10, type: 'words', expected: 'You have 10 words too many' },
        { number: 0, type: 'words', expected: 'You have 0 words remaining' }
      ]
      it.each(cases)(
        'picks the relevant translation for $number $type',
        function test({ number, type, expected }) {
          if (type === 'characters') {
            expect(
              componentWithMaxLength.formatCountMessage(number, type)
            ).toEqual(expected)
          } else {
            expect(
              componentWithMaxWords.formatCountMessage(number, type)
            ).toEqual(expected)
          }
        }
      )

      it('formats the number inserted in the message', () => {
        expect(
          componentWithMaxWords.formatCountMessage(10000, 'words')
        ).toEqual('You have 10,000 words remaining')
        expect(
          componentWithMaxWords.formatCountMessage(-10000, 'words')
        ).toEqual('You have 10,000 words too many')
      })
    })

    describe('i18n', () => {
      describe('JavaScript configuration', () => {
        it('overrides the default translation keys', () => {
          const $div = $container.cloneNode(true)
          const component = new CharacterCount($div, {
            maxlength: 100,
            i18n: {
              charactersUnderLimit: { one: 'Custom text. Count: %{count}' }
            }
          })

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(1, 'characters')).toEqual(
            'Custom text. Count: 1'
          )

          // Other keys remain untouched
          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(10, 'characters')).toEqual(
            'You have 10 characters remaining'
          )
        })

        it('uses specific keys for when limit is reached', () => {
          const $div = $container.cloneNode(true)
          const componentWithMaxLength = new CharacterCount($div, {
            maxlength: 100,
            i18n: {
              charactersAtLimit: 'Custom text.'
            }
          })
          const componentWithMaxWords = new CharacterCount($div, {
            maxwords: 100,
            i18n: {
              wordsAtLimit: 'Different custom text.'
            }
          })

          expect(
            // @ts-expect-error Property 'formatCountMessage' is private
            componentWithMaxLength.formatCountMessage(0, 'characters')
          ).toEqual('Custom text.')

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(componentWithMaxWords.formatCountMessage(0, 'words')).toEqual(
            'Different custom text.'
          )
        })
      })

      describe('lang attribute configuration', () => {
        it('overrides the locale when set on the element', () => {
          const $div = $container.cloneNode(true)
          $div.setAttribute('lang', 'de')

          const component = new CharacterCount($div, { maxwords: 20000 })

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(10000, 'words')).toEqual(
            'You have 10.000 words remaining'
          )
        })

        it('overrides the locale when set on an ancestor', () => {
          const $parent = document.createElement('div')
          $parent.setAttribute('lang', 'de')

          const $div = $container.cloneNode(true)
          $parent.appendChild($div)

          const component = new CharacterCount($div, { maxwords: 20000 })

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(10000, 'words')).toEqual(
            'You have 10.000 words remaining'
          )
        })
      })

      describe('Data attribute configuration', () => {
        it('overrides the default translation keys', () => {
          const $div = $container.cloneNode(true)
          $div.setAttribute(
            'data-i18n.characters-under-limit.one',
            'Custom text. Count: %{count}'
          )

          const component = new CharacterCount($div, { maxlength: 100 })

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(1, 'characters')).toEqual(
            'Custom text. Count: 1'
          )

          // Other keys remain untouched
          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(10, 'characters')).toEqual(
            'You have 10 characters remaining'
          )
        })

        describe('precedence over JavaScript configuration', () => {
          it('overrides translation keys', () => {
            const $div = $container.cloneNode(true)
            $div.setAttribute(
              'data-i18n.characters-under-limit.one',
              'Custom text. Count: %{count}'
            )

            const component = new CharacterCount($div, {
              maxlength: 100,
              i18n: {
                charactersUnderLimit: {
                  one: 'Different custom text. Count: %{count}'
                }
              }
            })

            // @ts-expect-error Property 'formatCountMessage' is private
            expect(component.formatCountMessage(1, 'characters')).toEqual(
              'Custom text. Count: 1'
            )

            // Other keys remain untouched
            // @ts-expect-error Property 'formatCountMessage' is private
            expect(component.formatCountMessage(-10, 'characters')).toEqual(
              'You have 10 characters too many'
            )

            // @ts-expect-error Property 'formatCountMessage' is private
            expect(component.formatCountMessage(0, 'characters')).toEqual(
              'You have 0 characters remaining'
            )
          })
        })
      })
    })
  })
})
