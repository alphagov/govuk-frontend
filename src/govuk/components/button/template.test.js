/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('button')

describe('Button', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('button', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders a button if you don\'t pass anything', () => {
    const $ = render('button', {})

    const $component = $('.govuk-button')
    expect($component.get(0).tagName).toEqual('button')
  })

  describe('button element', () => {
    it('renders the default example', () => {
      const $ = render('button', examples.default)

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('button')
      expect($component.text()).toContain('Save and continue')
    })

    it('renders with attributes', () => {
      const $ = render('button', examples.attributes)

      const $component = $('.govuk-button')
      expect($component.attr('aria-controls')).toEqual('example-id')
    })

    it('renders with classes', () => {
      const $ = render('button', examples['custom classes'])

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

    it('renders with value', () => {
      const $ = render('button', examples.value)

      const $component = $('.govuk-button')
      expect($component.attr('value')).toEqual('start')
    })

    it('renders with html', () => {
      const $ = render('button', examples.html)

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('button')
      expect($component.html()).toContain('Start <em>now</em>')
    })

    it('renders with name', () => {
      const $ = render('button', examples['name'])

      const $component = $('.govuk-button')
      expect($component.attr('name')).toEqual('start-now')
    })

    it('renders with type', () => {
      const $ = render('button', examples.type)

      const $component = $('.govuk-button')
      expect($component.attr('type')).toEqual('button')
    })
  })

  describe('link', () => {
    it('renders with anchor, href and an accessible role of button', () => {
      const $ = render('button', examples.link)

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('a')
      expect($component.attr('href')).toEqual('/')
      expect($component.attr('role')).toEqual('button')
    })

    it('renders with hash href if no href passed', () => {
      const $ = render('button', examples['no href link'])

      const $component = $('.govuk-button')
      expect($component.attr('href')).toEqual('#')
    })

    it('renders with attributes', () => {
      const $ = render('button', examples['link with attributes'])

      const $component = $('.govuk-button')
      expect($component.attr('data-tracking-dimension')).toEqual('123')
    })

    it('renders with classes', () => {
      const $ = render('button', examples['link with classes'])

      const $component = $('.govuk-button')
      expect($component.hasClass('app-button--custom-modifier')).toBeTruthy()
    })

    it('renders with disabled', () => {
      const $ = render('button', examples['link disabled'])

      const $component = $('.govuk-button')
      expect($component.hasClass('govuk-button--disabled')).toBeTruthy()
    })
  })

  describe('with explicit input button set by "element"', () => {
    it('renders with anchor, href and an accessible role of button', () => {
      const $ = render('button', examples['input'])

      const $component = $('.govuk-button')
      expect($component.get(0).tagName).toEqual('input')
      expect($component.attr('type')).toEqual('submit')
      expect($component.attr('name')).toEqual('start-now')
    })

    it('renders with attributes', () => {
      const $ = render('button', examples['input attributes'])

      const $component = $('.govuk-button')
      expect($component.attr('aria-controls')).toEqual('example-id')
    })

    it('renders with classes', () => {
      const $ = render('button', examples['input classes'])

      const $component = $('.govuk-button')
      expect($component.hasClass('app-button--custom-modifier')).toBeTruthy()
    })

    it('renders with disabled', () => {
      const $ = render('button', examples['input disabled'])

      const $component = $('.govuk-button')
      expect($component.attr('aria-disabled')).toEqual('true')
      expect($component.attr('disabled')).toEqual('disabled')
      expect($component.hasClass('govuk-button--disabled')).toBeTruthy()
    })

    it('renders with preventDoubleClick attribute', () => {
      const $ = render('button', examples['prevent double click'])

      const $component = $('.govuk-button')
      expect($component.attr('data-prevent-double-click')).toEqual('true')
    })
  })

  describe('Start button', () => {
    it('renders a svg', () => {
      const $ = render('button', examples['start link'])

      const $component = $('.govuk-button .govuk-button__start-icon')
      expect($component.get(0).tagName).toEqual('svg')
    })
  })
})
