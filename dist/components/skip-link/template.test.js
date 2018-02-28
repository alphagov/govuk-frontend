/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples } = require('../../lib/jest-helpers')

const examples = getExamples('skip-link')

describe('Skip link', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('skip-link', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('renders href', () => {
    const $ = render('skip-link', {
      href: '#custom'
    })

    const $component = $('.govuk-c-skip-link')
    expect($component.attr('href')).toEqual('#custom')
  })

  it('renders default href', () => {
    const $ = render('skip-link', {})

    const $component = $('.govuk-c-skip-link')
    expect($component.attr('href')).toEqual('#content')
  })

  it('renders text', () => {
    const $ = render('skip-link', {
      text: 'skip'
    })

    const $component = $('.govuk-c-skip-link')
    expect($component.html()).toEqual('skip')
  })

  it('renders escaped html in text', () => {
    const $ = render('skip-link', {
      text: '<p>skip</p>'
    })

    const $component = $('.govuk-c-skip-link')
    expect($component.html()).toEqual('&lt;p&gt;skip&lt;/p&gt;')
  })

  it('renders html', () => {
    const $ = render('skip-link', {
      html: '<p>skip</p>'
    })

    const $component = $('.govuk-c-skip-link')
    expect($component.html()).toEqual('<p>skip</p>')
  })

  it('renders classes', () => {
    const $ = render('skip-link', {
      classes: 'app-c-skip-link--custom-class'
    })

    const $component = $('.govuk-c-skip-link')
    expect($component.hasClass('app-c-skip-link--custom-class')).toBeTruthy()
  })

  it('renders attributes', () => {
    const $ = render('skip-link', {
      attributes: {
        'data-test': 'attribute',
        'aria-label': 'Skip to content'
      }
    })

    const $component = $('.govuk-c-skip-link')
    expect($component.attr('data-test')).toEqual('attribute')
    expect($component.attr('aria-label')).toEqual('Skip to content')
  })
})
