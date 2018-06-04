/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('label')

describe('Label', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('label', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders a label element', () => {
      const $ = render('label', examples.default)

      const $component = $('.govuk-label')
      expect($component.get(0).tagName).toEqual('label')
    })

    it('does not output anything if no html or text is provided', () => {
      const $ = render('label', {})

      const $component = $('.govuk-label')

      expect($component.length).toEqual(0)
    })

    it('allows additional classes to be added to the component', () => {
      const $ = render('label', {
        text: 'National Insurance number',
        classes: 'extra-class one-more-class'
      })

      const $component = $('.govuk-label')
      expect($component.hasClass('extra-class one-more-class')).toBeTruthy()
    })

    it('renders label text', () => {
      const $ = render('label', {
        text: 'National Insurance number'
      })
      const labelText = $('.govuk-label').text().trim()

      expect(labelText).toEqual('National Insurance number')
    })

    it('allows label text to be passed whilst escaping HTML entities', () => {
      const $ = render('label', {
        text: 'National Insurance number, <em>NINO</em>'
      })

      const labelText = $('.govuk-label').html().trim()
      expect(labelText).toEqual('National Insurance number, &lt;em&gt;NINO&lt;/em&gt;')
    })

    it('allows label HTML to be passed un-escaped', () => {
      const $ = render('label', {
        text: 'National Insurance number <em>NINO</em>',
        safe: true
      })

      const labelText = $('.govuk-label').html().trim()
      expect(labelText).toEqual('National Insurance number <em>NINO</em>')
    })

    it('renders for attribute if specified', () => {
      const $ = render('label', {
        text: 'National Insurance number',
        for: '#dummy-input'
      })

      const labelForAttr = $('.govuk-label').attr('for')
      expect(labelForAttr).toEqual('#dummy-input')
    })

    it('can be nested inside an H1 using isPageHeading', () => {
      const $ = render('label', {
        text: 'National Insurance number',
        isPageHeading: true
      })

      const $selector = $('h1 > .govuk-label')
      expect($selector.length).toBeTruthy()
    })

    it('allows additional attributes to be added to the component', () => {
      const $ = render('label', {
        text: 'National Insurance number',
        attributes: {
          'first-attribute': 'true',
          'second-attribute': 'false'
        }
      })

      const $component = $('.govuk-label')
      expect($component.attr('first-attribute')).toEqual('true')
      expect($component.attr('second-attribute')).toEqual('false')
    })
  })

  describe('with keyword arguments', () => {
    it('allows label to be passed as string', () => {
      const $ = renderMacro('label', 'text as string')

      const $component = $('.govuk-label')
      expect($component.text()).toContain('text as string')
    })

    it('allows label params to be passed as keyword arguments', () => {
      const $ = renderMacro('label', null, {
        text: '<span>Hello</span>',
        safe: true,
        for: 'forId',
        isPageHeading: true,
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-label')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')

      const $heading = $('.govuk-label-wrapper')
      expect($heading.length).toEqual(1)
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('label', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-label')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('label', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-label')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('label', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-label')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses for keyword argument before params.for', () => {
      const $ = renderMacro('label', {
        for: 'paramsFor'
      }, {
        for: 'keywordsFor'
      })

      const $component = $('.govuk-label')
      expect($component.attr('for')).toEqual('keywordsFor')
    })

    it('uses isPageHeading keyword argument before params.isPageHeading', () => {
      const $ = renderMacro('label', {
        text: 'label text',
        isPageHeading: true
      }, {
        isPageHeading: false
      })

      const $component = $('.govuk-label')
      expect($component.length).toEqual(1)

      const $heading = $('.govuk-label-wrapper')
      expect($heading.length).toEqual(0)
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('label', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-label')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('label', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-label')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('label', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukLabel</strong>')
    })
  })
})
