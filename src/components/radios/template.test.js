/* eslint-env jest */

const { axe } = require('jest-axe')

const { render, renderMacro, getExamples, htmlWithClassName } = require('../../../lib/jest-helpers')

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

    it('render conditional', () => {
      const $ = render('radios', {
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

      const $component = $('.govuk-radios')
      const $lastInput = $component.find('.govuk-radios__input').last()
      expect($lastInput.attr('data-aria-controls')).toBe('conditional-example-conditional-2')
      const $lastConditional = $component.find('.govuk-radios__conditional').last()
      expect($lastConditional.attr('id')).toBe('conditional-example-conditional-2')
      expect($lastConditional.html()).toContain('Conditional content')
      const $stringConditional = $component.find('.govuk-radios__conditional').first()
      expect($stringConditional.attr('id')).toBe('conditional-example-conditional-1')
      expect($stringConditional.html()).toContain('<b>Conditional content</b>')
    })
  })

  describe('when they include a hint', () => {
    it('renders the hint', () => {
      const $ = render('radios', examples['with-extreme-fieldset'])

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot()
    })

    it('associates the fieldset as "described by" the hint', () => {
      const $ = render('radios', examples['with-extreme-fieldset'])

      const $fieldset = $('.govuk-fieldset')
      const $hint = $('.govuk-hint')

      const hintId = new RegExp(
        WORD_BOUNDARY + $hint.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby')).toMatch(hintId)
    })
  })

  describe('when they include an error message', () => {
    it('renders the error message', () => {
      const $ = render('radios', examples['with-extreme-fieldset'])
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
      const $ = render('radios', examples['with-extreme-fieldset'])

      const $fieldset = $('.govuk-fieldset')
      const $errorMessage = $('.govuk-error-message')

      const errorMessageId = new RegExp(
        WORD_BOUNDARY + $errorMessage.attr('id') + WORD_BOUNDARY
      )

      expect($fieldset.attr('aria-describedby'))
        .toMatch(errorMessageId)
    })
  })

  describe('when they include both a hint and an error message', () => {
    it('associates the fieldset as described by both the hint and the error message', () => {
      const $ = render('radios', examples['with-extreme-fieldset'])

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
      const $ = render('radios', examples['with-extreme-fieldset'])

      const $component = $('.govuk-form-group > .govuk-fieldset > .govuk-radios')
      expect($component.length).toBeTruthy()
    })

    it('passes through label params without breaking', () => {
      const $ = render('radios', {
        name: 'example-name',
        items: [
          {
            value: 'yes',
            text: '<b>Yes</b>',
            safe: true,
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
      const $ = render('radios', examples['with-extreme-fieldset'])

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
            text: 'Have <b>you</b> changed your name?',
            safe: true
          }
        }
      })

      expect(htmlWithClassName($, '.govuk-fieldset')).toMatchSnapshot()
    })
  })

  describe('with keyword arguments', () => {
    it('allows radios params to be passed as keyword arguments', () => {
      const $ = renderMacro('radios', null, {
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

      const $component = $('.govuk-radios')
      expect($component.attr('data-test')).toEqual('attribute')
      expect($component.attr('class')).toContain('extraClasses')
      // expect($component.attr('class')).toContain('govuk-radios--error')

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
      const $ = renderMacro('radios', {
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
      const $ = renderMacro('radios', {
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
      const $ = renderMacro('radios', {
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
      const $ = renderMacro('radios', {
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
      const $ = renderMacro('radios', {
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
      const $ = renderMacro('radios', {
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
      const $ = renderMacro('radios', {
        text: 'params text',
        classes: 'paramsClass'
      }, {
        classes: 'keywordClass'
      })
      const $component = $('.govuk-radios')
      expect($component.attr('class')).toContain('keywordClass')
    })

    it('uses attributes keyword argument before before params.attributes', () => {
      const $ = renderMacro('radios', {
        text: 'params text',
        attributes: {
          'data-test': 'paramsAttribute'
        }
      }, {
        attributes: {
          'data-test': 'keywordAttribute'
        }
      })
      const $component = $('.govuk-radios')
      expect($component.attr('data-test')).toEqual('keywordAttribute')
    })
  })

  describe('when using deprecated features', () => {
    it('warns when using params.items[]html', () => {
      const $ = renderMacro('radios', {
        items: [{
          html: '<b>params text</b>'
        }]
      })

      expect($.html()).toContain('<strong class="deprecated">params.items[]html is deprecated in govukRadios</strong>')
    })
  })
})
