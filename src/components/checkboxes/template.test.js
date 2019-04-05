/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

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

  it('renders with a form group wrapper', () => {
    const $ = render('checkboxes', {})

    const $formGroup = $('.govuk-form-group')
    expect($formGroup.length).toBeTruthy()
  })

  it('render a custom class on the form group', () => {
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
      formGroup: {
        classes: 'custom-group-class'
      }
    })

    const $formGroup = $('.govuk-form-group')
    expect($formGroup.hasClass('custom-group-class')).toBeTruthy()
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

    describe('when they include attributes', () => {
      it('it renders the attributes', () => {
        const $ = render('checkboxes', {
          name: 'example-name',
          items: [
            {
              value: '1',
              text: 'Option 1',
              attributes: {
                'data-attribute': 'ABC',
                'data-second-attribute': 'DEF'
              }
            },
            {
              value: '2',
              text: 'Option 2',
              attributes: {
                'data-attribute': 'GHI',
                'data-second-attribute': 'JKL'
              }
            }
          ]
        })

        const $component = $('.govuk-checkboxes')

        const $firstInput = $component.find('.govuk-checkboxes__item:first-child input')
        expect($firstInput.attr('data-attribute')).toEqual('ABC')
        expect($firstInput.attr('data-second-attribute')).toEqual('DEF')

        const $lastInput = $component.find('.govuk-checkboxes__item:last-child input')
        expect($lastInput.attr('data-attribute')).toEqual('GHI')
        expect($lastInput.attr('data-second-attribute')).toEqual('JKL')
      })
    })
  })

  describe('when they include a hint', () => {
    it('it renders the hint text', () => {
      const $ = render('checkboxes', {
        name: 'gov',
        items: [
          {
            value: 'value',
            text: 'This is text',
            hint: {
              text: 'This is a hint'
            }
          }
        ]
      })
      expect($('.govuk-checkboxes__hint').text()).toContain('This is a hint')
    })

    it('it renders the correct id attribute for the hint', () => {
      const $ = render('checkboxes', {
        name: 'gov',
        items: [
          {
            value: 'value',
            text: 'This is text',
            id: 'item-id',
            hint: {
              text: 'This is a hint'
            }
          }
        ]
      })

      expect($('.govuk-checkboxes__hint').attr('id')).toBe('item-id-item-hint')
    })

    it('the input describedBy attribute matches the item hint id', () => {
      const $ = render('checkboxes', {
        name: 'gov',
        items: [
          {
            value: 'value',
            text: 'This is text',
            id: 'item-id',
            hint: {
              text: 'This is a hint'
            }
          }
        ]
      })

      expect($('.govuk-checkboxes__input').attr('aria-describedby')).toBe('item-id-item-hint')
    })
  })

  describe('render conditionals', () => {
    it('hidden by default when not checked', () => {
      const $ = render('checkboxes', {
        name: 'example-conditional',
        items: [
          {
            value: 'yes',
            text: 'Yes',
            conditional: {
              html: 'Conditional content that should be hidden'
            }
          },
          {
            value: 'no',
            text: 'No'
          }
        ]
      })

      const $component = $('.govuk-checkboxes')

      const $firstConditional = $component.find('.govuk-checkboxes__conditional').first()
      expect($firstConditional.html()).toContain('Conditional content that should be hidden')
      expect($firstConditional.hasClass('govuk-checkboxes__conditional--hidden')).toBeTruthy()
    })
    it('visible by default when checked', () => {
      const $ = render('checkboxes', {
        name: 'example-conditional',
        items: [
          {
            value: 'yes',
            text: 'Yes',
            checked: true,
            conditional: {
              html: 'Conditional content that should be visible'
            }
          },
          {
            value: 'no',
            text: 'No'
          }
        ]
      })

      const $component = $('.govuk-checkboxes')

      const $firstConditional = $component.find('.govuk-checkboxes__conditional').first()
      expect($firstConditional.html()).toContain('Conditional content that should be visible')
      expect($firstConditional.hasClass('govuk-checkboxes__conditional--hidden')).toBeFalsy()
    })
    it('with association to the input they are controlled by', () => {
      const $ = render('checkboxes', {
        name: 'example-conditional',
        items: [
          {
            value: 'yes',
            text: 'Yes',
            conditional: {
              html: 'Conditional content that should be hidden'
            }
          },
          {
            value: 'no',
            text: 'No'
          }
        ]
      })

      const $component = $('.govuk-checkboxes')

      const $firstInput = $component.find('.govuk-checkboxes__input').first()
      const $firstConditional = $component.find('.govuk-checkboxes__conditional').first()

      expect($firstInput.attr('data-aria-controls')).toBe('conditional-example-conditional-1')
      expect($firstConditional.attr('id')).toBe('conditional-example-conditional-1')
    })
  })

  it('render additional label classes', () => {
    const $ = render('checkboxes', {
      name: 'example-label-classes',
      items: [
        {
          value: 'yes',
          text: 'Yes',
          label: {
            classes: 'bold'
          }
        }
      ]
    })

    const $component = $('.govuk-checkboxes')
    const $label = $component.find('.govuk-checkboxes__item label')
    expect($label.hasClass('bold')).toBeTruthy()
  })

  describe('when they include an error message', () => {
    it('renders the error message', () => {
      const $ = render('checkboxes', examples['with all fieldset attributes'])

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
      const $ = render('checkboxes', examples['with all fieldset attributes'])

      const $fieldset = $('.govuk-fieldset')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('does not associate each input as "described by" the error message', () => {
      const $ = render('checkboxes', examples['with error message and hints on items'])

      const $inputs = $('input')

      $inputs.each((i, input) => {
        expect($(input).attr('aria-describedby'))
          .toEqual(`waste-${(i + 1)}-item-hint`)
      })
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('checkboxes', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when they include a hint', () => {
    it('renders the hint', () => {
      const $ = render('checkboxes', examples['with all fieldset attributes'])

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the fieldset as "described by" the hint', () => {
      const $ = render('checkboxes', examples['with all fieldset attributes'])

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
      const $ = render('checkboxes', examples['with all fieldset attributes'])

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
      const $ = render('checkboxes', examples['with all fieldset attributes'])

      const $component = $('.govuk-form-group > .govuk-fieldset > .govuk-checkboxes')
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

      expect(htmlWithClassName($, '.govuk-checkboxes__label')).toMatchSnapshot()
    })

    it('passes through fieldset params without breaking', () => {
      const $ = render('checkboxes', examples['with all fieldset attributes'])

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
            html: 'What is your <b>nationality</b>?'
          }
        }
      })

      expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
    })
  })

  describe('single checkbox without a fieldset', () => {
    it('adds aria-describe to input if there is an error', () => {
      const $ = render('checkboxes', examples["with single option set 'aria-describedby' on input"])
      const $input = $('input')
      expect($input.attr('aria-describedby')).toMatch('t-and-c-error')
    })
  })
})
