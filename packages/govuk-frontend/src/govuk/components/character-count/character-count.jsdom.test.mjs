import { getExamples, render } from '@govuk-frontend/lib/components'
import { outdent } from 'outdent'

import { CharacterCount } from './character-count.mjs'

describe('CharacterCount', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('character-count')
  })

  beforeEach(() => {
    const example = examples['to configure in JavaScript']

    // Some tests add attributes to `document.body` so we need to reset it
    // alongside both character count renders (for maxlength and maxwords)
    document.body.outerHTML = outdent`
      <body class="govuk-frontend-supported">
        ${render('character-count', example)}
        ${render('character-count', example)}
      </body>
    `
  })

  describe('formatCountMessage', () => {
    describe('default configuration', () => {
      let componentWithMaxLength
      let componentWithMaxWords

      beforeEach(() => {
        const $divs = document.querySelectorAll('[data-module]')

        componentWithMaxLength = new CharacterCount($divs[0], {
          maxlength: 100
        })

        componentWithMaxWords = new CharacterCount($divs[1], {
          maxwords: 100
        })
      })

      it.each([
        { number: 1, expected: 'You have 1 character remaining' },
        { number: 10, expected: 'You have 10 characters remaining' },
        { number: -1, expected: 'You have 1 character too many' },
        { number: -10, expected: 'You have 10 characters too many' },
        { number: 0, expected: 'You have 0 characters remaining' }
      ])(
        'outputs the expected translation for $number characters',
        ({ number, expected }) => {
          expect(
            componentWithMaxLength.formatCountMessage(number, 'characters')
          ).toEqual(expected)
        }
      )

      it.each([
        { number: 1, type: 'words', expected: 'You have 1 word remaining' },
        { number: 10, type: 'words', expected: 'You have 10 words remaining' },
        { number: -1, type: 'words', expected: 'You have 1 word too many' },
        { number: -10, type: 'words', expected: 'You have 10 words too many' },
        { number: 0, type: 'words', expected: 'You have 0 words remaining' }
      ])(
        'outputs the expected translation for $number words',
        ({ number, expected }) => {
          expect(
            componentWithMaxWords.formatCountMessage(number, 'words')
          ).toEqual(expected)
        }
      )

      it('formats the number inserted in the message', () => {
        expect(componentWithMaxWords.formatCountMessage(10000, 'words')).toBe(
          'You have 10,000 words remaining'
        )
        expect(componentWithMaxWords.formatCountMessage(-10000, 'words')).toBe(
          'You have 10,000 words too many'
        )
      })
    })

    describe('i18n', () => {
      describe('JavaScript configuration', () => {
        it('overrides the default translation keys', () => {
          const $div = document.querySelector('[data-module]')
          const component = new CharacterCount($div, {
            maxlength: 100,
            i18n: {
              charactersUnderLimit: { one: 'Custom text. Count: %{count}' }
            }
          })

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(1, 'characters')).toBe(
            'Custom text. Count: 1'
          )

          // Other keys remain untouched
          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(10, 'characters')).toBe(
            'You have 10 characters remaining'
          )
        })

        it('uses specific keys for when limit is reached', () => {
          const $divs = document.querySelectorAll('[data-module]')

          const componentWithMaxLength = new CharacterCount($divs[0], {
            maxlength: 100,
            i18n: {
              charactersAtLimit: 'Custom text.'
            }
          })

          const componentWithMaxWords = new CharacterCount($divs[1], {
            maxwords: 100,
            i18n: {
              wordsAtLimit: 'Different custom text.'
            }
          })

          expect(
            // @ts-expect-error Property 'formatCountMessage' is private
            componentWithMaxLength.formatCountMessage(0, 'characters')
          ).toBe('Custom text.')

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(componentWithMaxWords.formatCountMessage(0, 'words')).toBe(
            'Different custom text.'
          )
        })
      })

      describe('lang attribute configuration', () => {
        it('overrides the locale when set on the element', () => {
          const $div = document.querySelector('[data-module]')
          $div.setAttribute('lang', 'de')

          const component = new CharacterCount($div, { maxwords: 20000 })

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(10000, 'words')).toBe(
            'You have 10.000 words remaining'
          )
        })

        it('overrides the locale when set on an ancestor', () => {
          document.body.setAttribute('lang', 'de')

          const $div = document.querySelector('[data-module]')

          const component = new CharacterCount($div, { maxwords: 20000 })

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(10000, 'words')).toBe(
            'You have 10.000 words remaining'
          )
        })
      })

      describe('Data attribute configuration', () => {
        it('overrides the default translation keys', () => {
          const $div = document.querySelector('[data-module]')
          $div.setAttribute(
            'data-i18n.characters-under-limit.one',
            'Custom text. Count: %{count}'
          )

          const component = new CharacterCount($div, { maxlength: 100 })

          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(1, 'characters')).toBe(
            'Custom text. Count: 1'
          )

          // Other keys remain untouched
          // @ts-expect-error Property 'formatCountMessage' is private
          expect(component.formatCountMessage(10, 'characters')).toBe(
            'You have 10 characters remaining'
          )
        })

        describe('precedence over JavaScript configuration', () => {
          it('overrides translation keys', () => {
            const $div = document.querySelector('[data-module]')
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
            expect(component.formatCountMessage(1, 'characters')).toBe(
              'Custom text. Count: 1'
            )

            // Other keys remain untouched
            // @ts-expect-error Property 'formatCountMessage' is private
            expect(component.formatCountMessage(-10, 'characters')).toBe(
              'You have 10 characters too many'
            )

            // @ts-expect-error Property 'formatCountMessage' is private
            expect(component.formatCountMessage(0, 'characters')).toBe(
              'You have 0 characters remaining'
            )
          })
        })
      })
    })
  })
})
