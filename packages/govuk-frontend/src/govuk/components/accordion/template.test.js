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

      expect($componentHeadingButton.html().trim()).toEqual('Section A')
    })

    it('renders with content as text, wrapped in styled paragraph', () => {
      const $ = render('accordion', examples.default)
      const $componentContent = $('.govuk-accordion__section-content').first()

      expect($componentContent.find('p').hasClass('govuk-body')).toBeTruthy()
      expect($componentContent.text().trim()).toEqual(
        'We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.'
      )
    })

    it('renders with content as html', () => {
      const $ = render('accordion', examples.default)
      const $componentContent = $('.govuk-accordion__section-content').last()

      expect($componentContent.find('p.gvouk-body').length).toEqual(0)
      expect($componentContent.text().trim()).toEqual('Example item 2')
    })

    it('renders with id', () => {
      const $ = render('accordion', examples.default)

      const $component = $('.govuk-accordion')
      expect($component.attr('id')).toEqual('default-example')
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
      expect($component.attr('data-attribute')).toEqual('value')
    })

    it('renders with specified heading level', () => {
      const $ = render('accordion', examples['custom heading level'])
      const $componentHeading = $('.govuk-accordion__section-heading')

      expect($componentHeading.get(0).tagName).toEqual('h3')
    })

    it('renders with heading button html', () => {
      const $ = render('accordion', examples['heading html'])
      const $componentHeadingButton = $('.govuk-accordion__section-button')

      expect($componentHeadingButton.html().trim()).toEqual(
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

      expect($componentSummary.text().trim()).toEqual('Additional description')
    })

    it('renders list without falsely values', () => {
      const $ = render('accordion', examples['with falsey values'])
      const $component = $('.govuk-accordion')
      const $items = $component.find('.govuk-accordion__section')

      expect($items.length).toEqual(2)
    })

    it('renders with localisation data attributes', () => {
      const $ = render('accordion', examples['with translations'])
      const $component = $('.govuk-accordion')

      expect($component.attr('data-i18n.hide-all-sections')).toEqual(
        'Collapse all sections'
      )
      expect($component.attr('data-i18n.show-all-sections')).toEqual(
        'Expand all sections'
      )
      expect($component.attr('data-i18n.hide-section')).toEqual('Collapse')
      expect($component.attr('data-i18n.hide-section-aria-label')).toEqual(
        'Collapse this section'
      )
      expect($component.attr('data-i18n.show-section')).toEqual('Expand')
      expect($component.attr('data-i18n.show-section-aria-label')).toEqual(
        'Expand this section'
      )
    })

    it('renders with remember expanded data attribute', () => {
      const $ = render('accordion', examples['with remember expanded off'])
      const $component = $('.govuk-accordion')

      expect($component.attr('data-remember-expanded')).toEqual('false')
    })
  })
})
