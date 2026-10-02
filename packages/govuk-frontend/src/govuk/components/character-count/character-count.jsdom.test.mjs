/* eslint-disable no-new */

import { getExamples, render } from '@govuk-frontend/lib/components'
import { within } from '@testing-library/dom'
import { userEvent } from '@testing-library/user-event'
import { outdent } from 'outdent'

import { CharacterCount } from './character-count.mjs'

const user = userEvent.setup()

describe('Character count', () => {
  /** @type {Awaited<ReturnType<typeof getExamples>>} */
  let examples

  /** @type {HTMLElement} */
  let $root

  /** @type {HTMLElement} */
  let $textarea

  /** @type {HTMLElement | null} */
  let $description

  /**
   * @param {keyof typeof examples} example
   */
  function initExample(example) {
    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = render('character-count', examples[example])

    $root = /** @type {HTMLElement} */ (
      document.querySelector(`[data-module="${CharacterCount.moduleName}"]`)
    )

    $textarea = within($root).getByRole('textbox')
    $description = document.getElementById(`${$textarea.id}-info`)

    jest.spyOn($textarea, 'addEventListener')
    jest.spyOn(window, 'addEventListener')
    jest.spyOn(console, 'warn').mockImplementation()
  }

  beforeAll(async () => {
    examples = await getExamples('character-count')
  })

  beforeEach(() => {
    initExample('default')
  })

  describe('Initialisation via class', () => {
    /** @type {typeof Intl.Segmenter} */
    let Segmenter

    beforeEach(() => {
      Segmenter = Intl.Segmenter
    })

    afterEach(() => {
      Object.assign(Intl, { Segmenter })
    })

    it('should add event listeners', () => {
      new CharacterCount($root)

      expect($textarea.addEventListener).toHaveBeenCalledWith(
        'input',
        expect.any(Function)
      )

      expect($textarea.addEventListener).toHaveBeenCalledWith(
        'focus',
        expect.any(Function)
      )

      expect($textarea.addEventListener).toHaveBeenCalledWith(
        'blur',
        expect.any(Function)
      )

      expect(window.addEventListener).toHaveBeenCalledWith(
        'pageshow',
        expect.any(Function)
      )
    })

    it('should not throw with $root element', () => {
      expect(() => new CharacterCount($root)).not.toThrow()
    })

    it('should throw with unsupported browser', () => {
      document.body.classList.remove('govuk-frontend-supported')

      expect(() => new CharacterCount($root)).toThrow(
        'GOV.UK Frontend is not supported in this browser'
      )
    })

    it('should throw with missing $root element', () => {
      // @ts-expect-error Parameter '$root' not provided
      expect(() => new CharacterCount()).toThrow(
        `${CharacterCount.moduleName}: Root element (\`$root\`) not found`
      )
    })

    it('should throw with wrong $root element type', () => {
      const $svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

      expect(() => new CharacterCount($svg)).toThrow(
        `${CharacterCount.moduleName}: Root element (\`$root\`) is not of type HTMLElement`
      )
    })

    it('should throw with wrong input element type', () => {
      const $div = document.createElement('div')
      $div.classList.add('govuk-js-character-count')

      $textarea.replaceWith($div)

      expect(() => new CharacterCount($root)).toThrow(
        `${CharacterCount.moduleName}: Form field (\`.govuk-js-character-count\`) is not of type HTMLTextareaElement or HTMLInputElement`
      )
    })

    it('should throw with missing textarea', () => {
      $textarea.remove()

      expect(() => new CharacterCount($root)).toThrow(
        `${CharacterCount.moduleName}: Form field (\`.govuk-js-character-count\`) not found`
      )
    })

    it('should throw with missing count message', () => {
      $description?.remove()

      expect(() => new CharacterCount($root)).toThrow(
        `${CharacterCount.moduleName}: Count message (\`id="more-detail-info"\`) not found`
      )
    })

    it('should throw without Intl.Segmenter support', () => {
      // @ts-expect-error The operand of a 'delete' operator cannot be a read-only property
      delete Intl.Segmenter

      expect(() => {
        new CharacterCount($root, {
          countType: 'characters'
        })
      }).toThrow(
        `${CharacterCount.moduleName}: Support for "Intl.Segmenter" required`
      )
    })

    it('should throw when initialised twice', () => {
      expect(() => {
        new CharacterCount($root)
        new CharacterCount($root)
      }).toThrow(
        `${CharacterCount.moduleName}: Root element (\`$root\`) already initialised`
      )
    })

    it('should handle deprecated params', async () => {
      await user.click($textarea)
      await user.keyboard('Existing value')

      const component = new CharacterCount($root)

      // @ts-expect-error Property 'formatCountMessage' is private
      expect(component.getCountMessage()).toBe('You have 4 characters too many')

      // Temporarily allow deprecated `countType = 'characters'` parameter
      // @ts-expect-error Property 'formatCountMessage' is private
      expect(component.formatCountMessage(200, 'characters')).toBe(
        'You have 200 characters remaining'
      )

      // Temporarily allow deprecated `countType = 'length'` parameter
      // @ts-expect-error Property 'formatCountMessage' is private
      expect(component.formatCountMessage(200, 'length')).toBe(
        'You have 200 characters remaining'
      )

      // Temporarily allow deprecated `countType = 'words'` parameter
      // @ts-expect-error Property 'formatCountMessage' is private
      expect(component.formatCountMessage(200, 'words')).toBe(
        'You have 200 words remaining'
      )
    })
  })

  describe('Nunjucks configuration', () => {
    it('configures `maxlength`', () => {
      const characterCount = new CharacterCount($root)
      expect(characterCount._config).toEqual({
        ...CharacterCount.defaults,
        maxlength: 10,
        threshold: 0,
        countType: 'length'
      })
    })

    it('configures `maxwords` (deprecated)', () => {
      initExample('with maxwords')

      const characterCount = new CharacterCount($root)
      expect(characterCount._config).toEqual({
        ...CharacterCount.defaults,
        maxlength: 10,
        maxwords: 10,
        threshold: 0,
        countType: 'words'
      })

      expect(console.warn).toHaveBeenCalledWith(
        `${CharacterCount.moduleName}: Option \`maxwords\` is deprecated. Use \`maxlength\` with \`countType: "words"\` instead.`
      )
    })

    it('configures `countType: "length"`', () => {
      initExample("with count type 'length'")

      const characterCount = new CharacterCount($root)
      expect(characterCount._config).toEqual({
        ...CharacterCount.defaults,
        maxlength: 200,
        threshold: 0,
        countType: 'length'
      })
    })

    it('configures `countType: "characters"`', () => {
      initExample("with count type 'characters'")

      const characterCount = new CharacterCount($root)
      expect(characterCount._config).toEqual({
        ...CharacterCount.defaults,
        maxlength: 200,
        threshold: 0,
        countType: 'characters'
      })
    })

    it('configures `countType: "words"`', () => {
      initExample("with count type 'words'")

      const characterCount = new CharacterCount($root)
      expect(characterCount._config).toEqual({
        ...CharacterCount.defaults,
        maxlength: 50,
        threshold: 0,
        countType: 'words'
      })
    })

    it('configures `threshold`', () => {
      initExample('with threshold')

      const characterCount = new CharacterCount($root)
      expect(characterCount._config).toEqual({
        ...CharacterCount.defaults,
        maxlength: 10,
        threshold: 75,
        countType: 'length'
      })
    })

    it('ignores unknown data attributes', () => {
      document.body.innerHTML = render('character-count', {
        context: {
          label: {
            text: 'Can you provide more detail?'
          },
          name: 'more-detail',
          maxlength: 10,
          attributes: {
            'data-unknown1': '100',
            'data-unknown2': 200,
            'data-unknown3': false
          }
        }
      })

      const characterCount = new CharacterCount(
        document.querySelector(`[data-module="${CharacterCount.moduleName}"]`)
      )

      expect(characterCount._config).toEqual({
        ...CharacterCount.defaults,
        maxlength: 10,
        threshold: 0,
        countType: 'length'
      })
    })
  })

  describe('JavaScript configuration', () => {
    beforeEach(() => {
      initExample('to configure in JavaScript')
    })

    describe('during initialisation', () => {
      it('overrides the default translation keys', () => {
        const component = new CharacterCount($root, {
          maxlength: 100,
          i18n: {
            charactersUnderLimit: { one: 'Custom text. Count: %{count}' }
          }
        })

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(1)).toBe('Custom text. Count: 1')

        // Other keys remain untouched
        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(10)).toBe(
          'You have 10 characters remaining'
        )
      })

      it('uses specific translation keys when `maxlength` limit is reached', () => {
        const component = new CharacterCount($root, {
          maxlength: 100,
          i18n: {
            charactersAtLimit: 'Custom text.'
          }
        })

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(0)).toBe('Custom text.')
      })

      it('uses specific translation keys when `maxwords` limit is reached', () => {
        const component = new CharacterCount($root, {
          maxwords: 100,
          i18n: {
            wordsAtLimit: 'Different custom text.'
          }
        })

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(0)).toBe('Different custom text.')
      })

      it('uses existing textarea value for `maxlength` limit when initialised', async () => {
        await user.click($textarea)
        await user.keyboard('Existing value')

        const component = new CharacterCount($root, {
          maxlength: 100
        })

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.getCountMessage()).toBe(
          'You have 86 characters remaining'
        )
      })

      it('uses existing textarea value for `maxwords` limit when initialised', async () => {
        await user.click($textarea)
        await user.keyboard('Existing value')

        const component = new CharacterCount($root, {
          maxwords: 100
        })

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.getCountMessage()).toBe('You have 98 words remaining')
      })

      it('uses current textarea value for `maxlength` limit via back/forward navigation', async () => {
        const component = new CharacterCount($root, {
          maxlength: 100
        })

        await user.click($textarea)
        await user.keyboard('Newly updated value')

        // Trigger back/forward navigation
        // https://github.com/capricorn86/happy-dom/issues/1848
        const pageshowEvent = new Event('pageshow')
        Object.defineProperty(pageshowEvent, 'persisted', { value: true })
        window.dispatchEvent(pageshowEvent)

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.getCountMessage()).toBe(
          'You have 81 characters remaining'
        )
      })

      it('uses current textarea value for `maxwords` limit via back/forward navigation', async () => {
        const component = new CharacterCount($root, {
          maxwords: 100
        })

        await user.click($textarea)
        await user.keyboard('Newly updated value')

        // Trigger back/forward navigation
        // https://github.com/capricorn86/happy-dom/issues/1848
        const pageshowEvent = new Event('pageshow')
        Object.defineProperty(pageshowEvent, 'persisted', { value: true })
        window.dispatchEvent(pageshowEvent)

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.getCountMessage()).toBe('You have 97 words remaining')
      })
    })

    describe('with HTML lang attribute', () => {
      afterEach(() => {
        document.body.removeAttribute('lang')
        $root.removeAttribute('lang')
      })

      it('overrides the locale when set on the element', () => {
        $root.setAttribute('lang', 'de')

        const component = new CharacterCount($root, {
          maxwords: 20000
        })

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(10000)).toBe(
          'You have 10.000 words remaining'
        )
      })

      it('overrides the locale when set on an ancestor', () => {
        document.body.setAttribute('lang', 'de')

        const component = new CharacterCount($root, {
          maxwords: 20000
        })

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(10000)).toBe(
          'You have 10.000 words remaining'
        )
      })
    })

    describe('with HTML data attributes', () => {
      it('overrides the default translation keys', () => {
        $root.setAttribute(
          'data-i18n.characters-under-limit.one',
          'Custom text. Count: %{count}'
        )

        const component = new CharacterCount($root, {
          maxlength: 100
        })

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(1)).toBe('Custom text. Count: 1')

        // Other keys remain untouched
        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(10)).toBe(
          'You have 10 characters remaining'
        )
      })

      it('overrides the default translation keys and configuration', () => {
        $root.setAttribute(
          'data-i18n.characters-under-limit.one',
          'Custom text. Count: %{count}'
        )

        const component = new CharacterCount($root, {
          maxlength: 100,
          i18n: {
            charactersUnderLimit: {
              one: 'Different custom text. Count: %{count}'
            }
          }
        })

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(1)).toBe('Custom text. Count: 1')

        // Other keys remain untouched
        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(-10)).toBe(
          'You have 10 characters too many'
        )

        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(0)).toBe(
          'You have 0 characters remaining'
        )
      })
    })
  })
})

