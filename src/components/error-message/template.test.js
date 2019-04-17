/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('error-message')

describe('Error message', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('error-message', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('allows additional classes to specified', () => {
    const $ = render('error-message', {
      classes: 'custom-class'
    })

    const $component = $('.govuk-error-message')
    expect($component.hasClass('custom-class')).toBeTruthy()
  })

  it('allows text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-message', {
      text: 'Unexpected > in body'
    })

    const content = $('.govuk-error-message').html().trim()
    expect(content).toContain('Unexpected &gt; in body')
  })

  it('allows summary HTML to be passed un-escaped', () => {
    const $ = render('error-message', {
      html: 'Unexpected <b>bold text</b> in body copy'
    })

    const content = $('.govuk-error-message').html().trim()
    expect(content).toContain('Unexpected <b>bold text</b> in body copy')
  })

  it('allows additional attributes to be specified', () => {
    const $ = render('error-message', {
      attributes: {
        'data-test': 'attribute',
        'id': 'my-error-message'
      }
    })

    const $component = $('.govuk-error-message')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('id')).toEqual('my-error-message')
  })

  it('includes a visually hidden "Error" prefix by default', () => {
    const $ = render('error-message', {
      text: 'Enter your full name'
    })

    const $component = $('.govuk-error-message')
    expect($component.text().trim()).toEqual('Error: Enter your full name')
  })

  it('allows the visually hidden prefix to be customised', () => {
    const $ = render('error-message', {
      text: 'Rhowch eich enw llawn',
      visuallyHiddenText: 'Gwall'
    })

    const $component = $('.govuk-error-message')
    expect($component.text().trim()).toEqual('Gwall: Rhowch eich enw llawn')
  })

  it('allows the visually hidden prefix to be removed', () => {
    const $ = render('error-message', {
      text: 'There is an error on line 42',
      visuallyHiddenText: false
    })

    const $component = $('.govuk-error-message')
    expect($component.text().trim()).toEqual('There is an error on line 42')
  })
})
