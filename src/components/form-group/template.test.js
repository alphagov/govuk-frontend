/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('form-group')

describe('Form group', () => {
  it('passes accessibility tests', async () => {
    const $ = render('form-group', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('creates a form group', () => {
    const $ = render('form-group', {
      id: 'sample-question'
    })

    const $component = $('div.govuk-form-group')
    expect($component.get(0).tagName).toContain('div')
  })

  it('allows you to set the legend text', () => {
    const $ = render('form-group', {
      id: 'sample-question',
      fieldset: {
        legend: {
          text: 'What is your address?'
        }
      }
    })

    const $legend = $('div.govuk-form-group legend')
    expect($legend.get(0).tagName).toContain('legend')
  })

  it('allows you to set the hint text', () => {
    const $ = render('form-group', {
      id: 'sample-question',
      hint: {
        text: 'Example hint about the address'
      }
    })

    const $hint = $('div.govuk-form-group span.govuk-hint')
    expect($hint.text().trim()).toEqual('Example hint about the address')
  })

  it('allows you to set the label text', () => {
    const $ = render('form-group', {
      id: 'sample-question',
      label: {
        text: 'What is your address?'
      }
    })

    const $label = $('div.govuk-form-group label')
    expect($label.text().trim()).toEqual('What is your address?')
  })

  it('allows you to set the error message text', () => {
    const $ = render('form-group', {
      id: 'sample-question',
      errorMessage: {
        text: 'Something is wrong with this field'
      }
    })

    const $error = $('div.govuk-form-group span.govuk-error-message')
    expect($error.text().trim()).toEqual('Error: Something is wrong with this field')
  })

  it('renders nested components using `call`', () => {
    const $ = render('form-group', {}, '<div class="app-nested-component"></div>')

    expect($('.govuk-form-group .app-nested-component').length).toBeTruthy()
  })

  it('can have additional classes on the form group', () => {
    const $ = render('form-group', {
      formGroup: {
        classes: 'my-custom-class'
      }
    })

    const $component = $('div.govuk-form-group')
    expect($component.hasClass('my-custom-class')).toBeTruthy()
  })
})
