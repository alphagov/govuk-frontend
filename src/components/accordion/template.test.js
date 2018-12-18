/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('accordion')

describe('Accordion', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('accordion', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with specified heading level', () => {
      const $ = render('accordion', {
        headingLevel: '3',
        items: [
          {
            heading: {
              'text': 'Section A'
            },
            content: {
              text: 'Some content'
            }
          }
        ]
      })
      const $componentHeading = $('.govuk-accordion__heading')

      expect($componentHeading.get(0).tagName).toEqual('h3')
    })

    it('renders with heading text', () => {
      const $ = render('accordion', {
        headingLevel: '3',
        items: [
          {
            heading: {
              'text': 'Section A'
            },
            content: {
              text: 'Some content'
            }
          }
        ]
      })
      const $componentHeading = $('.govuk-accordion__heading')

      expect($componentHeading.text().trim()).toEqual('Section A')
    })

    it('renders with content', () => {
      const $ = render('accordion', {
        headingLevel: '3',
        items: [
          {
            heading: {
              'text': 'Section A'
            },
            content: {
              text: 'Some content'
            }
          }
        ]
      })
      const $componentContent = $('.govuk-accordion__content')

      expect($componentContent.text().trim()).toEqual('Some content')
    })

    it('renders with classes', () => {
      const $ = render('accordion', {
        classes: 'app-accordion--custom-modifier'
      })

      const $component = $('.govuk-accordion')
      expect($component.hasClass('app-accordion--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('accordion', {
        id: 'my-accordion'
      })

      const $component = $('.govuk-accordion')
      expect($component.attr('id')).toEqual('my-accordion')
    })

    it('renders with attributes', () => {
      const $ = render('accordion', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })
      const $component = $('.govuk-accordion')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })

    it('renders with section expanded class', () => {
      const $ = render('accordion', {
        items: [
          {
            expanded: true,
            heading: {
              'text': 'Section A'
            },
            content: {
              text: 'Some content'
            }
          },
          {
            heading: {
              'text': 'Section B'
            },
            content: {
              text: 'More content'
            }
          }
        ]
      })
      const $componentSection = $('.govuk-accordion__section')

      expect($componentSection.hasClass('govuk-accordion__section--expanded')).toBeTruthy()
    })

    describe('when it includes a summary', () => {
      it('renders with summary', () => {
        const $ = render('accordion', {
          headingLevel: '3',
          items: [
            {
              heading: {
                'text': 'Section A'
              },
              summary: {
                'text': 'Summary of content'
              },
              content: {
                'text': 'Some content'
              }
            }
          ]
        })
        const $componentSummary = $('.govuk-accordion__summary')

        expect($componentSummary.text().trim()).toEqual('Summary of content')
      })
    })
  })
})
