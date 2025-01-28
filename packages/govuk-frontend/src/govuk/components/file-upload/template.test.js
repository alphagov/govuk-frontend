const { render } = require('@govuk-frontend/helpers/nunjucks')
const { htmlWithClassName } = require('@govuk-frontend/helpers/tests')
const { getExamples } = require('@govuk-frontend/lib/components')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('File upload', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('file-upload')
  })

  describe('default example', () => {
    it('renders with id', () => {
      const $ = render('file-upload', examples.default)

      const $component = $('.govuk-file-upload')
      expect($component.attr('id')).toBe('file-upload-1')
    })

    it('renders with name', () => {
      const $ = render('file-upload', examples.default)

      const $component = $('.govuk-file-upload')
      expect($component.attr('name')).toBe('file-upload-1')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('file-upload', examples.default)

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = render('file-upload', examples.classes)

      const $component = $('.govuk-file-upload')
      expect(
        $component.hasClass('app-file-upload--custom-modifier')
      ).toBeTruthy()
    })

    it('renders with value', () => {
      const $ = render('file-upload', examples['with value'])

      const $component = $('.govuk-file-upload')
      expect($component.val()).toBe('C:\\fakepath\\myphoto.jpg')
    })

    it('renders with aria-describedby', () => {
      const $ = render('file-upload', examples['with describedBy'])

      const $component = $('.govuk-file-upload')
      expect($component.attr('aria-describedby')).toMatch('test-target-element')
    })

    it('renders with multiple', () => {
      const $ = render('file-upload', examples['allows multiple files'])

      const $component = $('.govuk-file-upload')
      expect($component.attr('multiple')).toBeTruthy()
    })

    it('renders with disabled', () => {
      const $ = render('file-upload', examples.disabled)

      const $component = $('.govuk-file-upload')
      expect($component.attr('disabled')).toBeTruthy()
    })

    it('renders with attributes', () => {
      const $ = render('file-upload', examples.attributes)

      const $component = $('.govuk-file-upload')
      expect($component.attr('accept')).toBe('.jpg, .jpeg, .png')
    })

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render(
        'file-upload',
        examples['with optional form-group classes']
      )

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('extra-class')).toBeTruthy()
    })
  })

  describe('when it includes a hint', () => {
    it('renders with hint', () => {
      const $ = render('file-upload', examples['with hint text'])

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the input as "described by" the hint', () => {
      const $ = render('file-upload', examples['with hint text'])

      const $component = $('.govuk-file-upload')
      const hintId = $('.govuk-hint').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}${hintId}${WORD_BOUNDARY}`
      )

      expect($component.attr('aria-describedby')).toMatch(describedBy)
    })

    it('associates the input as "described by" the hint and parent fieldset', () => {
      const $ = render('file-upload', examples['with hint and describedBy'])

      const $component = $('.govuk-file-upload')
      const hintId = $('.govuk-hint').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}test-target-element${WHITESPACE}${hintId}${WORD_BOUNDARY}`
      )

      expect($component.attr('aria-describedby')).toMatch(describedBy)
    })
  })

  describe('when it includes an error message', () => {
    it('renders with error message', () => {
      const $ = render('file-upload', examples.error)

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('associates the input as "described by" the error message', () => {
      const $ = render('file-upload', examples.error)

      const $component = $('.govuk-file-upload')
      const errorMessageId = $('.govuk-error-message').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($component.attr('aria-describedby')).toMatch(describedBy)
    })

    it('associates the input as "described by" the error message and parent fieldset', () => {
      const $ = render('file-upload', examples['with error and describedBy'])

      const $component = $('.govuk-file-upload')
      const errorMessageId = $('.govuk-error-message').attr('id')

      const describedBy = new RegExp(
        `${WORD_BOUNDARY}test-target-element${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($component.attr('aria-describedby')).toMatch(describedBy)
    })

    it('includes the error class on the component', () => {
      const $ = render('file-upload', examples.error)

      const $component = $('.govuk-file-upload')
      expect($component.hasClass('govuk-file-upload--error')).toBeTruthy()
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('file-upload', examples.error)

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when it includes both a hint and an error message', () => {
    it('associates the input as described by both the hint and the error message', () => {
      const $ = render('file-upload', examples['with error message and hint'])

      const $component = $('.govuk-file-upload')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const describedByCombined = new RegExp(
        `${WORD_BOUNDARY}${hintId}${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($component.attr('aria-describedby')).toMatch(describedByCombined)
    })

    it('associates the input as described by the hint, error message and parent fieldset', () => {
      const describedById = 'test-target-element'

      const $ = render(
        'file-upload',
        examples['with error, describedBy and hint']
      )

      const $component = $('.govuk-file-upload')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const describedByCombined = new RegExp(
        `${WORD_BOUNDARY}${describedById}${WHITESPACE}${hintId}${WHITESPACE}${errorMessageId}${WORD_BOUNDARY}`
      )

      expect($component.attr('aria-describedby')).toMatch(describedByCombined)
    })
  })

  describe('`javascript` option', () => {
    it('is falsy by default', () => {
      const $ = render('file-upload', examples.javascript)

      const $input = $('.govuk-form-group > .govuk-file-upload input')
      expect($input.attr('data-module')).toBeUndefined()
    })

    it('adds the data-module attribute to the input when `true`', () => {
      const $ = render('file-upload', examples.javascript)

      const $input = $('.govuk-form-group > .govuk-file-upload')

      expect($input.attr('data-module')).toBe('govuk-file-upload')
    })

    it('adds the data-module attribute when receiving an object', () => {
      const $ = render('file-upload', examples.translated)

      const $input = $('.govuk-form-group > .govuk-file-upload')

      expect($input.attr('data-module')).toBe('govuk-file-upload')
    })

    it('enables the rendering of translation messages when true', () => {
      const $ = render('file-upload', examples.translated)

      const $input = $('.govuk-form-group > .govuk-file-upload')

      expect($input.attr('data-i18n.select-files-button')).toBe(
        'Dewiswch ffeil'
      )
      expect($input.attr('data-i18n.files-selected-default')).toBe(
        "Dim ffeiliau wedi'u dewis"
      )
      expect($input.attr('data-i18n.files-selected.one')).toBe(
        "%{count} ffeil wedi'i dewis"
      )
      expect($input.attr('data-i18n.files-selected.other')).toBe(
        "%{count} ffeil wedi'u dewis"
      )
    })

    it('prevents the rendering of translation messages when false', () => {
      const $ = render(
        'file-upload',
        examples['translated, no javascript enhancement']
      )

      const $input = $('.govuk-form-group > .govuk-file-upload')

      expect($input.attr('data-i18n.select-files-button')).toBeUndefined()
      expect($input.attr('data-i18n.files-selected-default')).toBeUndefined()
      expect($input.attr('data-i18n.files-selected.one')).toBeUndefined()
      expect($input.attr('data-i18n.files-selected.other')).toBeUndefined()
    })
  })

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('file-upload', examples.error)

      const $component = $('.govuk-form-group > .govuk-file-upload')
      expect($component.length).toBeTruthy()
    })

    it('renders with label', () => {
      const $ = render('file-upload', examples.default)

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot()
    })

    it('renders label with "for" attribute reffering the file-upload "id"', () => {
      const $ = render('file-upload', examples.default)

      const $label = $('.govuk-label')
      expect($label.attr('for')).toBe('file-upload-1')
    })
  })
})
