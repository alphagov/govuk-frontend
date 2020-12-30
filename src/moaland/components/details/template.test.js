/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples } = require('../../../../lib/jest-helpers')

const examples = getExamples('details')

describe('Details', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('details', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders a details element', () => {
    const $ = render('details', examples.default)

    const $component = $('.moaland-details')
    expect($component.get(0).tagName).toEqual('details')
  })

  it('renders with a custom id', () => {
    const $ = render('details', examples.id)

    const $component = $('.moaland-details')
    expect($component.attr('id')).toEqual('my-details-element')
  })

  it('is collapsed by default', () => {
    const $ = render('details', examples.default)

    const $component = $('.moaland-details')
    expect($component.attr('open')).toBeFalsy()
  })

  it('can be opened by default', () => {
    const $ = render('details', examples.expanded)

    const $component = $('.moaland-details')
    expect($component.attr('open')).toBeTruthy()
  })

  it('includes a nested summary', () => {
    const $ = render('details', examples.default)

    // Look for the summary element _within_ the details element
    const $summary = $('.moaland-details .moaland-details__summary')
    expect($summary.get(0).tagName).toEqual('summary')
  })

  it('allows text to be passed whilst escaping HTML entities', () => {
    const $ = render('details', examples['html as text'])

    const detailsText = $('.moaland-details__text').html().trim()
    expect(detailsText).toEqual('More about the greater than symbol (&gt;)')
  })

  it('allows HTML to be passed un-escaped', () => {
    const $ = render('details', examples.html)

    const detailsText = $('.moaland-details__text').html().trim()
    expect(detailsText).toEqual('More about <b>bold text</b>')
  })

  it('allows summary text to be passed whilst escaping HTML entities', () => {
    const $ = render('details', examples['summary html as text'])

    const detailsText = $('.moaland-details__summary-text').html().trim()
    expect(detailsText).toEqual('The greater than symbol (&gt;) is the best')
  })

  it('allows summary HTML to be passed un-escaped', () => {
    const $ = render('details', examples['summary html'])

    const detailsText = $('.moaland-details__summary-text').html().trim()
    expect(detailsText).toEqual('Use <b>bold text</b> sparingly')
  })

  it('allows additional classes to be added to the details element', () => {
    const $ = render('details', examples.classes)

    const $component = $('.moaland-details')
    expect($component.hasClass('some-additional-class')).toBeTruthy()
  })

  it('allows additional attributes to be added to the details element', () => {
    const $ = render('details', examples.attributes)

    const $component = $('.moaland-details')
    expect($component.attr('data-some-data-attribute')).toEqual('i-love-data')
    expect($component.attr('another-attribute')).toEqual('true')
  })
})
