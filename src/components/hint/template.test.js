/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('hint')

describe('Hint', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('hint', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders with classes', () => {
      const $ = render('hint', {
        classes: 'app-hint--custom-modifier'
      })

      const $component = $('.govuk-hint')
      expect($component.hasClass('app-hint--custom-modifier')).toBeTruthy()
    })

    it('renders with id', () => {
      const $ = render('hint', {
        id: 'my-hint'
      })

      const $component = $('.govuk-hint')
      expect($component.attr('id')).toEqual('my-hint')
    })

    it('allows text to be passed whilst escaping HTML entities', () => {
      const $ = render('hint', {
        text: 'Unexpected <strong>bold text</strong> in body'
      })

      const content = $('.govuk-hint').html().trim()
      expect(content).toEqual('Unexpected &lt;strong&gt;bold text&lt;/strong&gt; in body')
    })

    it('allows text to be passed un-escaped if accompanied by safe flag', () => {
      const $ = render('hint', {
        text: 'Unexpected <b>bold text</b> in body copy',
        safe: true
      })

      const content = $('.govuk-hint').html().trim()
      expect(content).toEqual('Unexpected <b>bold text</b> in body copy')
    })

    it('renders with attributes', () => {
      const $ = render('hint', {
        attributes: {
          'data-attribute': 'my data value'
        }
      })

      const $component = $('.govuk-hint')
      expect($component.attr('data-attribute')).toEqual('my data value')
    })
  })

  describe('with keyword arguments', () => {
    it('allows hint to be passed as string', () => {
      const $ = renderMacro('hint', 'text as string')

      const $component = $('.govuk-hint')
      expect($component.text()).toContain('text as string')
    })

    it('allows hint params to be passed as keyword arguments', () => {
      const $ = renderMacro('hint', null, {
        text: '<span>Hello</span>',
        safe: true,
        id: 'id',
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-hint')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.attr('id')).toContain('id')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('hint', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-hint')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('hint', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-hint')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('hint', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-hint')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses id keyword argument before params.id', () => {
      const $ = renderMacro('hint', {
        id: 'paramsId'
      }, {
        id: 'keywordsId'
      })

      const $component = $('.govuk-hint')
      expect($component.attr('id')).toEqual('keywordsId')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('hint', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-hint')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('hint', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-hint')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('hint', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukHint</strong>')
    })
  })
})
