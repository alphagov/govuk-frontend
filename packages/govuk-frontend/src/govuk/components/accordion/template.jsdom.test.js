const { getExamples, render } = require('@govuk-frontend/lib/components')

describe('Accordion', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('accordion')
  })

  describe('default example', () => {
    beforeAll(() => {
      document.body.innerHTML = render('accordion', examples.default)
    })

    it('renders with heading button text', () => {
      const $componentHeadingButton = document.querySelector(
        '.govuk-accordion__section-button'
      )

      expect($componentHeadingButton).toHaveTextContent('Section A')
    })

    it('renders with content as text, wrapped in styled paragraph', () => {
      const $componentContent = document.querySelector(
        '.govuk-accordion__section-content'
      )
      const $paragraph = $componentContent.querySelector('p')

      expect($paragraph).toHaveClass('govuk-body')
      expect($componentContent).toHaveTextContent(
        'We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.'
      )
    })

    it('renders with content as html', () => {
      const $componentContent = document.querySelector(
        '.govuk-accordion__section:last-child .govuk-accordion__section-content'
      )

      expect($componentContent.querySelector('p')).toBeNull()
      expect($componentContent).toHaveTextContent('Example item 2')
    })

    it('renders with id', () => {
      const $component = document.querySelector('.govuk-accordion')

      expect($component).toHaveAttribute('id', 'accordion')
    })
  })

  describe('custom options', () => {
    it('renders with id', () => {
      document.body.innerHTML = render('accordion', examples.id)
      const $component = document.querySelector('.govuk-accordion')

      expect($component).toHaveAttribute('id', 'custom-id')
    })

    it('renders with classes', () => {
      document.body.innerHTML = render('accordion', examples.classes)
      const $component = document.querySelector('.govuk-accordion')

      expect($component).toHaveClass('myClass')
    })

    it('renders with attributes', () => {
      document.body.innerHTML = render('accordion', examples.attributes)
      const $component = document.querySelector('.govuk-accordion')

      expect($component).toHaveAttribute('data-attribute', 'value')
    })

    it('renders with specified heading level', () => {
      document.body.innerHTML = render(
        'accordion',
        examples['custom heading level']
      )
      const $componentHeading = document.querySelector(
        '.govuk-accordion__section-heading'
      )

      expect($componentHeading.tagName).toBe('H3')
    })

    it('renders with heading button html', () => {
      document.body.innerHTML = render('accordion', examples['heading html'])
      const $componentHeadingButton = document.querySelector(
        '.govuk-accordion__section-button'
      )

      expect($componentHeadingButton).toContainHTML(
        '<span class="myClass">Section A</span>'
      )
    })

    it('renders with section expanded class', () => {
      document.body.innerHTML = render(
        'accordion',
        examples['with one section open']
      )
      const $componentSection = document.querySelector(
        '.govuk-accordion__section'
      )

      expect($componentSection).toHaveClass(
        'govuk-accordion__section--expanded'
      )
    })

    it('renders with summary', () => {
      document.body.innerHTML = render(
        'accordion',
        examples['with additional descriptions']
      )
      const $componentSummary = document.querySelector(
        '.govuk-accordion__section-summary'
      )

      expect($componentSummary).toHaveTextContent('Additional description')
    })

    it('renders list without falsy values', () => {
      document.body.innerHTML = render(
        'accordion',
        examples['with falsy values']
      )
      const $sections = document.querySelectorAll('.govuk-accordion__section')

      expect($sections).toHaveLength(2)
    })

    it('renders with localisation data attributes', () => {
      document.body.innerHTML = render(
        'accordion',
        examples['with translations']
      )
      const $component = document.querySelector('.govuk-accordion')

      expect($component).toHaveAttribute(
        'data-i18n.hide-all-sections',
        'Collapse all sections'
      )

      expect($component).toHaveAttribute(
        'data-i18n.show-all-sections',
        'Expand all sections'
      )

      expect($component).toHaveAttribute('data-i18n.hide-section', 'Collapse')
      expect($component).toHaveAttribute(
        'data-i18n.hide-section-aria-label',
        'Collapse this section'
      )

      expect($component).toHaveAttribute('data-i18n.show-section', 'Expand')
      expect($component).toHaveAttribute(
        'data-i18n.show-section-aria-label',
        'Expand this section'
      )
    })

    it('renders with remember expanded data attribute', () => {
      document.body.innerHTML = render(
        'accordion',
        examples['with remember expanded off']
      )
      const $component = document.querySelector('.govuk-accordion')

      expect($component).toHaveAttribute('data-remember-expanded', 'false')
    })
  })
})
