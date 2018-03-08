/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples, htmlWithClassName } = require('../../lib/jest-helpers')

const examples = getExamples('fieldset')

describe('fieldset', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('fieldset', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders a legend element inside a fieldset element for accessibility reasons', () => {
    const $ = render('fieldset', {
      legendText: 'What is your address?'
    })

    const $component = $('fieldset.govuk-c-fieldset')
    const $legend = $component.find('.govuk-c-fieldset__legend')
    expect($component.get(0).tagName).toContain('fieldset')
    expect($legend.get(0).tagName).toContain('legend')
  })

  it('renders classes', () => {
    const $ = render('fieldset', {
      classes: 'app-c-fieldset--custom-modifier'
    })

    const $component = $('.govuk-c-fieldset')
    expect($component.hasClass('app-c-fieldset--custom-modifier')).toBeTruthy()
  })

  it('renders legendText using markup that is semantic', () => {
    const $ = render('fieldset', {
      legendText: 'What is your address?'
    })

    const $component = $('fieldset.govuk-c-fieldset')
    const $legend = $component.find('legend.govuk-c-fieldset__legend')
    expect($legend.html()).toContain('What is your address?')
  })

  it('renders escaped legendText when passing html', () => {
    const $ = render('fieldset', {
      legendText: 'What is <b>your</b> address?'
    })

    const $component = $('.govuk-c-fieldset')
    const $legend = $component.find('.govuk-c-fieldset__legend')
    expect($legend.html()).toContain('What is &lt;b&gt;your&lt;/b&gt; address?')
  })

  it('renders legendHtml', () => {
    const $ = render('fieldset', {
      legendHtml: 'What is <b>your</b> address?'
    })

    const $component = $('.govuk-c-fieldset')
    const $legend = $component.find('.govuk-c-fieldset__legend')
    expect($legend.html()).toContain('What is <b>your</b> address?')
  })

  it('renders legendHintText using markup that is semantic', () => {
    const $ = render('fieldset', {
      legendText: 'What is your address?',
      legendHintText: 'For example, 10 Downing Street'
    })

    const $component = $('.govuk-c-fieldset')
    const $hint = $component.find('.govuk-c-fieldset__hint')
    expect($hint.html()).toEqual('For example, 10 Downing Street')
  })

  it('renders escaped legendHintText when passing html', () => {
    const $ = render('fieldset', {
      legendText: 'What is your address?',
      legendHintText: 'For example, <b>10 Downing Street</b>'
    })

    const $component = $('.govuk-c-fieldset')
    const $hint = $component.find('.govuk-c-fieldset__hint')
    expect($hint.html()).toEqual('For example, &lt;b&gt;10 Downing Street&lt;/b&gt;')
  })

  it('renders legendHintHtml', () => {
    const $ = render('fieldset', {
      legendText: 'What is your address?',
      legendHintHtml: 'For example, <b>10 Downing Street</b>'
    })

    const $component = $('.govuk-c-fieldset')
    const $hint = $component.find('.govuk-c-fieldset__hint')
    expect($hint.html()).toEqual('For example, <b>10 Downing Street</b>')
  })

  it('renders attributes', () => {
    const $ = render('fieldset', {
      attributes: {
        'data-attribute': 'value',
        'data-another-attribute': 'another-value'
      }
    })

    const $component = $('.govuk-c-fieldset')
    expect($component.attr('data-attribute')).toEqual('value')
    expect($component.attr('data-another-attribute')).toEqual('another-value')
  })

  describe('dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('fieldset', examples['with-error-message'])

      const $component = $('.govuk-o-form-group > .govuk-c-fieldset')
      expect($component.length).toBeTruthy()
    })

    it('passes through errorMessage params without breaking', () => {
      const $ = render('fieldset', examples['with-error-message'])

      expect(htmlWithClassName($, '.govuk-c-error-message')).toMatchSnapshot()
    })
  })
})
