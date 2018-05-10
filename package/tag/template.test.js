/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

const examples = getExamples('tag')

describe('Tag', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('tag', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders the default example with strong element and text', () => {
    const $ = render('tag', examples.default)

    const $component = $('.govuk-c-tag')
    expect($component.get(0).tagName).toEqual('strong')
    expect($component.text()).toContain('alpha')
  })

  it('renders classes', () => {
    const $ = render('tag', {
      classes: 'govuk-c-tag--inactive',
      text: 'alpha'
    })

    const $component = $('.govuk-c-tag')
    expect($component.hasClass('govuk-c-tag--inactive')).toBeTruthy()
  })

  it('renders custom text', () => {
    const $ = render('tag', {
      text: 'some-custom-text'
    })

    const $component = $('.govuk-c-tag')
    expect($component.html()).toContain('some-custom-text')
  })

  it('renders escaped html when passed to text', () => {
    const $ = render('tag', {
      text: '<span>alpha</span>'
    })

    const $component = $('.govuk-c-tag')
    expect($component.html()).toContain('&lt;span&gt;alpha&lt;/span&gt;')
  })

  it('renders html', () => {
    const $ = render('tag', {
      html: '<span>alpha</span>'
    })

    const $component = $('.govuk-c-tag')
    expect($component.html()).toContain('<span>alpha</span>')
  })

  it('renders attributes', () => {
    const $ = render('tag', {
      attributes: {
        'data-test': 'attribute',
        'id': 'my-tag'
      },
      html: '<span>alpha</span>'
    })

    const $component = $('.govuk-c-tag')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('id')).toEqual('my-tag')
  })
})
