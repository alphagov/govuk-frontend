/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('character-count')

const WORD_BOUNDARY = '\\b'

describe('Character count', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('character-count', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with id', () => {
      const $ = render('character-count', examples.default)

      const $component = $('.moaland-js-character-count')
      expect($component.attr('id')).toEqual('more-detail')
    })

    it('renders with name', () => {
      const $ = render('character-count', examples.default)

      const $component = $('.moaland-js-character-count')
      expect($component.attr('name')).toEqual('more-detail')
    })

    it('renders with default number of rows', () => {
      const $ = render('character-count', examples.default)

      const $component = $('.moaland-js-character-count')
      expect($component.attr('rows')).toEqual('5')
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = render('character-count', examples.classes)

      const $component = $('.moaland-js-character-count')
      expect($component.hasClass('app-character-count--custom-modifier')).toBeTruthy()
    })

    it('renders with rows', () => {
      const $ = render('character-count', examples['with custom rows'])

      const $component = $('.moaland-js-character-count')
      expect($component.attr('rows')).toEqual('8')
    })

    it('renders with value', () => {
      const $ = render('character-count', examples['with default value'])

      const $component = $('.moaland-js-character-count')
      expect($component.text()).toEqual('221B Baker Street\nLondon\nNW1 6XE\n')
    })

    it('renders with attributes', () => {
      const $ = render('character-count', examples.attributes)

      const $component = $('.moaland-js-character-count')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with formGroup', () => {
      const $ = render('character-count', examples['formGroup with classes'])

      const $component = $('.moaland-form-group')
      expect($component.hasClass('app-character-count--custom-modifier')).toBeTruthy()
    })
  })

  describe('count message', () => {
    it('renders with the amount of characters expected', () => {
      const $ = render('character-count', examples.default)

      const $countMessage = $('.moaland-character-count__message')
      expect($countMessage.text()).toContain('You can enter up to 10 characters')
    })

    it('renders with the amount of words expected', () => {
      const $ = render('character-count', examples['with word count'])

      const $countMessage = $('.moaland-character-count__message')
      expect($countMessage.text()).toContain('You can enter up to 10 words')
    })

    it('is associated with the textarea', () => {
      const $ = render('character-count', examples.default)

      const $textarea = $('.moaland-js-character-count')
      const $countMessage = $('.moaland-character-count__message')

      const hintId = new RegExp(
        WORD_BOUNDARY + $countMessage.attr('id') + WORD_BOUNDARY
      )

      expect($textarea.attr('aria-describedby'))
        .toMatch(hintId)
    })

    it('renders with custom classes', () => {
      const $ = render('character-count', examples['custom classes on countMessage'])

      const $countMessage = $('.moaland-character-count__message')
      expect($countMessage.hasClass('app-custom-count-message')).toBeTruthy()
    })

    it('renders with aria live set to polite', () => {
      const $ = render('character-count', examples.default)

      const $countMessage = $('.moaland-character-count__message')
      expect($countMessage.attr('aria-live')).toEqual('polite')
    })
  })

  describe('when it has the spellcheck attribute', () => {
    it('renders the textarea with spellcheck attribute set to true', () => {
      const $ = render('character-count', examples['spellcheck enabled'])

      const $component = $('.moaland-character-count .moaland-textarea')
      expect($component.attr('spellcheck')).toEqual('true')
    })

    it('renders the textarea with spellcheck attribute set to false', () => {
      const $ = render('character-count', examples['spellcheck disabled'])

      const $component = $('.moaland-character-count .moaland-textarea')
      expect($component.attr('spellcheck')).toEqual('false')
    })

    it('renders the textarea without spellcheck attribute by default', () => {
      const $ = render('character-count', examples.default)

      const $component = $('.moaland-character-count .moaland-textarea')
      expect($component.attr('spellcheck')).toBeUndefined()
    })
  })

  describe('when it includes a hint', () => {
    it('renders with hint', () => {
      const $ = render('character-count', examples['with hint'])

      expect(htmlWithClassName($, '.moaland-hint')).toMatchSnapshot()
    })

    it('associates the character count as "described by" the hint', () => {
      const $ = render('character-count', examples['with hint'])

      const $textarea = $('.moaland-js-character-count')
      const $hint = $('.moaland-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($textarea.attr('aria-describedby'))
        .toMatch(hintId)
    })
  })

  describe('when it includes an error message', () => {
    it('renders with error message', () => {
      const $ = render('character-count', examples['with default value exceeding limit'])

      expect(htmlWithClassName($, '.moaland-error-message')).toMatchSnapshot()
    })

    it('associates the character-count as "described by" the error message', () => {
      const $ = render('character-count', examples['with default value exceeding limit'])

      const $component = $('.moaland-js-character-count')
      const $errorMessage = $('.moaland-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($component.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('adds the error class to the character-count', () => {
      const $ = render('character-count', examples['with default value exceeding limit'])

      const $component = $('.moaland-js-character-count')
      expect($component.hasClass('moaland-textarea--error')).toBeTruthy()
    })

    it('renders with classes', () => {
      const $ = render('character-count', examples['custom classes with error message'])

      const $component = $('.moaland-js-character-count')
      expect($component.hasClass('app-character-count--custom-modifier')).toBeTruthy()
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('character-count', examples['with default value exceeding limit'])

      const $component = $('.moaland-form-group > .moaland-js-character-count')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('character-count', examples.default)

      expect(htmlWithClassName($, '.moaland-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the character count "id"', () => {
      const $ = render('character-count', examples.default)

      const $label = $('.moaland-label')
      expect($label.attr('for')).toEqual('more-detail')
    })
  })

  describe('with threshold', () => {
    it('hides the count to start with', async () => {
      const $ = render('character-count', examples['with threshold'])

      const $component = $('.moaland-character-count')
      expect($component.attr('data-threshold')).toEqual('75')
    })
  })
})
