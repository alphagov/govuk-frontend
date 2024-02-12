const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Password input', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('password-input')
  })

  describe('default example', () => {
    it('renders with id', () => {
      const $ = render('password-input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('id')).toEqual('password-input')
    })

    it('renders with name', () => {
      const $ = render('password-input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('name')).toEqual('password')
    })

    it('renders with type="password" by default', () => {
      const $ = render('password-input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('type')).toEqual('password')
    })

    it('renders with autocomplete="current-password" by default', () => {
      const $ = render('password-input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('autocomplete')).toEqual('current-password')
    })

    it('renders with spellcheck="false" by default', () => {
      const $ = render('password-input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('spellcheck')).toEqual('false')
    })

    it('renders with autocapitalize="none" by default', () => {
      const $ = render('password-input', examples.default)

      const $component = $('.govuk-input')
      expect($component.attr('autocapitalize')).toEqual('none')
    })

    it('renders with a form group wrapper', () => {
      const $ = render('password-input', examples.default)

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })

    it('renders with the input wrapper', () => {
      const $ = render('password-input', examples.default)

      const $wrapper = $('.govuk-form-group > .govuk-input__wrapper')
      expect($wrapper.length).toBeTruthy()
    })

    describe('toggle button', () => {
      it('renders with the toggle button', () => {
        const $ = render('password-input', examples.default)

        const $button = $(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-button'
        )
        expect($button.length).toBeTruthy()
        expect($button.hasClass('govuk-button--secondary')).toBeTruthy()
      })

      it('renders the toggle button with initial text', () => {
        const $ = render('password-input', examples.default)

        const $button = $(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-button'
        )
        expect($button.text()).toContain('Show')
      })

      it('renders the toggle button with aria-label', () => {
        const $ = render('password-input', examples.default)

        const $button = $(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-button'
        )
        expect($button.attr('aria-label')).toEqual('Show password')
      })

      it('renders the toggle button with the correct aria-controls', () => {
        const $ = render('password-input', examples.default)

        const $component = $('.govuk-input')
        const $button = $(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-button'
        )
        expect($button.attr('aria-controls')).toEqual($component.attr('id'))
      })

      it('renders the toggle button initially hidden', () => {
        const $ = render('password-input', examples.default)

        const $button = $(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-button'
        )
        expect($button.attr('hidden')).toBeTruthy()
      })
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = render('password-input', examples.classes)

      const $component = $('.govuk-input')
      expect($component.hasClass('app-input--custom-modifier')).toBeTruthy()
    })

    it('renders with value', () => {
      const $ = render('password-input', examples.value)

      const $component = $('.govuk-input')
      expect($component.val()).toEqual('Hunter2')
    })

    it('renders with aria-describedby', () => {
      const $ = render('password-input', examples['with describedBy'])

      const $component = $('.govuk-input')
      expect($component.attr('aria-describedby')).toMatch('test-target-element')
    })

    it('renders with custom autocomplete value', () => {
      const $ = render(
        'password-input',
        examples['with new-password autocomplete']
      )

      const $component = $('.govuk-input')
      expect($component.attr('autocomplete')).toEqual('new-password')
    })

    it('renders with attributes', () => {
      const $ = render('password-input', examples.attributes)

      const $component = $('.govuk-input')
      expect($component.attr('data-attribute')).toEqual('value')
      expect($component.attr('data-another')).toEqual('ok')
    })
  })
})
