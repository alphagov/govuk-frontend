/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

const examples = getExamples('checkboxes')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

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

    const $component = $('.govuk-checkboxes')

    const $firstInput = $component.find('.govuk-checkboxes__item:first-child input')
    const $firstLabel = $component.find('.govuk-checkboxes__item:first-child label')
    expect($firstInput.attr('name')).toEqual('example-name')
    expect($firstInput.val()).toEqual('1')
    expect($firstLabel.text()).toContain('Option 1')

    const $lastInput = $component.find('.govuk-checkboxes__item:last-child input')
    const $lastLabel = $component.find('.govuk-checkboxes__item:last-child label')
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
      classes: 'app-checkboxes--custom-modifier'
    })

    const $component = $('.govuk-checkboxes')

    expect($component.hasClass('app-checkboxes--custom-modifier')).toBeTruthy()
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

    const $component = $('.govuk-checkboxes')

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

      const $component = $('.govuk-checkboxes')

      const $firstInput = $component.find('.govuk-checkboxes__item:first-child input')
      const $firstLabel = $component.find('.govuk-checkboxes__item:first-child label')
      expect($firstInput.attr('id')).toEqual('example-name-1')
      expect($firstLabel.attr('for')).toEqual('example-name-1')

      const $lastInput = $component.find('.govuk-checkboxes__item:last-child input')
      const $lastLabel = $component.find('.govuk-checkboxes__item:last-child label')
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

      const $component = $('.govuk-checkboxes')

      const $firstInput = $component.find('.govuk-checkboxes__item:first-child input')
      const $firstLabel = $component.find('.govuk-checkboxes__item:first-child label')
      expect($firstInput.attr('id')).toEqual('custom-1')
      expect($firstLabel.attr('for')).toEqual('custom-1')

      const $lastInput = $component.find('.govuk-checkboxes__item:last-child input')
      const $lastLabel = $component.find('.govuk-checkboxes__item:last-child label')
      expect($lastInput.attr('id')).toEqual('custom-2')
      expect($lastLabel.attr('for')).toEqual('custom-2')
    })

    it('render explicitly passed item ids', () => {
      const $ = render('checkboxes', {
        name: 'example-name',
        items: [
          {
            value: '1',
            text: 'Option 1'
          },
          {
            id: 'custom_item_id',
            value: '2',
            text: 'Option 2'
          }
        ]
      })

      const $component = $('.govuk-checkboxes')

      const $firstInput = $component.find('.govuk-checkboxes__item:first-child input')
      expect($firstInput.attr('id')).toBe('example-name-1')

      const $lastInput = $component.find('.govuk-checkboxes__item:last-child input')
      const $lastLabel = $component.find('.govuk-checkboxes__item:last-child label')
      expect($lastInput.attr('id')).toBe('custom_item_id')
      expect($lastLabel.attr('for')).toEqual('custom_item_id')
    })

    it('render explicitly passed item names', () => {
      const $ = render('checkboxes', {
        name: 'example-name',
        items: [
          {
            value: '1',
            text: 'Option 1',
            name: 'custom-item-name-1'
          },
          {
            value: '2',
            text: 'Option 2',
            name: 'custom-item-name-2'
          }
        ]
      })

      const $component = $('.govuk-checkboxes')

      const $firstInput = $component.find('.govuk-checkboxes__item:first-child input')
      expect($firstInput.attr('name')).toBe('custom-item-name-1')

      const $lastInput = $component.find('.govuk-checkboxes__item:last-child input')
      expect($lastInput.attr('name')).toBe('custom-item-name-2')
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

      const $component = $('.govuk-checkboxes')

      const $firstInput = $component.find('.govuk-checkboxes__item:first-child input')
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

      const $component = $('.govuk-checkboxes')
      const $secondInput = $component.find('.govuk-checkboxes__item:nth-child(2) input')
      const $lastInput = $component.find('.govuk-checkboxes__item:last-child input')
      expect($secondInput.attr('checked')).toEqual('checked')
      expect($lastInput.attr('checked')).toEqual('checked')
    })
  })

  it('render conditional', () => {
    const $ = render('checkboxes', {
      name: 'example-conditional',
      items: [
        {
          value: 'yes',
          text: 'Yes',
          conditional: '<b>Conditional content</b>'
        },
        {
          value: 'no',
          text: 'No',
          checked: true,
          conditional: {
            html: 'Conditional content'
          }
        }
      ]
    })

    const $component = $('.govuk-checkboxes')
    const $lastInput = $component.find('.govuk-checkboxes__input').last()
    expect($lastInput.attr('data-aria-controls')).toBe('conditional-example-conditional-2')
    const $lastConditional = $component.find('.govuk-checkboxes__conditional').last()
    expect($lastConditional.attr('id')).toBe('conditional-example-conditional-2')
    expect($lastConditional.html()).toContain('Conditional content')
    const $stringConditional = $component.find('.govuk-checkboxes__conditional').first()
    expect($stringConditional.attr('id')).toBe('conditional-example-conditional-1')
    expect($stringConditional.html()).toContain('<b>Conditional content</b>')
  })

  describe('when they include an error message', () => {
    it('renders the error message', () => {
      const $ = render('checkboxes', examples['with-extreme-fieldset'])

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('uses the idPrefix for the error message id if provided', () => {
      const $ = render('checkboxes', {
        name: 'name-of-checkboxes',
        errorMessage: {
          text: 'Please select an option'
        },
        idPrefix: 'id-prefix',
        items: [
          {
            value: 'animal',
            text: 'Waste from animal carcasses'
          }
        ]
      })

      const $errorMessage = $('.govuk-error-message')

      expect($errorMessage.attr('id')).toEqual('id-prefix-error')
    })

    it('falls back to using the name for the error message id', () => {
      const $ = render('checkboxes', {
        name: 'name-of-checkboxes',
        errorMessage: {
          text: 'Please select an option'
        },
        items: [
          {
            value: 'animal',
            text: 'Waste from animal carcasses'
          }
        ]
      })

      const $errorMessage = $('.govuk-error-message')

      expect($errorMessage.attr('id')).toEqual('name-of-checkboxes-error')
    })

    it('associates the fieldset as "described by" the error message', () => {
      const $ = render('checkboxes', examples['with-extreme-fieldset'])

      const $fieldset = $('.govuk-fieldset')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })
  })

  describe('when they include a hint', () => {
    it('renders the hint', () => {
      const $ = render('checkboxes', examples['with-extreme-fieldset'])

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the fieldset as "described by" the hint', () => {
      const $ = render('checkboxes', examples['with-extreme-fieldset'])

      const $fieldset = $('.govuk-fieldset')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby')).toMatch(hintId)
    })
  })

  describe('when they include both a hint and an error message', () => {
    it('associates the fieldset as described by both the hint and the error message', () => {
      const $ = render('checkboxes', examples['with-extreme-fieldset'])

      const $fieldset = $('.govuk-fieldset')
      const $errorMessageId = $('.govuk-error-message').attr('id')
      const $hintId = $('.govuk-hint').attr('id')

      const combinedIds = new RegExp(
        WORD_BOUNDARY + $hintId + WHITESPACE + $errorMessageId + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(combinedIds)
    })
  })

  describe('nested dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('checkboxes', examples['with-extreme-fieldset'])

      const $component = $('.govuk-form-group > .govuk-fieldset > .govuk-checkboxes')
      expect($component.length).toBeTruthy()
    })

    it('passes through label params without breaking', () => {
      const $ = render('checkboxes', {
        name: 'example-name',
        items: [
          {
            value: '1',
            text: '<b>Option 1</b>',
            safe: true,
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

      expect(htmlWithClassName($, '.govuk-checkboxes__label')).toMatchSnapshot()
    })

    it('passes through fieldset params without breaking', () => {
      const $ = render('checkboxes', examples['with-extreme-fieldset'])

      expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
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
          legend: {
            text: 'What is your <b>nationality</b>?',
            safe: true
          }
        }
      })

      expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
    })
  })

  describe('with keyword arguments', () => {
    it('allows checkboxes params to be passed as keyword arguments', () => {
      const $ = renderMacro('checkboxes', null, {
        idPrefix: 'idPrefix',
        name: 'optionName',
        fieldset: {
          legend: {
            text: 'legend text'
          }
        },
        hint: {
          text: 'hint text'
        },
        items: [
          {
            text: 'option text'
          }
        ],
        errorMessage: {
          text: 'error text'
        },
        classes: 'extraClasses',
        attributes: {
          'data-test': 'attribute'
        }
      })

      const $component = $('.govuk-checkboxes')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
      // expect($component.attr('class')).toContain('govuk-checkboxes--error')

      const $input = $('input')
      expect($input.length).toEqual(1)
      expect($input.attr('id')).toEqual('idPrefix-1')
      expect($input.attr('name')).toEqual('optionName')

      const $legend = $('.govuk-fieldset__legend')
      expect($legend.html()).toContain('legend text')

      const $label = $('.govuk-label')
      expect($label.html()).toContain('option text')

      const $hint = $('.govuk-hint')
      expect($hint.html()).toContain('hint text')

      const $error = $('.govuk-error-message')
      expect($error.html()).toContain('error text')

      const $group = $('.govuk-form-group')
      expect($group.attr('class')).toContain('govuk-form-group--error')
    })

    it('uses fieldset keyword argument before params.fieldset', () => {
      const $ = renderMacro('checkboxes', {
        fieldset: {
          legend: {
            text: 'params text'
          }
        }
      }, {
        fieldset: {
          legend: {
            text: 'keyword text'
          }
        }
      })

      const $legend = $('.govuk-fieldset__legend')
      expect($legend.html()).toContain('keyword text')
    })

    it('uses hint keyword argument before params.hint', () => {
      const $ = renderMacro('checkboxes', {
        hint: {
          text: 'params text'
        }
      }, {
        hint: {
          text: 'keyword text'
        }
      })

      const $hint = $('.govuk-hint')
      expect($hint.html()).toContain('keyword text')
    })

    it('uses error keyword argument before params.error', () => {
      const $ = renderMacro('checkboxes', {
        errorMessage: {
          text: 'params text'
        }
      }, {
        errorMessage: {
          text: 'keyword text'
        }
      })

      const $error = $('.govuk-error-message')
      expect($error.html()).toContain('keyword text')
    })

    it('uses idPrefix keyword argument before params.idPrefix', () => {
      const $ = renderMacro('checkboxes', {
        items: [
          {
            text: 'option text'
          }
        ],
        idPrefix: 'paramsIdPrefix'
      }, {
        idPrefix: 'keywordIdPrefix'
      })

      const $component = $('input')
      expect($component.attr('id')).toEqual('keywordIdPrefix-1')
    })

    it('uses name keyword argument before params.name', () => {
      const $ = renderMacro('checkboxes', {
        items: [
          {
            text: 'option text'
          }
        ],
        name: 'paramsName'
      }, {
        name: 'keywordName'
      })

      const $component = $('input')
      expect($component.attr('name')).toContain('keywordName')
    })

    it('uses items keyword argument before params.items', () => {
      const $ = renderMacro('checkboxes', {
        items: [
          {
            value: 'params value'
          }
        ]
      }, {
        items: [
          {
            value: 'keyword value'
          }
        ]
      })

      const $input = $('input')
      expect($input.attr('value')).toEqual('keyword value')
    })

    it('uses classes keyword argument before before params.classes', () => {
      const $ = renderMacro('checkboxes', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-checkboxes')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('checkboxes', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-checkboxes')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.items[]html', () => {
      const $ = renderMacro('checkboxes', {
        items: [{
          html: '<b>params text</b>'
        }]
      })

      expect($.html()).toContain('<strong class="deprecated">params.items[]html is deprecated in govukCheckboxes</strong>')
    })
  })
})
