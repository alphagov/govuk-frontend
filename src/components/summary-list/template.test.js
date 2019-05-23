/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('summary-list')

describe('Data list', () => {
  it('default example passes accessibility tests', async () => {
    const $ = render('summary-list', examples.default)

    const results = await axe($.html(), {
      rules: {
        // In newer versions of the HTML specification wrapper
        // <div>s are allowed in a definition list
        'dlitem': { enabled: false },
        'definition-list': { enabled: false }
      }
    })
    expect(results).toHaveNoViolations()
  })
  it('renders classes', async () => {
    const $ = render('summary-list', {
      classes: 'app-custom-class'
    })

    const $component = $('.govuk-summary-list')
    expect($component.hasClass('app-custom-class')).toBeTruthy()
  })
  it('renders with attributes', () => {
    const $ = render('summary-list', {
      attributes: {
        'data-attribute-1': 'value-1',
        'data-attribute-2': 'value-2'
      }
    })

    const $component = $('.govuk-summary-list')
    expect($component.attr('data-attribute-1')).toEqual('value-1')
    expect($component.attr('data-attribute-2')).toEqual('value-2')
  })
  describe('rows', () => {
    it('renders classes', async () => {
      const $ = render('summary-list', {
        rows: [
          {
            key: {
              text: 'Name'
            },
            classes: 'app-custom-class'
          }
        ]
      })

      const $component = $('.govuk-summary-list')
      const $row = $component.find('.govuk-summary-list__row')
      expect($row.hasClass('app-custom-class')).toBeTruthy()
    })
    describe('keys', () => {
      it('renders text', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              key: {
                text: 'Name'
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $key = $component.find('dt.govuk-summary-list__key')

        expect($key.html()).toContain('Name')
      })
      it('renders html', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              key: {
                html: '<b>Name</b>'
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $key = $component.find('dt.govuk-summary-list__key')

        expect($key.html()).toContain('<b>Name</b>')
      })
      it('renders classes', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              key: {
                classes: 'app-custom-class',
                text: 'Name'
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $key = $component.find('dt.govuk-summary-list__key')
        expect($key.hasClass('app-custom-class')).toBeTruthy()
      })
    })
    describe('values', () => {
      it('renders text', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              value: {
                text: 'Firstname Lastname'
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $value = $component.find('dd.govuk-summary-list__value')

        expect($value.html()).toContain('Firstname Lastname')
      })
      it('renders html', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              value: {
                html: '<span>email@email.com</span>'
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $value = $component.find('dd.govuk-summary-list__value')

        expect($value.html()).toContain('<span>email@email.com</span>')
      })
      it('renders classes', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              value: {
                classes: 'app-custom-class',
                text: 'Firstname Lastname'
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $value = $component.find('dd.govuk-summary-list__value')
        expect($value.hasClass('app-custom-class')).toBeTruthy()
      })
    })
    describe('actions', () => {
      it('renders href', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: 'https://www.gov.uk'
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $actionLink = $component.find('.govuk-summary-list__actions > a')

        expect($actionLink.attr('href')).toBe('https://www.gov.uk')
      })
      it('renders text', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              actions: {
                items: [
                  {
                    text: 'Edit'
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $actionLink = $component.find('.govuk-summary-list__actions > a')

        expect($actionLink.text()).toContain('Edit')
      })
      it('renders html', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              actions: {
                items: [
                  {
                    html: 'Edit<span class="visually-hidden"> name</span>'
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $actionLink = $component.find('.govuk-summary-list__actions > a')

        expect($actionLink.html()).toContain('Edit<span class="visually-hidden"> name</span>')
      })
      it('renders custom accessible name', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              key: {
                text: 'Name'
              },
              actions: {
                items: [
                  {
                    text: 'Edit',
                    visuallyHiddenText: 'Custom Accessible Name'
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $actionLink = $component.find('.govuk-summary-list__actions > a')
        expect($actionLink.text()).toContain('Edit Custom Accessible Name')
      })
      it('renders classes', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              actions: {
                classes: 'app-custom-class',
                items: [
                  {
                    text: 'Edit'
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $actionList = $component.find('.govuk-summary-list__actions')

        expect($actionList.hasClass('app-custom-class')).toBeTruthy()
      })
      it('renders attributes', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              actions: {
                items: [
                  {
                    text: 'Edit',
                    attributes: {
                      'data-test-attribute': 'value',
                      'data-test-attribute-2': 'value-2'
                    }
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $actionLink = $component.find('.govuk-summary-list__actions > a')

        expect($actionLink.attr('data-test-attribute')).toEqual('value')
        expect($actionLink.attr('data-test-attribute-2')).toEqual('value-2')
      })
      it('renders a single anchor with one action', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: '#',
                    text: 'First action'
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $action = $component.find('.govuk-summary-list__actions > a')

        expect($action.html().trim()).toBe('First action')
      })
      it('renders a list with mutliple actions', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              actions: {
                items: [
                  {
                    href: '#',
                    text: 'First action'
                  },
                  {
                    href: '#',
                    text: 'Second action'
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $actionList = $component.find('.govuk-summary-list__actions')
        const $secondAction = $actionList.find('.govuk-summary-list__actions-list-item:last-child')

        expect($secondAction.text().trim()).toBe('Second action')
      })
      it('renders classes on actions', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              actions: {
                items: [
                  {
                    text: 'Edit',
                    classes: 'govuk-link--no-visited-state'
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $action = $component.find('.govuk-summary-list__actions > a')

        expect($action.hasClass('govuk-link--no-visited-state')).toBeTruthy()
      })
      it('skips the action column when none are provided', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              key: {
                text: 'Name'
              },
              value: {
                text: 'Firstname Lastname'
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $action = $component.find('.govuk-summary-list__actions')

        expect($action.length).toEqual(0)
      })
      it('adds dummy action columns when only some rows have actions', async () => {
        const $ = render('summary-list', {
          rows: [
            {
              key: {
                text: 'Name'
              },
              value: {
                text: 'Firstname Lastname'
              }
            },
            {
              key: {
                text: 'Name'
              },
              value: {
                text: 'Firstname Lastname'
              },
              actions: {
                items: [
                  {
                    href: '#',
                    text: 'First action'
                  }
                ]
              }
            }
          ]
        })

        const $component = $('.govuk-summary-list')
        const $action = $component.find('.govuk-summary-list__actions')

        // First action column is a dummy
        expect($action[0].tagName).toEqual('span')
        expect($($action[0]).text()).toEqual('')

        // Second action column contains link text
        expect($action[1].tagName).toEqual('dd')
        expect($($action[1]).text()).toContain('First action')
      })
    })
  })
})
