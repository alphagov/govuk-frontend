/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

const examples = getExamples('button')

describe('Button', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('button', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  describe('input[type=submit]', () => {
    it('renders the default example', () => {
      const $ = render('button', examples.default)

      const $component = $('.govuk-c-button')
      expect($component.get(0).tagName).toEqual('input')
      expect($component.attr('type')).toEqual('submit')
      expect($component.val()).toEqual('Save and continue')
    })

    it('renders with attributes', () => {
      const $ = render('button', {
        element: 'input',
        attributes: {
          'aria-controls': 'example-id',
          'data-tracking-dimension': '123'
        }
      })

      const $component = $('.govuk-c-button')
      expect($component.attr('aria-controls')).toEqual('example-id')
      expect($component.attr('data-tracking-dimension')).toEqual('123')
    })

    it('renders with classes', () => {
      const $ = render('button', {
        element: 'input',
        classes: 'app-c-button--custom-modifier'
      })

      const $component = $('.govuk-c-button')
      expect($component.hasClass('app-c-button--custom-modifier')).toBeTruthy()
    })

    it('renders with disabled', () => {
      const $ = render('button', examples.disabled)

      const $component = $('.govuk-c-button')
      expect($component.attr('aria-disabled')).toEqual('true')
      expect($component.attr('disabled')).toEqual('disabled')
      expect($component.hasClass('govuk-c-button--disabled')).toBeTruthy()
    })

    it('renders with name', () => {
      const $ = render('button', {
        element: 'input',
        name: 'start-now'
      })

      const $component = $('.govuk-c-button')
      expect($component.attr('name')).toEqual('start-now')
    })

    it('renders with type', () => {
      const $ = render('button', {
        element: 'input',
        type: 'button'
      })

      const $component = $('.govuk-c-button')
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

      const $component = $('.govuk-c-button')
      expect($component.get(0).tagName).toEqual('a')
      expect($component.attr('href')).toEqual('/')
      expect($component.attr('role')).toEqual('button')
      expect($component.text()).toContain('Continue')
    })

    it('renders with hash href if no href passed', () => {
      const $ = render('button', {
        element: 'a'
      })

      const $component = $('.govuk-c-button')
      expect($component.attr('href')).toEqual('#')
    })

    it('renders with attributes', () => {
      const $ = render('button', {
        element: 'a',
        attributes: {
          'aria-controls': 'example-id',
          'data-tracking-dimension': '123'
        }
      })

      const $component = $('.govuk-c-button')
      expect($component.attr('aria-controls')).toEqual('example-id')
      expect($component.attr('data-tracking-dimension')).toEqual('123')
    })

    it('renders with classes', () => {
      const $ = render('button', {
        element: 'a',
        classes: 'app-c-button--custom-modifier'
      })

      const $component = $('.govuk-c-button')
      expect($component.hasClass('app-c-button--custom-modifier')).toBeTruthy()
    })

    it('renders with disabled', () => {
      const $ = render('button', examples['disabled-link'])

      const $component = $('.govuk-c-button')
      expect($component.hasClass('govuk-c-button--disabled')).toBeTruthy()
    })
  })

  describe('with explicit button set by "element"', () => {
    it('renders with anchor, href and an accessible role of button', () => {
      const $ = render('button', examples['explicit-button'])

      const $component = $('.govuk-c-button')
      expect($component.get(0).tagName).toEqual('button')
      expect($component.attr('type')).toEqual('submit')
    })

    it('renders with attributes', () => {
      const $ = render('button', {
        element: 'button',
        attributes: {
          'aria-controls': 'example-id',
          'data-tracking-dimension': '123'
        }
      })

      const $component = $('.govuk-c-button')
      expect($component.attr('aria-controls')).toEqual('example-id')
      expect($component.attr('data-tracking-dimension')).toEqual('123')
    })

    it('renders with classes', () => {
      const $ = render('button', {
        element: 'button',
        classes: 'app-c-button--custom-modifier'
      })

      const $component = $('.govuk-c-button')
      expect($component.hasClass('app-c-button--custom-modifier')).toBeTruthy()
    })

    it('renders with disabled', () => {
      const $ = render('button', {
        element: 'button',
        disabled: true
      })

      const $component = $('.govuk-c-button')
      expect($component.attr('aria-disabled')).toEqual('true')
      expect($component.attr('disabled')).toEqual('disabled')
      expect($component.hasClass('govuk-c-button--disabled')).toBeTruthy()
    })

    it('renders with name', () => {
      const $ = render('button', {
        element: 'button',
        name: 'start-now'
      })

      const $component = $('.govuk-c-button')
      expect($component.attr('name')).toEqual('start-now')
    })

    it('renders with value', () => {
      const $ = render('button', {
        element: 'button',
        value: 'start'
      })

      const $component = $('.govuk-c-button')
      expect($component.attr('value')).toEqual('start')
    })

    it('renders with html', () => {
      const $ = render('button', {
        element: 'button',
        html: 'Start <em>now</em>'
      })

      const $component = $('.govuk-c-button')
      expect($component.html()).toContain('Start <em>now</em>')
    })

    it('renders with type', () => {
      const $ = render('button', {
        element: 'button',
        type: 'button',
        text: 'Start now'
      })

      const $component = $('.govuk-c-button')
      expect($component.attr('type')).toEqual('button')
    })
  })

  describe('implicitly as no "element" param is set', () => {
    it('renders a link if you pass an href', () => {
      const $ = render('button', {
        href: '/'
      })

      const $component = $('.govuk-c-button')
      expect($component.get(0).tagName).toEqual('a')
    })

    it('renders a button if you pass html', () => {
      const $ = render('button', {
        html: 'Start <em>now</em>'
      })

      const $component = $('.govuk-c-button')
      expect($component.get(0).tagName).toEqual('button')
    })

    it('renders an input[type=submit] if you don\'t pass anything', () => {
      const $ = render('button', {})

      const $component = $('.govuk-c-button')
      expect($component.get(0).tagName).toEqual('input')
      expect($component.attr('type')).toEqual('submit')
    })
  })
})
