/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      name: 'more-detail',
      id: 'more-detail',
      label: {
        text: 'Can you provide more detail?'
      }
    }
  },
  {
    name: 'with hint',
    options: {
      name: 'more-detail',
      id: 'more-detail',
      label: {
        text: 'Can you provide more detail?'
      },
      hint: {
        text: "Don't include personal or financial information, eg your National Insurance number or credit card details."
      }
    }
  },
  {
    name: 'with error message',
    options: {
      name: 'no-ni-reason',
      id: 'no-ni-reason',
      label: {
        text: 'Why can’t you provide a National Insurance number?'
      },
      errorMessage: {
        text: 'You must provide an explanation'
      }
    }
  },
  {
    name: 'with default value',
    options: {
      id: 'full-address',
      name: 'address',
      value: '221B Baker Street\nLondon\nNW1 6XE\n',
      label: {
        text: 'Full address'
      }
    }
  },
  {
    name: 'with custom rows',
    options: {
      id: 'full-address',
      name: 'address',
      label: {
        text: 'Full address'
      },
      rows: 8
    }
  },
  {
    name: 'with label as page heading',
    options: {
      id: 'textarea-with-page-heading',
      name: 'address',
      label: {
        text: 'Full address',
        classes: 'govuk-label--l',
        isPageHeading: true
      }
    }
  },
  {
    name: 'with optional form-group classes',
    options: {
      id: 'textarea-with-page-heading',
      name: 'address',
      label: {
        text: 'Full address'
      },
      formGroup: {
        classes: 'extra-class'
      }
    }
  },
  {
    name: 'with autocomplete attribute',
    options: {
      id: 'textarea-with-autocomplete-attribute',
      name: 'address',
      label: {
        text: 'Full address'
      },
      autocomplete: 'street-address'
    }
  },
  {
    name: 'with spellcheck enabled',
    options: {
      label: {
        text: 'Spellcheck is enabled'
      },
      id: 'textarea-with-spellcheck-enabled',
      name: 'spellcheck',
      spellcheck: true
    }
  },
  {
    name: 'with spellcheck disabled',
    options: {
      label: {
        text: 'Spellcheck is disabled'
      },
      id: 'textarea-with-spellcheck-disabled',
      name: 'spellcheck',
      spellcheck: false
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      id: 'with-classes',
      name: 'with-classes',
      label: {
        text: 'With classes'
      },
      classes: 'app-textarea--custom-modifier'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      id: 'with-attributes',
      name: 'with-attributes',
      label: {
        text: 'With attributes'
      },
      attributes: {
        'data-attribute': 'my data value'
      }
    }
  },
  {
    name: 'with describedBy',
    hidden: true,
    options: {
      id: 'with-describedby',
      name: 'with-describedby',
      label: {
        text: 'With describedBy'
      },
      describedBy: 'test-target-element'
    }
  },
  {
    name: 'with hint and described by',
    hidden: true,
    options: {
      id: 'with-hint-describedby',
      name: 'with-hint-describedby',
      label: {
        text: 'With hint and describedBy'
      },
      describedBy: 'test-target-element',
      hint: {
        text: 'It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.'
      }
    }
  },
  {
    name: 'with error message and described by',
    hidden: true,
    options: {
      name: 'textarea-with-error',
      label: {
        text: 'Textarea with error'
      },
      describedBy: 'test-target-element',
      id: 'textarea-with-error',
      errorMessage: {
        text: 'Error message'
      }
    }
  },
  {
    name: 'with hint and error message',
    hidden: true,
    options: {
      id: 'with-hint-error',
      name: 'with-hint-error',
      label: {
        text: 'With hint and error'
      },
      errorMessage: {
        text: 'Error message'
      },
      hint: {
        text: 'Hint'
      }
    }
  },
  {
    name: 'with hint, error message and described by',
    hidden: true,
    options: {
      id: 'with-hint-error-describedby',
      name: 'with-hint-error-describedby',
      label: {
        text: 'With hint, error and describedBy'
      },
      describedBy: 'test-target-element',
      errorMessage: {
        text: 'Error message'
      },
      hint: {
        text: 'Hint'
      }
    }
  }
]
