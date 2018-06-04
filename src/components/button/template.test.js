/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('button')

describe('Button', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('button', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  describe('button element', () => {
    it('renders the default example', () => {
      const $ = render('button', examples.default)

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('button')
      expect($component.text()).toContain('Save and continue')
    })

    it('renders with attributes', () => {
      const $ = render('button', {
        element: 'button',
        attributes: {
          'aria-controls': 'example-id',
          'data-tracking-dimension': '123'
        }
      })

      const $component = $('.govuk-button')
      expect($component.attr('aria-controls')).toEqual('example-id')
      expect($component.attr('data-tracking-dimension')).toEqual('123')
    })

    it('renders with classes', () => {
      const $ = render('button', {
        element: 'button',
        classes: 'app-button--custom-modifier'
      })

      const $component = $('.govuk-button')
      expect($component.hasClass('app-button--custom-modifier')).toBeTruthy()
    })

    it('renders with disabled', () => {
      const $ = render('button', examples.disabled)

      const $component = $('.govuk-button')
      expect($component.attr('aria-disabled')).toEqual('true')
      expect($component.attr('disabled')).toEqual('disabled')
      expect($component.hasClass('govuk-button--disabled')).toBeTruthy()
    })

    it('renders with name', () => {
      const $ = render('button', {
        element: 'button',
        name: 'start-now'
      })

      const $component = $('.govuk-button')
      expect($component.attr('name')).toEqual('start-now')
    })

    it('renders with type', () => {
      const $ = render('button', {
        element: 'button',
        type: 'button'
      })

      const $component = $('.govuk-button')
      expect($component.attr('type')).toEqual('button')
    })
  })

  describe('link', () => {
    it('renders with anchor, href and an accessible role of button', () => {
      const $ = render('button', {
        element: 'a',
        href: '/',
        text: 'Continue'
      })

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('a')
      expect($component.attr('href')).toEqual('/')
      expect($component.attr('role')).toEqual('button')
      expect($component.text()).toContain('Continue')
    })

    it('renders with hash href if no href passed', () => {
      const $ = render('button', {
        element: 'a'
      })

      const $component = $('.govuk-button')
      expect($component.attr('href')).toEqual('#')
    })

    it('renders with value', () => {
      const $ = render('button', {
        element: 'button',
        value: 'start'
      })

      const $component = $('.govuk-button')
      expect($component.attr('value')).toEqual('start')
    })

    it('renders with html which has been marked safe', () => {
      const $ = render('button', {
        element: 'button',
        text: 'Start <em>now</em>',
        safe: true
      })

      const $component = $('.govuk-button')
      expect($component.html()).toContain('Start <em>now</em>')
    })

    it('renders with attributes', () => {
      const $ = render('button', {
        element: 'a',
        attributes: {
          'aria-controls': 'example-id',
          'data-tracking-dimension': '123'
        }
      })

      const $component = $('.govuk-button')
      expect($component.attr('aria-controls')).toEqual('example-id')
      expect($component.attr('data-tracking-dimension')).toEqual('123')
    })

    it('renders with classes', () => {
      const $ = render('button', {
        element: 'a',
        classes: 'app-button--custom-modifier'
      })

      const $component = $('.govuk-button')
      expect($component.hasClass('app-button--custom-modifier')).toBeTruthy()
    })

    it('renders with disabled', () => {
      const $ = render('button', examples['disabled-link'])

      const $component = $('.govuk-button')
      expect($component.hasClass('govuk-button--disabled')).toBeTruthy()
    })
  })

  describe('with explicit input button set by "element"', () => {
    it('renders with anchor, href and an accessible role of button', () => {
      const $ = render('button', examples['explicit-input-button'])

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('input')
      expect($component.attr('type')).toEqual('submit')
    })

    it('renders with attributes', () => {
      const $ = render('button', {
        element: 'input',
        attributes: {
          'aria-controls': 'example-id',
          'data-tracking-dimension': '123'
        }
      })

      const $component = $('.govuk-button')
      expect($component.attr('aria-controls')).toEqual('example-id')
      expect($component.attr('data-tracking-dimension')).toEqual('123')
    })

    it('renders with classes', () => {
      const $ = render('button', {
        element: 'input',
        classes: 'app-button--custom-modifier'
      })

      const $component = $('.govuk-button')
      expect($component.hasClass('app-button--custom-modifier')).toBeTruthy()
    })

    it('renders with disabled', () => {
      const $ = render('button', {
        element: 'input',
        disabled: true
      })

      const $component = $('.govuk-button')
      expect($component.attr('aria-disabled')).toEqual('true')
      expect($component.attr('disabled')).toEqual('disabled')
      expect($component.hasClass('govuk-button--disabled')).toBeTruthy()
    })

    it('renders with name', () => {
      const $ = render('button', {
        element: 'input',
        name: 'start-now'
      })

      const $component = $('.govuk-button')
      expect($component.attr('name')).toEqual('start-now')
    })

    it('renders with type', () => {
      const $ = render('button', {
        element: 'input',
        type: 'button',
        text: 'Start now'
      })

      const $component = $('.govuk-button')
      expect($component.attr('type')).toEqual('button')
    })
  })

  describe('implicitly as no "element" param is set', () => {
    it('renders a link if you pass an href', () => {
      const $ = render('button', {
        href: '/'
      })

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('a')
    })

    it('renders a button if you pass html which has been marked safe', () => {
      const $ = render('button', {
        text: 'Start <em>now</em>',
        safe: true
      })

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('button')
    })

    it('renders a button if you don\'t pass anything', () => {
      const $ = render('button', {})

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('button')
      expect($component.attr('type')).toEqual('submit')
    })
  })

  describe('with keyword arguments', () => {
    it('allows button to be passed as string', () => {
      const $ = renderMacro('button', 'text as string')

      const $component = $('.govuk-button')
      expect($component.text()).toContain('text as string')
    })

    it('allows button params to be passed as keyword arguments', () => {
      const $ = renderMacro('button', null, {
        text: '<span>Hello</span>',
        safe: true,
        value: 'button value',
        type: 'button',
        disabled: true,
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-button')
      expect($component.html()).toContain('<span>Hello</span>')
      // expect($component.attr('id')).toContain('id')
      expect($component.attr('value')).toEqual('button value')
      expect($component.attr('type')).toEqual('button')
      expect($component.attr('disabled')).toEqual('disabled')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
    })

    it('uses text keyword argument before params as string', () => {
      const $ = renderMacro('button', 'text as string', {
        text: 'keyword text'
      })

      const $component = $('.govuk-button')
      expect($component.text()).toContain('keyword text')
    })

    it('uses text keyword argument before params.text', () => {
      const $ = renderMacro('button', {
        text: 'params text'
      }, {
        text: 'keyword text'
      })

      const $component = $('.govuk-button')
      expect($component.text()).toContain('keyword text')
    })

    it('uses safe keyword argument before before params.safe', () => {
      const $ = renderMacro('button', {
        text: '<b>params text</b>',
        safe: true
      }, {
        safe: false
      })

      const $component = $('.govuk-button')
      expect($component.html()).toContain('&lt;b&gt;params text&lt;/b&gt;')
    })

    it('uses value keyword argument before params.value', () => {
      const $ = renderMacro('button', {
        value: 'params value'
      }, {
        value: 'keyword value'
      })

      const $component = $('.govuk-button')
      expect($component.attr('value')).toEqual('keyword value')
    })

    it('uses href keyword argument before params.href', () => {
      const $ = renderMacro('button', {
        text: 'button text',
        href: '/paramsUrl'
      }, {
        href: '/keywordUrl'
      })

      const $component = $('.govuk-button')
      expect($component.attr('href')).toEqual('/keywordUrl')
    })

    it('uses element keyword argument before params.element', () => {
      const $ = renderMacro('button', {
        text: 'button text',
        element: 'a'
      }, {
        element: 'input'
      })

      const $component = $('.govuk-button')
      expect($component.get(0).name).toEqual('input')
    })

    it('uses type keyword argument before params.type', () => {
      const $ = renderMacro('button', {
        text: 'button text',
        type: 'submit'
      }, {
        type: 'button'
      })

      const $component = $('.govuk-button')
      expect($component.attr('type')).toEqual('button')
    })

    it('uses disabled keyword argument before params.disabled', () => {
      const $ = renderMacro('button', {
        disabled: true
      }, {
        disabled: false
      })

      const $component = $('.govuk-button')
      expect($component.attr('disabled')).not.toEqual('disabled')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('button', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-button')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('button', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-button')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.html', () => {
      const $ = renderMacro('button', {
        html: '<b>params text</b>'
      })

      expect($.html()).toContain('<strong class="deprecated">params.html is deprecated in govukButton</strong>')
    })
  })
})