describe('Character count: Format count message', () => {
  /** @type {Awaited<ReturnType<typeof getExamples>>} */
  let examples

  let /** @type {CharacterCount} */ component
  let /** @type {CharacterCount} */ componentWithCountTypeCharacters
  let /** @type {CharacterCount} */ componentWithCountTypeWords

  // Deprecated `maxwords` option where `countType` is inferred
  let /** @type {CharacterCount} */ componentWithMaxWords

  beforeAll(async () => {
    examples = await getExamples('character-count')
  })

  beforeEach(() => {
    const example = examples['to configure in JavaScript']

    document.body.classList.add('govuk-frontend-supported')
    document.body.innerHTML = outdent`
      ${render('character-count', example)}
      ${render('character-count', example)}
      ${render('character-count', example)}
      ${render('character-count', example)}
    `

    const $roots = document.querySelectorAll(
      `[data-module="${CharacterCount.moduleName}"]`
    )

    component = new CharacterCount($roots[0], {
      maxlength: 100
    })

    componentWithCountTypeCharacters = new CharacterCount($roots[1], {
      maxlength: 100,
      countType: 'length'
    })

    componentWithCountTypeWords = new CharacterCount($roots[2], {
      maxlength: 100,
      countType: 'words'
    })

    componentWithMaxWords = new CharacterCount($roots[3], {
      maxwords: 100
    })
  })

  describe('default configuration', () => {
    it.each([
      { number: 1, expected: 'You have 1 character remaining' },
      { number: 10, expected: 'You have 10 characters remaining' },
      { number: -1, expected: 'You have 1 character too many' },
      { number: -10, expected: 'You have 10 characters too many' },
      { number: 0, expected: 'You have 0 characters remaining' }
    ])(
      'outputs the expected translation for $number characters',
      ({ number, expected }) => {
        // @ts-expect-error Property 'formatCountMessage' is private
        expect(component.formatCountMessage(number)).toEqual(expected)

        expect(
          // @ts-expect-error Property 'formatCountMessage' is private
          componentWithCountTypeCharacters.formatCountMessage(number)
        ).toEqual(expected)
      }
    )

    it.each([
      { number: 1, expected: 'You have 1 word remaining' },
      { number: 10, expected: 'You have 10 words remaining' },
      { number: -1, expected: 'You have 1 word too many' },
      { number: -10, expected: 'You have 10 words too many' },
      { number: 0, expected: 'You have 0 words remaining' }
    ])(
      'outputs the expected translation for $number words',
      ({ number, expected }) => {
        expect(
          // @ts-expect-error Property 'formatCountMessage' is private
          componentWithCountTypeWords.formatCountMessage(number)
        ).toEqual(expected)

        // Deprecated `maxwords` option where `countType` is inferred
        // @ts-expect-error Property 'formatCountMessage' is private
        expect(componentWithMaxWords.formatCountMessage(number)).toEqual(
          expected
        )
      }
    )

    it('formats the number inserted in the message', () => {
      // @ts-expect-error Property 'formatCountMessage' is private
      expect(componentWithCountTypeWords.formatCountMessage(10000)).toBe(
        'You have 10,000 words remaining'
      )

      // @ts-expect-error Property 'formatCountMessage' is private
      expect(componentWithCountTypeWords.formatCountMessage(-10000)).toBe(
        'You have 10,000 words too many'
      )
    })
  })
})
