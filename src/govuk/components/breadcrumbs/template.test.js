/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('breadcrumbs')

describe('Breadcrumbs', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('breadcrumbs', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('breadcrumbs', {
        classes: 'app-breadcrumbs--custom-modifier'
      })

      const $component = $('.govuk-breadcrumbs')
      expect($component.hasClass('app-breadcrumbs--custom-modifier')).toBeTruthy()
    })

    it('renders with attributes', () => {
      const $ = render('breadcrumbs', {
        attributes: {
          'id': 'my-navigation',
          'role': 'navigation'
        }
      })

      const $component = $('.govuk-breadcrumbs')
      expect($component.attr('id')).toEqual('my-navigation')
      expect($component.attr('role')).toEqual('navigation')
    })

    it('renders with items', () => {
      const $ = render('breadcrumbs', {
        items: [
          {
            'text': 'Section 1'
          },
          {
            'text': 'Sub-section'
          }
        ]
      })

      const $items = $('.govuk-breadcrumbs__list-item')
      expect($items.length).toEqual(2)
    })

    it('renders item with text', () => {
      const $ = render('breadcrumbs', {
        items: [
          {
            'text': 'Section 1'
          }
        ]
      })

      const $item = $('.govuk-breadcrumbs__list-item')
      expect($item.text()).toEqual('Section 1')
    })

    it('renders item with escaped entities in text', () => {
      const $ = render('breadcrumbs', {
        items: [
          {
            'text': '<span>Section 1</span>'
          }
        ]
      })

      const $item = $('.govuk-breadcrumbs__list-item')
      expect($item.html()).toEqual('&lt;span&gt;Section 1&lt;/span&gt;')
    })

    it('renders item anchor with attributes', () => {
      const $ = render('breadcrumbs', {
        items: [
          {
            'text': 'Section 1',
            'href': '/section',
            'attributes': {
              'data-attribute': 'my-attribute',
              'data-attribute-2': 'my-attribute-2'
            }
          }
        ]
      })

      const $breadcrumbLink = $('.govuk-breadcrumbs__link')
      expect($breadcrumbLink.attr('data-attribute')).toEqual('my-attribute')
      expect($breadcrumbLink.attr('data-attribute-2')).toEqual('my-attribute-2')
    })

    it('renders item with html', () => {
      const $ = render('breadcrumbs', {
        items: [
          {
            'html': '<em>Section 1</em>'
          }
        ]
      })

      const $item = $('.govuk-breadcrumbs__list-item')
      expect($item.html()).toEqual('<em>Section 1</em>')
    })

    it('renders item with anchor', () => {
      const $ = render('breadcrumbs', {
        items: [
          {
            'text': 'Section 1',
            'href': '/section'
          }
        ]
      })

      const $anchor = $('.govuk-breadcrumbs__list-item a')
      expect($anchor.get(0).tagName).toEqual('a')
      expect($anchor.attr('class')).toEqual('govuk-breadcrumbs__link')
      expect($anchor.attr('href')).toEqual('/section')
      expect($anchor.text()).toEqual('Section 1')
    })

    it('renders item with html inside anchor', () => {
      const $ = render('breadcrumbs', {
        items: [
          {
            'html': '<em>Section 1</em>',
            'href': '/section'
          }
        ]
      })

      const $anchor = $('.govuk-breadcrumbs__list-item a')
      expect($anchor.html()).toEqual('<em>Section 1</em>')
    })
  })

  describe('default example', () => {
    it('renders 2 items', () => {
      const $ = render('breadcrumbs', examples.default)
      const $items = $('.govuk-breadcrumbs__list-item')
      expect($items.length).toEqual(2)
    })
  })
})
