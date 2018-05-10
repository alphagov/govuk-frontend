/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

const examples = getExamples('details')

describe('Details', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('details', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders a details element', () => {
    const $ = render('details', examples.default)

    const $component = $('.govuk-c-details')
    expect($component.get(0).tagName).toEqual('details')
  })

  it('includes a nested summary', () => {
    const $ = render('details', examples.default)

    // Look for the summary element _within_ the details element
    const $summary = $('.govuk-c-details .govuk-c-details__summary')
    expect($summary.get(0).tagName).toEqual('summary')
  })

  it('allows text to be passed whilst escaping HTML entities', () => {
    const $ = render('details', {
      text: 'More about the greater than symbol (>)'
    })

    const detailsText = $('.govuk-c-details__text').html().trim()
    expect(detailsText).toEqual('More about the greater than symbol (&gt;)')
  })

  it('allows HTML to be passed un-escaped', () => {
    const $ = render('details', {
      html: 'More about <b>bold text</b>'
    })

    const detailsText = $('.govuk-c-details__text').html().trim()
    expect(detailsText).toEqual('More about <b>bold text</b>')
  })

  it('allows summary text to be passed whilst escaping HTML entities', () => {
    const $ = render('details', {
      summaryText: 'The greater than symbol (>) is the best'
    })

    const detailsText = $('.govuk-c-details__summary-text').html().trim()
    expect(detailsText).toEqual('The greater than symbol (&gt;) is the best')
  })

  it('allows summary HTML to be passed un-escaped', () => {
    const $ = render('details', {
      summaryHtml: 'Use <b>bold text</b> sparingly'
    })

    const detailsText = $('.govuk-c-details__summary-text').html().trim()
    expect(detailsText).toEqual('Use <b>bold text</b> sparingly')
  })

  it('allows additional classes to be added to the details element', () => {
    const $ = render('details', {
      classes: 'some-additional-class'
    })

    const $component = $('.govuk-c-details')
    expect($component.hasClass('some-additional-class')).toBeTruthy()
  })

  it('allows additional attributes to be added to the details element', () => {
    const $ = render('details', {
      attributes: {
        'data-some-data-attribute': 'i-love-data',
        'another-attribute': 'true'
      }
    })

    const $component = $('.govuk-c-details')
    expect($component.attr('data-some-data-attribute')).toEqual('i-love-data')
    expect($component.attr('another-attribute')).toEqual('true')
  })
})
