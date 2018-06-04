/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('warning-text')

describe('Warning text', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('warning-text', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders the default example with text', () => {
    const $ = render('warning-text', examples.default)

    const $component = $('.govuk-warning-text')
    expect($component.text()).toContain('You can be fined up to £5,000 if you don’t register.')
  })

  it('renders the default example with assistive text', () => {
    const $ = render('warning-text', examples.default)

    const $assistiveText = $('.govuk-warning-text__assistive')
    expect($assistiveText.text()).toEqual('Warning')
  })

  it('hides the icon from screen readers using the aria-hidden attribute', () => {
    const $ = render('warning-text', examples.default)

    const $icon = $('.govuk-warning-text__icon')
    expect($icon.attr('aria-hidden')).toEqual('true')
  })

  it('renders classes', () => {
    const $ = render('warning-text', {
      classes: 'govuk-warning-text--custom-class',
      text: 'Warning text'
    })

    const $component = $('.govuk-warning-text')
    expect($component.hasClass('govuk-warning-text--custom-class')).toBeTruthy()
  })

  it('renders custom text', () => {
    const $ = render('warning-text', {
      text: 'Some custom warning text'
    })
    const $component = $('.govuk-warning-text')
    expect($component.html()).toContain('Some custom warning text')
  })

  it('renders custom assistive text', () => {
    const $ = render('warning-text', {
      iconFallbackText: 'Some custom fallback text'
    })
    const $assistiveText = $('.govuk-warning-text__assistive')
    expect($assistiveText.html()).toContain('Some custom fallback text')
  })

  it('renders escaped html when passed to text', () => {
    const $ = render('warning-text', {
      text: '<span>Some custom warning text</span>'
    })

    const $component = $('.govuk-warning-text')
    expect($component.html()).toContain('&lt;span&gt;Some custom warning text&lt;/span&gt;')
  })

  it('renders html', () => {
    const $ = render('warning-text', {
      text: '<span>Some custom warning text</span>',
      safe: true
    })

    const $component = $('.govuk-warning-text')
    expect($component.html()).toContain('<span>Some custom warning text</span>')
  })

  it('renders attributes', () => {
    const $ = render('warning-text', {
      attributes: {
        'data-test': 'attribute',
        'id': 'my-warning-text'
      }
    })

    const $component = $('.govuk-warning-text')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('id')).toEqual('my-warning-text')
  })

  describe('with keyword arguments', () => {
    it('allows warning to be passed as string', () => {
      const $ = renderMacro('warning-text', 'text as string')

      const $component = $('.govuk-warning-text__text')
      expect($component.text()).toContain('text as string')
    })

    it('allows warning params to be passed as keyword arguments', () => {
      const $ = renderMacro('warning-text', null, {
        text: '<span>Hello</span>',
        safe: true,
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        },
        iconFallbackText: 'fallback text'
      })

      const $component = $('.govuk-warning-text')
      expect($component.html()).toContain('<span>Hello</span>')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
      expect($component.html()).toContain('fallback text')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('warning-text', 'text as string', {
        text: 'args text'
      })

      const $component = $('.govuk-warning-text')
      expect($component.text()).toContain('args text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('warning-text', {
        text: 'text as object'
      }, {
        text: 'args text'
      })

      const $component = $('.govuk-warning-text')
      expect($component.text()).toContain('args text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('warning-text', {
        text: '<b>text as object</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-warning-text')
      expect($component.html()).toContain('&lt;b&gt;text as object&lt;/b&gt;')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('warning-text', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-warning-text')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('warning-text', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-warning-text')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })

    it('uses iconFallbackText keyword argument before before params.iconFallbackText', () => {
      const $ = renderMacro('warning-text', {
        text: 'params text',
        iconFallbackText: 'paramsIconText'
      }, {
        iconFallbackText: 'keywordIconText'
      })
      const $component = $('.govuk-warning-text__assistive')
      expect($component.text()).toContain('keywordIconText')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('warning-text', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukWarningText</strong>')
    })
  })
})
