/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../../lib/axe-helper')

const { render, getExamples, htmlWithClassName } = require('../../../../lib/jest-helpers')

const examples = getExamples('radios')

const WORD_BOUNDARY = '\\b'
const WHITESPACE = '\\s'

describe('Radios', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('radios', examples.default)

    const results = await axe($.html())
    expect(results).toHaveNoViolations()
  })

  it('render example with minimum required name and items', () => {
    const $ = render('radios', {
      name: 'example-name',
      items: [
        {
          value: 'yes',
          text: 'Yes'
        },
        {
          value: 'no',
          text: 'No'
        }
      ]
    })

    const $component = $('.govuk-radios')

    const $firstInput = $component.find('.govuk-radios__item:first-child input')
    const $firstLabel = $component.find('.govuk-radios__item:first-child label')
    expect($firstInput.attr('name')).toEqual('example-name')
    expect($firstInput.val()).toEqual('yes')
    expect($firstLabel.text()).toContain('Yes')

    const $lastInput = $component.find('.govuk-radios__item:last-child input')
    const $lastLabel = $component.find('.govuk-radios__item:last-child label')
    expect($lastInput.attr('name')).toEqual('example-name')
    expect($lastInput.val()).toEqual('no')
    expect($lastLabel.text()).toContain('No')
  })

  it('render classes', () => {
    const $ = render('radios', {
      name: 'example-name',
      items: [
        {
          value: 'yes',
          text: 'Yes'
        },
        {
          value: 'no',
          text: 'No'
        }
      ],
      classes: 'app-radios--custom-modifier'
    })

    const $component = $('.govuk-radios')

    expect($component.hasClass('app-radios--custom-modifier')).toBeTruthy()
  })

  it('renders initial aria-describedby on fieldset', () => {
    const describedById = 'some-id'

    const $ = render('radios', {
      name: 'example-name',
      fieldset: {
        describedBy: describedById
      },
      items: [
        {
          value: 'yes',
          text: 'Yes'
        },
        {
          value: 'no',
          text: 'No'
        }
      ]
    })

    const $fieldset = $('.govuk-fieldset')
    expect($fieldset.attr('aria-describedby')).toMatch(describedById)
  })

  it('render attributes', () => {
    const $ = render('radios', {
      name: 'example-name',
      items: [
        {
          value: 'yes',
          text: 'Yes'
        },
        {
          value: 'no',
          text: 'No'
        }
      ],
      attributes: {
        'data-attribute': 'value',
        'data-second-attribute': 'second-value'
      }
    })

    const $component = $('.govuk-radios')

    expect($component.attr('data-attribute')).toEqual('value')
    expect($component.attr('data-second-attribute')).toEqual('second-value')
  })

  it('render a custom class on the form group', () => {
    const $ = render('radios', {
      name: 'example-name',
      items: [
        {
          value: 'yes',
          text: 'Yes'
        },
        {
          value: 'no',
          text: 'No'
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
      const $ = render('radios', {
        name: 'example-name',
        items: [
          {
            value: 'yes',
            text: 'Yes'
          },
          {
            value: 'no',
            text: 'No'
          }
        ]
      })

      const $component = $('.govuk-radios')

      const $firstInput = $component.find('.govuk-radios__item:first-child input')
      const $firstLabel = $component.find('.govuk-radios__item:first-child label')
      expect($firstInput.attr('id')).toEqual('example-name-1')
      expect($firstLabel.attr('for')).toEqual('example-name-1')

      const $lastInput = $component.find('.govuk-radios__item:last-child input')
      const $lastLabel = $component.find('.govuk-radios__item:last-child label')
      expect($lastInput.attr('id')).toEqual('example-name-2')
      expect($lastLabel.attr('for')).toEqual('example-name-2')
    })

    it('render a matching label and input using custom idPrefix', () => {
      const $ = render('radios', {
        idPrefix: 'custom',
        name: 'example-name',
        items: [
          {
            value: 'yes',
            text: 'Yes'
          },
          {
            value: 'no',
            text: 'No'
          }
        ]
      })

      const $component = $('.govuk-radios')

      const $firstInput = $component.find('.govuk-radios__item:first-child input')
      const $firstLabel = $component.find('.govuk-radios__item:first-child label')
      expect($firstInput.attr('id')).toEqual('custom-1')
      expect($firstLabel.attr('for')).toEqual('custom-1')

      const $lastInput = $component.find('.govuk-radios__item:last-child input')
      const $lastLabel = $component.find('.govuk-radios__item:last-child label')
      expect($lastInput.attr('id')).toEqual('custom-2')
      expect($lastLabel.attr('for')).toEqual('custom-2')
    })

    it('render disabled', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [
          {
            value: 'yes',
            text: 'Yes',
            disabled: true
          },
          {
            value: 'no',
            text: 'No',
            disabled: true
          }
        ]
      })

      const $component = $('.govuk-radios')

      const $firstInput = $component.find('.govuk-radios__item:first-child input')
      expect($firstInput.attr('disabled')).toEqual('disabled')

      const $lastInput = $component.find('.govuk-radios__item:last-child input')
      expect($lastInput.attr('disabled')).toEqual('disabled')
    })

    it('render checked', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [
          {
            value: 'yes',
            text: 'Yes'
          },
          {
            value: 'no',
            text: 'No',
            checked: true
          }
        ]
      })

      const $component = $('.govuk-radios')
      const $lastInput = $component.find('.govuk-radios__item:last-child input')
      expect($lastInput.attr('checked')).toEqual('checked')
    })

    describe('when they include attributes', () => {
      it('it renders the attributes', () => {
        const $ = render('radios', {
          name: 'example-name',
          items: [
            {
              value: 'yes',
              text: 'Yes',
              attributes: {
                'data-attribute': 'ABC',
                'data-second-attribute': 'DEF'
              }
            },
            {
              value: 'no',
              text: 'No',
              checked: true,
              attributes: {
                'data-attribute': 'GHI',
                'data-second-attribute': 'JKL'
              }
            }
          ]
        })

        const $component = $('.govuk-radios')

        const $firstInput = $component.find('.govuk-radios__item:first-child input')
        expect($firstInput.attr('data-attribute')).toEqual('ABC')
        expect($firstInput.attr('data-second-attribute')).toEqual('DEF')

        const $lastInput = $component.find('.govuk-radios__item:last-child input')
        expect($lastInput.attr('data-attribute')).toEqual('GHI')
        expect($lastInput.attr('data-second-attribute')).toEqual('JKL')
      })
    })

    describe('when they include a hint', () => {
      it('it renders the hint text', () => {
        const $ = render('radios', {
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
        expect($('.govuk-radios__hint').text()).toContain('This is a hint')
      })

      it('it renders the correct id attribute for the hint', () => {
        const $ = render('radios', {
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

        expect($('.govuk-radios__hint').attr('id')).toBe('item-id-item-hint')
      })

      it('the input describedBy attribute matches the item hint id', () => {
        const $ = render('radios', {
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

        expect($('.govuk-radios__input').attr('aria-describedby')).toBe('item-id-item-hint')
      })
    })

    describe('render conditionals', () => {
      it('hidden by default when not checked', () => {
        const $ = render('radios', {
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

        const $component = $('.govuk-radios')

        const $firstConditional = $component.find('.govuk-radios__conditional').first()
        expect($firstConditional.html()).toContain('Conditional content that should be hidden')
        expect($firstConditional.hasClass('govuk-radios__conditional--hidden')).toBeTruthy()
      })
      it('visible by default when checked', () => {
        const $ = render('radios', {
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

        const $component = $('.govuk-radios')

        const $firstConditional = $component.find('.govuk-radios__conditional').first()
        expect($firstConditional.html()).toContain('Conditional content that should be visible')
        expect($firstConditional.hasClass('govuk-radios__conditional--hidden')).toBeFalsy()
      })
      it('with association to the input they are controlled by', () => {
        const $ = render('radios', {
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

        const $component = $('.govuk-radios')

        const $firstInput = $component.find('.govuk-radios__input').first()
        const $firstConditional = $component.find('.govuk-radios__conditional').first()

        expect($firstInput.attr('data-aria-controls')).toBe('conditional-example-conditional-1')
        expect($firstConditional.attr('id')).toBe('conditional-example-conditional-1')
      })
    })

    it('render divider', () => {
      const $ = render('radios', {
        name: 'example-divider',
        items: [
          {
            value: 'yes',
            text: 'Yes'
          },
          {
            value: 'no',
            text: 'No'
          },
          {
            divider: 'or'
          },
          {
            value: 'maybe',
            text: 'Maybe'
          }
        ]
      })

      const $component = $('.govuk-radios')
      const $divider = $component.find('.govuk-radios__divider')
      expect($divider.text()).toBe('or')
    })

    it('render additional label classes', () => {
      const $ = render('radios', {
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

      const $component = $('.govuk-radios')
      const $label = $component.find('.govuk-radios__item label')
      expect($label.hasClass('bold')).toBeTruthy()
    })

    it('renders with a form group wrapper', () => {
      const $ = render('radios', {})

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.length).toBeTruthy()
    })
  })

  describe('when they include a hint', () => {
    it('renders the hint', () => {
      const $ = render('radios', examples['with all fieldset attributes'])

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the fieldset as "described by" the hint', () => {
      const $ = render('radios', examples['with all fieldset attributes'])

      const $fieldset = $('.govuk-fieldset')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby')).toMatch(hintId)
    })

    it('associates the fieldset as "described by" the hint and parent fieldset', () => {
      const describedById = 'some-id'
      const params = examples['with all fieldset attributes']

      params.fieldset.describedBy = describedById

      const $ = render('radios', params)
      const $fieldset = $('.govuk-fieldset')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + describedById + WHITESPACE + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby')).toMatch(hintId)
      delete params.fieldset.describedBy
    })
  })

  describe('when they include an error message', () => {
    it('renders the error message', () => {
      const $ = render('radios', examples['with all fieldset attributes'])
      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot()
    })

    it('uses the idPrefix for the error message id if provided', () => {
      const $ = render('radios', {
        name: 'name-of-radios',
        errorMessage: {
          text: 'Have you changed your name?'
        },
        idPrefix: 'id-prefix',
        items: [
          {
            value: 'yes',
            text: 'Yes'
          }
        ]
      })

      const $errorMessage = $('.govuk-error-message')

      expect($errorMessage.attr('id')).toEqual('id-prefix-error')
    })

    it('falls back to using the name for the error message id', () => {
      const $ = render('radios', {
        name: 'name-of-radios',
        errorMessage: {
          text: 'Have you changed your name?'
        },
        items: [
          {
            value: 'yes',
            text: 'Yes'
          }
        ]
      })

      const $errorMessage = $('.govuk-error-message')

      expect($errorMessage.attr('id')).toEqual('name-of-radios-error')
    })

    it('associates the fieldset as "described by" the error message', () => {
      const $ = render('radios', examples['with fieldset and error message'])

      const $fieldset = $('.govuk-fieldset')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })

    it('associates the fieldset as "described by" the error message and parent fieldset', () => {
      const describedById = 'some-id'
      const params = examples['with fieldset and error message']

      params.fieldset.describedBy = describedById

      const $ = render('radios', params)

      const $fieldset = $('.govuk-fieldset')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + describedById + WHITESPACE + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(errorMessageId)

      delete params.fieldset.describedBy
    })

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('radios', {
        errorMessage: {
          text: 'Error message'
        }
      })

      const $formGroup = $('.govuk-form-group')
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy()
    })
  })

  describe('when they include both a hint and an error message', () => {
    it('associates the fieldset as described by both the hint and the error message', () => {
      const $ = render('radios', examples['with all fieldset attributes'])

      const $fieldset = $('.govuk-fieldset')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const combinedIds = new RegExp(
        WORD_BOUNDARY + hintId + WHITESPACE + errorMessageId + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(combinedIds)
    })

    it('associates the fieldset as described by the hint, error message and parent fieldset', () => {
      const describedById = 'some-id'
      const params = examples['with all fieldset attributes']

      params.fieldset.describedBy = describedById

      const $ = render('radios', params)

      const $fieldset = $('.govuk-fieldset')
      const errorMessageId = $('.govuk-error-message').attr('id')
      const hintId = $('.govuk-hint').attr('id')

      const combinedIds = new RegExp(
        WORD_BOUNDARY + describedById + WHITESPACE + hintId + WHITESPACE + errorMessageId + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(combinedIds)

      delete params.fieldset.describedBy
    })
  })

  describe('nested dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('radios', examples['with all fieldset attributes'])

      const $component = $('.govuk-form-group > .govuk-fieldset > .govuk-radios')
      expect($component.length).toBeTruthy()
    })

    it('passes through label params without breaking', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [
          {
            value: 'yes',
            html: '<b>Yes</b>',
            label: {
              attributes: {
                'data-attribute': 'value',
                'data-second-attribute': 'second-value'
              }
            }
          },
          {
            value: 'no',
            text: '<b>No</b>',
            checked: true
          }
        ]
      })

      expect(htmlWithClassName($, '.govuk-radios__label')).toMatchSnapshot()
    })

    it('passes through fieldset params without breaking', () => {
      const $ = render('radios', examples['with all fieldset attributes'])

      expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
    })

    it('passes through html fieldset params without breaking', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [
          {
            value: 'yes',
            text: 'Yes'
          },
          {
            value: 'no',
            text: 'No'
          }
        ],
        fieldset: {
          legend: {
            html: 'Have <b>you</b> changed your name?'
          }
        }
      })

      expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
    })
  })
})
