const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Button', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('button')
  })

  describe('default example', () => {
    it('renders the default example', () => {
      document.body.innerHTML = render('button', examples.default)

      const $component = document.querySelector('.govuk-button')
      expect($component.tagName).toBe('BUTTON')
      expect($component).toHaveTextContent('Save and continue')
    })
  })

  describe('custom options', () => {
    it('renders with attributes', () => {
      document.body.innerHTML = render('button', examples.attributes)

      const $component = document.querySelector('.govuk-button')
      expect($component).toHaveAttribute('aria-controls', 'test-target-element')
      expect($component).toHaveAttribute('data-tracking-dimension', '123')
    })

    it('renders with classes', () => {
      document.body.innerHTML = render('button', examples.classes)

      const $component = document.querySelector('.govuk-button')
      expect($component).toHaveClass('app-button--custom-modifier')
    })

    it('renders with disabled', () => {
      document.body.innerHTML = render('button', examples.disabled)

      const $component = document.querySelector('.govuk-button')
      expect($component).toHaveAttribute('aria-disabled', 'true')
      expect($component).toBeDisabled()
    })

    it('renders with name', () => {
      document.body.innerHTML = render('button', examples.name)

      const $component = document.querySelector('.govuk-button')
      expect($component).toHaveAttribute('name', 'start-now')
    })

    it('renders with id', () => {
      document.body.innerHTML = render('button', examples.id)

      const $component = document.querySelector('.govuk-button')
      expect($component).toHaveAttribute('id', 'submit')
    })

    it('renders with value', () => {
      document.body.innerHTML = render('button', examples.value)

      const $component = document.querySelector('.govuk-button')
      expect($component).toHaveValue('start')
    })

    it('renders with type', () => {
      document.body.innerHTML = render('button', examples.type)

      const $component = document.querySelector('.govuk-button')
      expect($component).toHaveAttribute('type', 'button')
    })

    it('renders with html', () => {
      document.body.innerHTML = render('button', examples.html)

      const $component = document.querySelector('.govuk-button')
      expect($component).toContainHTML('Start <em>now</em>')
    })

    describe('preventDoubleClick', () => {
      it('does not render the attribute if not set', () => {
        document.body.innerHTML = render(
          'button',
          examples['no data-prevent-double-click']
        )

        const $component = document.querySelector('.govuk-button')
        expect($component).not.toHaveAttribute('data-prevent-double-click')
      })

      it('renders with preventDoubleClick attribute set to true', () => {
        document.body.innerHTML = render(
          'button',
          examples['prevent double click']
        )

        const $component = document.querySelector('.govuk-button')
        expect($component).toHaveAttribute('data-prevent-double-click', 'true')
      })

      it('renders with preventDoubleClick attribute set to false', () => {
        document.body.innerHTML = render(
          'button',
          examples["don't prevent double click"]
        )

        const $component = document.querySelector('.govuk-button')
        expect($component).toHaveAttribute('data-prevent-double-click', 'false')
      })
    })
  })

  describe('link', () => {
    it('renders with anchor, href and an accessible role of button', () => {
      document.body.innerHTML = render('button', examples['explicit link'])

      const $component = document.querySelector('.govuk-button')
      expect($component.tagName).toBe('A')
      expect($component).toHaveAttribute('href', '/')
      expect($component).toHaveRole('button')
      expect($component).toHaveTextContent('Continue')
    })

    it('renders with attributes', () => {
      document.body.innerHTML = render('button', examples['link attributes'])

      const $component = document.querySelector('.govuk-button')
      expect($component).toHaveAttribute('aria-controls', 'test-target-element')
      expect($component).toHaveAttribute('data-tracking-dimension', '123')
    })

    it('renders with classes', () => {
      document.body.innerHTML = render('button', examples['link classes'])

      const $component = document.querySelector('.govuk-button')
      expect($component).toHaveClass('app-button--custom-modifier')
    })
  })

  describe('implicitly as no "element" param is set', () => {
    it('renders a link if you pass an href', () => {
      document.body.innerHTML = render('button', examples.link)

      const $component = document.querySelector('.govuk-button')
      expect($component.tagName).toBe('A')
    })

    it("renders a button if you don't pass anything", () => {
      document.body.innerHTML = render('button', examples['no type'])

      const $component = document.querySelector('.govuk-button')
      expect($component.tagName).toBe('BUTTON')
    })
  })

  describe('Start button', () => {
    it('renders a svg', () => {
      document.body.innerHTML = render('button', examples['start link'])

      const $component = document.querySelector(
        '.govuk-button .govuk-button__start-icon'
      )
      expect($component.tagName).toBe('svg')
    })
  })
})
