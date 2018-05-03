/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

const examples = getExamples('fieldset')

describe('fieldset', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('fieldset', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders a legend element inside a fieldset element for accessibility reasons', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is your address?'
      }
    })

    const $component = $('fieldset.govuk-fieldset')
    const $legend = $component.find('.govuk-fieldset__legend')
    expect($component.get(0).tagName).toContain('fieldset')
    expect($legend.get(0).tagName).toContain('legend')
  })

  it('renders classes', () => {
    const $ = render('fieldset', {
      classes: 'app-fieldset--custom-modifier'
    })

    const $component = $('.govuk-fieldset')
    expect($component.hasClass('app-fieldset--custom-modifier')).toBeTruthy()
  })

  it('renders legend text using markup that is semantic', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is your address?'
      }
    })

    const $component = $('fieldset.govuk-fieldset')
    const $legend = $component.find('legend.govuk-fieldset__legend')
    expect($legend.html()).toContain('What is your address?')
  })

  it('renders escaped legend text when passing html', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is <b>your</b> address?'
      }
    })

    const $component = $('.govuk-fieldset')
    const $legend = $component.find('.govuk-fieldset__legend')
    expect($legend.html()).toContain('What is &lt;b&gt;your&lt;/b&gt; address?')
  })

  it('renders legend HTML', () => {
    const $ = render('fieldset', {
      legend: {
        html: 'What is <b>your</b> address?'
      }
    })

    const $component = $('.govuk-fieldset')
    const $legend = $component.find('.govuk-fieldset__legend')
    expect($legend.html()).toContain('What is <b>your</b> address?')
  })

  it('can nest the contents of the legend in an H1 if using legend.isPageHeading', () => {
    const $ = render('fieldset', {
      legend: {
        text: 'What is your address?',
        isPageHeading: true
      }
    })

    const $headingInsideLegend = $('.govuk-fieldset__legend > h1')
    expect($headingInsideLegend.text().trim()).toBe('What is your address?')
  })

  it('renders attributes', () => {
    const $ = render('fieldset', {
      attributes: {
        'data-attribute': 'value',
        'data-another-attribute': 'another-value'
      }
    })

    const $component = $('.govuk-fieldset')
    expect($component.attr('data-attribute')).toEqual('value')
    expect($component.attr('data-another-attribute')).toEqual('another-value')
  })
})
