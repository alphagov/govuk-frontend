/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      id: 'select-1',
      name: 'select-1',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2',
          selected: true
        },
        {
          value: 3,
          text: 'GOV.UK frontend option 3',
          disabled: true
        }
      ]
    }
  },
  {
    name: 'with no items',
    options: {
      id: 'select-1',
      name: 'select-1',
      label: {
        text: 'Horse with no name'
      },
      items: []
    }
  },
  {
    name: 'with selected value',
    options: {
      id: 'select-1',
      name: 'select-1',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2'
        },
        {
          value: 3,
          text: 'GOV.UK frontend option 3',
          disabled: true
        }
      ],
      value: 2
    }
  },
  {
    name: 'with hint text and error message',
    options: {
      id: 'select-2',
      name: 'select-2',
      label: {
        text: 'Label text goes here'
      },
      hint: {
        text: 'Hint text goes here'
      },
      errorMessage: {
        text: 'Error message goes here'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2'
        },
        {
          value: 3,
          text: 'GOV.UK frontend option 3'
        }
      ]
    }
  },
  {
    name: 'with label as page heading',
    options: {
      id: 'select-3',
      name: 'select-3',
      label: {
        text: 'Label text goes here',
        classes: 'govuk-label--l',
        isPageHeading: true
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2',
          selected: true
        },
        {
          value: 3,
          text: 'GOV.UK frontend option 3',
          disabled: true
        }
      ]
    }
  },
  {
    name: 'with full width override',
    options: {
      id: 'select-1',
      name: 'select-1',
      classes: 'govuk-!-width-full',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2',
          selected: true
        },
        {
          value: 3,
          text: 'GOV.UK frontend option 3',
          disabled: true
        }
      ]
    }
  },
  {
    name: 'with optional form-group classes',
    options: {
      id: 'select-1',
      name: 'select-1',
      classes: 'govuk-!-width-full',
      label: {
        text: 'Label text goes here'
      },
      formGroup: {
        classes: 'extra-class'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2',
          selected: true
        },
        {
          value: 3,
          text: 'GOV.UK frontend option 3',
          disabled: true
        }
      ]
    }
  },
  {
    name: 'with describedBy',
    hidden: true,
    options: {
      id: 'with-describedby',
      name: 'with-describedby',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2'
        }
      ],
      describedBy: 'test-target-element'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      id: 'with-attributes',
      name: 'with-attributes',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2'
        }
      ],
      attributes: {
        'data-attribute': 'my data value'
      }
    }
  },
  {
    name: 'attributes on items',
    hidden: true,
    options: {
      id: 'with-item-attributes',
      name: 'with-item-attributes',
      label: {
        text: 'Label text goes here'
      },
      value: 2,
      items: [
        {
          text: 'Option 1',
          value: 1,
          attributes: {
            'data-attribute': 'ABC',
            'data-second-attribute': 'DEF'
          }
        },
        {
          text: 'Option 2',
          value: 2,
          attributes: {
            'data-attribute': 'GHI',
            'data-second-attribute': 'JKL'
          }
        }
      ]
    }
  },
  {
    name: 'with falsey items',
    hidden: true,
    options: {
      id: 'with-falsey-items',
      name: 'with-falsey-items',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          text: 'Option 1',
          value: 1
        },
        null,
        false,
        '',
        {
          text: 'Options 2',
          value: 2
        }
      ]
    }
  },
  {
    name: 'hint',
    hidden: true,
    options: {
      id: 'select-with-hint',
      name: 'select-with-hint',
      label: {
        text: 'Label text goes here'
      },
      hint: {
        text: 'Hint text goes here'
      }
    }
  },
  {
    name: 'hint and describedBy',
    hidden: true,
    options: {
      id: 'select-with-hint',
      name: 'select-with-hint',
      label: {
        text: 'Label text goes here'
      },
      describedBy: 'test-target-element',
      hint: {
        text: 'Hint text goes here'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2'
        }
      ]
    }
  },
  {
    name: 'error',
    hidden: true,
    options: {
      id: 'select-with-error',
      name: 'select-with-error',
      label: {
        text: 'Label text goes here'
      },
      errorMessage: {
        text: 'Error message'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2'
        }
      ]
    }
  },
  {
    name: 'error and describedBy',
    hidden: true,
    options: {
      id: 'select-with-error',
      name: 'select-with-error',
      label: {
        text: 'Label text goes here'
      },
      describedBy: 'test-target-element',
      errorMessage: {
        text: 'Error message'
      },
      items: [
        {
          value: 1,
          text: 'GOV.UK frontend option 1'
        },
        {
          value: 2,
          text: 'GOV.UK frontend option 2'
        }
      ]
    }
  },
  {
    name: 'without values',
    hidden: true,
    options: {
      name: 'colors',
      id: 'colors',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          text: 'Red'
        },
        {
          text: 'Green'
        },
        {
          text: 'Blue'
        }
      ]
    }
  },
  {
    name: 'without values with selected value',
    hidden: true,
    options: {
      name: 'colors',
      id: 'colors',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          text: 'Red'
        },
        {
          text: 'Green'
        },
        {
          text: 'Blue'
        }
      ],
      value: 'Green'
    }
  },
  {
    name: 'with falsey values',
    hidden: true,
    options: {
      name: 'falsey-values',
      id: 'falsey-values',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          text: 'Empty string',
          value: ''
        },
        {
          text: 'Boolean false',
          value: false
        },
        {
          text: 'Number zero',
          value: 0
        }
      ]
    }
  },
  {
    name: 'item selected overrides value',
    hidden: true,
    options: {
      name: 'colors',
      id: 'colors',
      label: {
        text: 'Label text goes here'
      },
      items: [
        {
          value: 'red',
          text: 'Red'
        },
        {
          value: 'green',
          text: 'Green',
          selected: false
        },
        {
          value: 'blue',
          text: 'Blue'
        }
      ],
      value: 'green'
    }
  }
]
