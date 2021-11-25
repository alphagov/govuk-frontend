/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('accordion')

describe('Accordion', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('accordion', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with heading button text', () => {
      const $ = render('accordion', examples.default)
      const $componentHeadingButton = $('.govuk-accordion__section-button')

      expect($componentHeadingButton.html().trim()).toEqual('Section A')
    })

    it('renders with content', () => {
      const $ = render('accordion', examples.default)
      const $componentContent = $('.govuk-accordion__section-content').first()

      expect($componentContent.text().trim()).toEqual('We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.')
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

      expect($componentHeadingButton.html().trim()).toEqual('<span class="myClass">Section A</span>')
    })

    it('renders with section expanded class', () => {
      const $ = render('accordion', examples['with one section open'])
      const $componentSection = $('.govuk-accordion__section').first()

      expect($componentSection.hasClass('govuk-accordion__section--expanded')).toBeTruthy()
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
  })
})
