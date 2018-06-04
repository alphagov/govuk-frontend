/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('tag')

describe('Tag', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('tag', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders the default example with strong element and text', () => {
    const $ = render('tag', examples.default)

    const $component = $('.govuk-tag')
    expect($component.get(0).tagName).toEqual('strong')
    expect($component.text()).toContain('alpha')
  })

  it('renders classes', () => {
    const $ = render('tag', {
      classes: 'govuk-tag--inactive',
      text: 'alpha'
    })

    const $component = $('.govuk-tag')
    expect($component.hasClass('govuk-tag--inactive')).toBeTruthy()
  })

  it('renders custom text', () => {
    const $ = render('tag', {
      text: 'some-custom-text'
    })

    const $component = $('.govuk-tag')
    expect($component.html()).toContain('some-custom-text')
  })

  it('renders escaped html when passed to text', () => {
    const $ = render('tag', {
      text: '<span>alpha</span>'
    })

    const $component = $('.govuk-tag')
    expect($component.html()).toContain('&lt;span&gt;alpha&lt;/span&gt;')
  })

  it('renders html', () => {
    const $ = render('tag', {
      text: '<span>alpha</span>',
      safe: true
    })

    const $component = $('.govuk-tag')
    expect($component.html()).toContain('<span>alpha</span>')
  })

  it('renders attributes', () => {
    const $ = render('tag', {
      attributes: {
        'data-test': 'attribute',
        'id': 'my-tag'
      },
      text: '<span>alpha</span>',
      safe: true
    })

    const $component = $('.govuk-tag')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('id')).toEqual('my-tag')
  })

  describe('with keyword arguments', () => {
    it('allows tag to be passed as string', () => {
      const $ = renderMacro('tag', 'text as string')

      const $component = $('.govuk-tag')
      expect($component.text()).toContain('text as string')
    })

    it('allows tag params to be passed as keyword arguments', () => {
      const $ = renderMacro('tag', null, {
        text: '<span>Hello</span>',
        safe: true,
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })
      const $component = $('.govuk-tag')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toEqual('govuk-tag extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('tag', 'text as string', {
        text: 'args text'
      })

      const $component = $('.govuk-tag')
      expect($component.text()).toContain('args text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('tag', {
        text: 'text as object'
      }, {
        text: 'args text'
      })

      const $component = $('.govuk-tag')
      expect($component.text()).toContain('args text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('tag', {
        text: '<b>text as object</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-tag')
      expect($component.html()).toContain('&lt;b&gt;text as object&lt;/b&gt;')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('tag', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-tag')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('tag', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-tag')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('tag', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukTag</strong>')
    })
  })
})
