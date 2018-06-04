/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

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
            text: 'Section 1'
          },
          {
            text: 'Sub-section'
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
            text: 'Section 1'
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
            text: '<span>Section 1</span>'
          }
        ]
      })

      const $item = $('.govuk-breadcrumbs__list-item')
      expect($item.html()).toEqual('&lt;span&gt;Section 1&lt;/span&gt;')
    })

    it('renders item with html', () => {
      const $ = render('breadcrumbs', {
        items: [
          {
            text: '<em>Section 1</em>',
            safe: true
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
            text: 'Section 1',
            href: '/section'
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
            text: '<em>Section 1</em>',
            safe: true,
            href: '/section'
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

  describe('with keyword arguments', () => {
    it('allows breadcrumbs to be passed as array of items', () => {
      const $ = renderMacro('breadcrumbs', [{
        text: 'breadcrumb array text',
        href: '/breadcrumbArrayUrl'
      }])

      const $component = $('.govuk-breadcrumbs__link')
      expect($component.text()).toContain('breadcrumb array text')
      expect($component.attr('href')).toEqual('/breadcrumbArrayUrl')
    })

    it('allows breadcrumbs params to be passed as keyword arguments', () => {
      const $ = renderMacro('breadcrumbs', null, {
        items: [{
          text: 'breadcrumb text',
          href: '/breadcrumbUrl'
        }],
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-breadcrumbs')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')

      const $breadcumbLink = $('.govuk-breadcrumbs__link')
      expect($breadcumbLink.text()).toContain('breadcrumb text')
      expect($breadcumbLink.attr('href')).toEqual('/breadcrumbUrl')
    })

    it('uses items keyword argument before params as array of items', () => {
      const $ = renderMacro('breadcrumbs', [{
        text: 'breadcrumb array text',
        href: '/breadcrumbArrayUrl'
      }], {
        items: [{
          text: 'breadcrumb keyword text',
          href: '/breadcrumbKeywordUrl'
        }]
      })

      const $breadcumbLink = $('.govuk-breadcrumbs__link')
      expect($breadcumbLink.text()).toContain('breadcrumb keyword text')
      expect($breadcumbLink.attr('href')).toEqual('/breadcrumbKeywordUrl')
    })

    it('uses items keyword argument before params.items', () => {
      const $ = renderMacro('breadcrumbs', {
        items: [{
          text: 'breadcrumb params text',
          href: '/breadcrumbParamsUrl'
        }]
      }, {
        items: [{
          text: 'breadcrumb keyword text',
          href: '/breadcrumbKeywordUrl'
        }]
      })

      const $breadcumbLink = $('.govuk-breadcrumbs__link')
      expect($breadcumbLink.text()).toContain('breadcrumb keyword text')
      expect($breadcumbLink.attr('href')).toEqual('/breadcrumbKeywordUrl')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('breadcrumbs', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-breadcrumbs')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('breadcrumbs', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-breadcrumbs')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.items[]html', () => {
      const $ = renderMacro('breadcrumbs', {
        items: [{
          text: '<b>params text</b>',
          safe: true
        }]
      })

      expect($.html()).toContain('<strong class="deprecated">params.items[]html is deprecated in govukBreadcrumbs</strong>')
    })
  })
})
