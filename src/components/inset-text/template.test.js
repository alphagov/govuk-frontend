/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('inset-text')

describe('Inset text', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('inset-text', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('inset-text', {
        classes: 'app-inset-text--custom-modifier'
      })

      const $component = $('.govuk-inset-text')
      expect($component.hasClass('app-inset-text--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('inset-text', {
        id: 'my-inset-text'
      })

      const $component = $('.govuk-inset-text')
      expect($component.attr('id')).toEqual('my-inset-text')
    })

    it('allows text to be passed whilst escaping HTML entities', () => {
      const $ = render('inset-text', {
        text: 'It can take <b>up to 8 weeks</b> to register a lasting power of attorney if there are no mistakes in the application.'
      })

      const content = $('.govuk-inset-text').html().trim()
      expect(content).toEqual('It can take &lt;b&gt;up to 8 weeks&lt;/b&gt; to register a lasting power of attorney if there are no mistakes in the application.')
    })

    it('allows HTML to be passed un-escaped', () => {
      const $ = render('inset-text', {
        text: 'It can take <b>up to 8 weeks</b> to register a lasting power of attorney if there are no mistakes in the application.',
        safe: true
      })

      const content = $('.govuk-inset-text').html().trim()
      expect(content).toEqual('It can take <b>up to 8 weeks</b> to register a lasting power of attorney if there are no mistakes in the application.')
    })

    it('renders with attributes', () => {
      const $ = render('inset-text', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-inset-text')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })

  describe('with keyword arguments', () => {
    it('allows inset text to be passed as string', () => {
      const $ = renderMacro('inset-text', 'text as string')

      const $component = $('.govuk-inset-text')
      expect($component.text()).toContain('text as string')
    })

    it('allows inset text params to be passed as keyword arguments', () => {
      const $ = renderMacro('inset-text', null, {
        text: '<span>Hello</span>',
        safe: true,
        id: 'id',
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-inset-text')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.attr('id')).toContain('id')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('inset-text', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-inset-text')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('inset-text', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-inset-text')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('inset-text', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-inset-text')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses tag keyword argument before params.tag', () => {
      const $ = renderMacro('inset-text', {
        id: 'paramsId'
      }, {
        id: 'keywordsId'
      })

      const $component = $('.govuk-inset-text')
      expect($component.attr('id')).toEqual('keywordsId')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('inset-text', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-inset-text')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('inset-text', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-inset-text')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('inset-text', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukInsetText</strong>')
    })
  })
})
