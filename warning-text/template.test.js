/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

const examples = getExamples('warning-text')

describe('Warning text', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('warning-text', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders the default example with text', () => {
    const $ = render('warning-text', examples.default)

    const $component = $('.govuk-c-warning-text')
    expect($component.text()).toContain('You can be fined up to £5,000 if you don’t register.')
  })

  it('renders the default example with assistive text', () => {
    const $ = render('warning-text', examples.default)

    const $assistiveText = $('.govuk-c-warning-text__assistive')
    expect($assistiveText.text()).toEqual('Warning')
  })

  it('hides the icon from screen readers using the aria-hidden attribute', () => {
    const $ = render('warning-text', examples.default)

    const $icon = $('.govuk-c-warning-text__icon')
    expect($icon.attr('aria-hidden')).toEqual('true')
  })

  it('renders classes', () => {
    const $ = render('warning-text', {
      classes: 'govuk-c-warning-text--custom-class',
      text: 'Warning text'
    })

    const $component = $('.govuk-c-warning-text')
    expect($component.hasClass('govuk-c-warning-text--custom-class')).toBeTruthy()
  })

  it('renders custom text', () => {
    const $ = render('warning-text', {
      text: 'Some custom warning text'
    })
    const $component = $('.govuk-c-warning-text')
    expect($component.html()).toContain('Some custom warning text')
  })

  it('renders custom assistive text', () => {
    const $ = render('warning-text', {
      iconFallbackText: 'Some custom fallback text'
    })
    const $assistiveText = $('.govuk-c-warning-text__assistive')
    expect($assistiveText.html()).toContain('Some custom fallback text')
  })

  it('renders escaped html when passed to text', () => {
    const $ = render('warning-text', {
      text: '<span>Some custom warning text</span>'
    })

    const $component = $('.govuk-c-warning-text')
    expect($component.html()).toContain('&lt;span&gt;Some custom warning text&lt;/span&gt;')
  })

  it('renders html', () => {
    const $ = render('warning-text', {
      html: '<span>Some custom warning text</span>'
    })

    const $component = $('.govuk-c-warning-text')
    expect($component.html()).toContain('<span>Some custom warning text</span>')
  })

  it('renders attributes', () => {
    const $ = render('warning-text', {
      attributes: {
        'data-test': 'attribute',
        'id': 'my-warning-text'
      }
    })

    const $component = $('.govuk-c-warning-text')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('id')).toEqual('my-warning-text')
  })
})
