/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('error-message')

describe('Error message', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('error-message', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('allows additional classes to specified', () => {
    const $ = render('error-message', {
      classes: 'custom-class'
    })

    const $component = $('.govuk-error-message')
    expect($component.hasClass('custom-class')).toBeTruthy()
  })

  it('allows text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-message', {
      text: 'Unexpected > in body'
    })

    const content = $('.govuk-error-message').html().trim()
    expect(content).toEqual('Unexpected &gt; in body')
  })

  it('allows summary HTML to be passed un-escaped', () => {
    const $ = render('error-message', {
      text: 'Unexpected <b>bold text</b> in body copy',
      safe: true
    })

    const content = $('.govuk-error-message').html().trim()
    expect(content).toEqual('Unexpected <b>bold text</b> in body copy')
  })

  it('allows additional attributes to be specified', () => {
    const $ = render('error-message', {
      attributes: {
        'data-test': 'attribute',
        'id': 'my-error-message'
      }
    })

    const $component = $('.govuk-error-message')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('id')).toEqual('my-error-message')
  })

  describe('with keyword arguments', () => {
    it('allows error-message to be passed as string', () => {
      const $ = renderMacro('error-message', 'text as string')

      const $component = $('.govuk-error-message')
      expect($component.text()).toContain('text as string')
    })

    it('allows error-message params to be passed as keyword arguments', () => {
      const $ = renderMacro('error-message', null, {
        text: '<span>Hello</span>',
        safe: true,
        id: 'id',
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-error-message')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.attr('id')).toContain('id')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('error-message', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-error-message')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('error-message', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-error-message')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('error-message', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-error-message')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses id keyword argument before params.id', () => {
      const $ = renderMacro('error-message', {
        id: 'paramsId'
      }, {
        id: 'keywordsId'
      })

      const $component = $('.govuk-error-message')
      expect($component.attr('id')).toEqual('keywordsId')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('error-message', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-error-message')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('error-message', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-error-message')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('error-message', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukErrorMessage</strong>')
    })
  })
})
