/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, getExamples, htmlWithClassName } = require('../../lib/jest-helpers')

const examples = getExamples('checkboxes')

describe('Checkboxes', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('checkboxes', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('render example with minimum required name and items', () => {
    const $ = render('checkboxes', {
      name: 'example-name',
      items: [
        {
          value: '1',
          text: 'Option 1'
        },
        {
          value: '2',
          text: 'Option 2'
        }
      ]
    })

    const $component = $('.govuk-c-checkboxes')

    const $firstInput = $component.find('.govuk-c-checkboxes__item:first-child input')
    const $firstLabel = $component.find('.govuk-c-checkboxes__item:first-child label')
    expect($firstInput.attr('name')).toEqual('example-name')
    expect($firstInput.val()).toEqual('1')
    expect($firstLabel.text()).toContain('Option 1')

    const $lastInput = $component.find('.govuk-c-checkboxes__item:last-child input')
    const $lastLabel = $component.find('.govuk-c-checkboxes__item:last-child label')
    expect($lastInput.attr('name')).toEqual('example-name')
    expect($lastInput.val()).toEqual('2')
    expect($lastLabel.text()).toContain('Option 2')
  })

  it('render classes', () => {
    const $ = render('checkboxes', {
      name: 'example-name',
      items: [
        {
          value: '1',
          text: 'Option 1'
        },
        {
          value: '2',
          text: 'Option 2'
        }
      ],
      classes: 'app-c-checkboxes--custom-modifier'
    })

    const $component = $('.govuk-c-checkboxes')

    expect($component.hasClass('app-c-checkboxes--custom-modifier')).toBeTruthy()
  })

  it('render attributes', () => {
    const $ = render('checkboxes', {
      name: 'example-name',
      items: [
        {
          value: '1',
          text: 'Option 1'
        },
        {
          value: '2',
          text: 'Option 2'
        }
      ],
      attributes: {
        'data-attribute': 'value',
        'data-second-attribute': 'second-value'
      }
    })

    const $component = $('.govuk-c-checkboxes')

    expect($component.attr('data-attribute')).toEqual('value')
    expect($component.attr('data-second-attribute')).toEqual('second-value')
  })

  describe('items', () => {
    it('render a matching label and input using name by default', () => {
      const $ = render('checkboxes', {
        name: 'example-name',
        items: [
          {
            value: '1',
            text: 'Option 1'
          },
          {
            value: '2',
            text: 'Option 2'
          }
        ]
      })

      const $component = $('.govuk-c-checkboxes')

      const $firstInput = $component.find('.govuk-c-checkboxes__item:first-child input')
      const $firstLabel = $component.find('.govuk-c-checkboxes__item:first-child label')
      expect($firstInput.attr('id')).toEqual('example-name-1')
      expect($firstLabel.attr('for')).toEqual('example-name-1')

      const $lastInput = $component.find('.govuk-c-checkboxes__item:last-child input')
      const $lastLabel = $component.find('.govuk-c-checkboxes__item:last-child label')
      expect($lastInput.attr('id')).toEqual('example-name-2')
      expect($lastLabel.attr('for')).toEqual('example-name-2')
    })

    it('render a matching label and input using custom idPrefix', () => {
      const $ = render('checkboxes', {
        idPrefix: 'custom',
        name: 'example-name',
        items: [
          {
            value: '1',
            text: 'Option 1'
          },
          {
            value: '2',
            text: 'Option 2'
          }
        ]
      })

      const $component = $('.govuk-c-checkboxes')

      const $firstInput = $component.find('.govuk-c-checkboxes__item:first-child input')
      const $firstLabel = $component.find('.govuk-c-checkboxes__item:first-child label')
      expect($firstInput.attr('id')).toEqual('custom-1')
      expect($firstLabel.attr('for')).toEqual('custom-1')

      const $lastInput = $component.find('.govuk-c-checkboxes__item:last-child input')
      const $lastLabel = $component.find('.govuk-c-checkboxes__item:last-child label')
      expect($lastInput.attr('id')).toEqual('custom-2')
      expect($lastLabel.attr('for')).toEqual('custom-2')
    })

    it('render disabled', () => {
      const $ = render('checkboxes', {
        name: 'example-name',
        items: [
          {
            value: '1',
            text: 'Option 1',
            disabled: true
          },
          {
            value: '2',
            text: 'Option 2'
          }
        ]
      })

      const $component = $('.govuk-c-checkboxes')

      const $firstInput = $component.find('.govuk-c-checkboxes__item:first-child input')
      expect($firstInput.attr('disabled')).toEqual('disabled')
    })

    it('render checked', () => {
      const $ = render('checkboxes', {
        name: 'example-name',
        items: [
          {
            value: '1',
            text: 'Option 1'
          },
          {
            value: '2',
            text: 'Option 2',
            checked: true
          },
          {
            value: '3',
            text: 'Option 3',
            checked: true
          }
        ]
      })

      const $component = $('.govuk-c-checkboxes')
      const $secondInput = $component.find('.govuk-c-checkboxes__item:nth-child(2) input')
      const $lastInput = $component.find('.govuk-c-checkboxes__item:last-child input')
      expect($secondInput.attr('checked')).toEqual('checked')
      expect($lastInput.attr('checked')).toEqual('checked')
    })
  })

  describe('nested dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('checkboxes', examples['with-extreme-fieldset'])

      const $component = $('.govuk-o-form-group > .govuk-c-fieldset > .govuk-c-checkboxes')
      expect($component.length).toBeTruthy()
    })

    it('passes through label params without breaking', () => {
      const $ = render('checkboxes', {
        name: 'example-name',
        items: [
          {
            value: '1',
            html: '<b>Option 1</b>',
            label: {
              attributes: {
                'data-attribute': 'value',
                'data-second-attribute': 'second-value'
              }
            }
          },
          {
            value: '2',
            text: '<b>Option 2</b>',
            checked: true
          }
        ]
      })

      expect(htmlWithClassName($, '.govuk-c-checkboxes__label')).toMatchSnapshot()
    })

    it('passes through fieldset params without breaking', () => {
      const $ = render('checkboxes', examples['with-extreme-fieldset'])

      expect(htmlWithClassName($, '.govuk-c-error-message')).toMatchSnapshot()
      expect(htmlWithClassName($, '.govuk-c-fieldset')).toMatchSnapshot()
    })

    it('passes through html fieldset params without breaking', () => {
      const $ = render('checkboxes', {
        name: 'example-name',
        items: [
          {
            value: 'british',
            text: 'British'
          },
          {
            value: 'irish',
            text: 'Irish'
          }
        ],
        fieldset: {
          legendText: 'What is your <b>nationality</b>?',
          legendHintHtml: 'If you have dual nationality, <b>select all options</b> that are relevant to you.'
        }
      })

      expect(htmlWithClassName($, '.govuk-c-fieldset')).toMatchSnapshot()
    })
  })
})
