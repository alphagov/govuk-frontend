const { render } = require('@govuk-frontend/helpers/nunjucks')
const { getExamples } = require('@govuk-frontend/lib/components')

describe('Accordion', () => {
  let examples

  beforeAll(async () => {
    examples = await getExamples('accordion')
  })

  describe('default example', () => {
    it('renders with heading button text', () => {
      const $ = render('accordion', examples.default)
      const $componentHeadingButton = $('.govuk-accordion__section-button')

      expect($componentHeadingButton.html().trim()).toBe('Section A')
    })

    it('renders with content as text, wrapped in styled paragraph', () => {
      const $ = render('accordion', examples.default)
      const $componentContent = $('.govuk-accordion__section-content').first()

      expect($componentContent.find('p').hasClass('govuk-body')).toBeTruthy()
      expect($componentContent.text().trim()).toBe(
        'We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.'
      )
    })

    it('renders with content as html', () => {
      const $ = render('accordion', examples.default)
      const $componentContent = $('.govuk-accordion__section-content').last()

      expect($componentContent.find('p.gvouk-body')).toHaveLength(0)
      expect($componentContent.text().trim()).toBe('Example item 2')
    })

    it('renders with id', () => {
      const $ = render('accordion', examples.default)

      const $component = $('.govuk-accordion')
      expect($component.attr('id')).toBe('default-example')
    })
  })

  describe('custom options', () => {
    it('renders with classes', () => {
      const $ = render('accordion', examples.classes)

      const $component = $('.govuk-accordion')
      expect($component.hasClass('myClass')).toBeTruthy()
    })

    it('renders with attributes', () => {
      const $ = render('accordion', examples.attributes)
      const $component = $('.govuk-accordion')
      expect($component.attr('data-attribute')).toBe('value')
    })

    it('renders with specified heading level', () => {
      const $ = render('accordion', examples['custom heading level'])
      const $componentHeading = $('.govuk-accordion__section-heading')

      expect($componentHeading.get(0).tagName).toBe('h3')
    })

    it('renders with heading button html', () => {
      const $ = render('accordion', examples['heading html'])
      const $componentHeadingButton = $('.govuk-accordion__section-button')

      expect($componentHeadingButton.html().trim()).toBe(
        '<span class="myClass">Section A</span>'
      )
    })

    it('renders with section expanded class', () => {
      const $ = render('accordion', examples['with one section open'])
      const $componentSection = $('.govuk-accordion__section').first()

      expect(
        $componentSection.hasClass('govuk-accordion__section--expanded')
      ).toBeTruthy()
    })

    it('renders with summary', () => {
      const $ = render('accordion', examples['with additional descriptions'])
      const $componentSummary = $('.govuk-accordion__section-summary').first()

      expect($componentSummary.text().trim()).toBe('Additional description')
    })

    it('renders list without falsely values', () => {
      const $ = render('accordion', examples['with falsey values'])
      const $component = $('.govuk-accordion')
      const $items = $component.find('.govuk-accordion__section')

      expect($items).toHaveLength(2)
    })

    it('renders with localisation data attributes', () => {
      const $ = render('accordion', examples['with translations'])
      const $component = $('.govuk-accordion')

      expect($component.attr('data-i18n.hide-all-sections')).toBe(
        'Collapse all sections'
      )
      expect($component.attr('data-i18n.show-all-sections')).toBe(
        'Expand all sections'
      )
      expect($component.attr('data-i18n.hide-section')).toBe('Collapse')
      expect($component.attr('data-i18n.hide-section-aria-label')).toBe(
        'Collapse this section'
      )
      expect($component.attr('data-i18n.show-section')).toBe('Expand')
      expect($component.attr('data-i18n.show-section-aria-label')).toBe(
        'Expand this section'
      )
    })

    it('renders with remember expanded data attribute', () => {
      const $ = render('accordion', examples['with remember expanded off'])
      const $component = $('.govuk-accordion')

      expect($component.attr('data-remember-expanded')).toBe('false')
    })
  })
})
