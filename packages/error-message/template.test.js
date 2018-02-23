/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

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

    const $component = $('.govuk-c-error-message')
    expect($component.hasClass('custom-class')).toBeTruthy()
  })

  it('allows text to be passed whilst escaping HTML entities', () => {
    const $ = render('error-message', {
      text: 'Unexpected > in body'
    })

    const content = $('.govuk-c-error-message').html().trim()
    expect(content).toEqual('Unexpected &gt; in body')
  })

  it('allows summary HTML to be passed un-escaped', () => {
    const $ = render('error-message', {
      html: 'Unexpected <b>bold text</b> in body copy'
    })

    const content = $('.govuk-c-error-message').html().trim()
    expect(content).toEqual('Unexpected <b>bold text</b> in body copy')
  })

  it('allows additional attributes to be specified', () => {
    const $ = render('error-message', {
      attributes: {
        'data-test': 'attribute',
        'id': 'my-error-message'
      }
    })

    const $component = $('.govuk-c-error-message')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('id')).toEqual('my-error-message')
  })
})
