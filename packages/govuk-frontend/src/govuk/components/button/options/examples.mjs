/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      text: 'Save and continue'
    }
  },
  {
    name: 'disabled',
    options: {
      text: 'Disabled button',
      disabled: true
    }
  },
  {
    name: 'link',
    options: {
      text: 'Link button',
      href: '/'
    }
  },
  {
    name: 'start',
    options: {
      text: 'Start now button',
      isStartButton: true
    }
  },
  {
    name: 'start link',
    options: {
      text: 'Start now link button',
      href: '/',
      isStartButton: true
    }
  },
  {
    name: 'input',
    options: {
      element: 'input',
      name: 'start-now',
      text: 'Start now'
    }
  },
  {
    name: 'input disabled',
    options: {
      element: 'input',
      text: 'Explicit input button disabled',
      disabled: true
    }
  },
  {
    name: 'prevent double click',
    options: {
      text: 'Submit',
      preventDoubleClick: true
    }
  },
  {
    name: 'with active state',
    description:
      'Simulate triggering the :active CSS pseudo-class, not available in the production build.',
    options: {
      name: 'active',
      text: 'Active',
      classes: ':active'
    }
  },
  {
    name: 'with hover state',
    description:
      'Simulate triggering the :hover CSS pseudo-class, not available in the production build.',
    options: {
      name: 'hover',
      text: 'Hovered',
      classes: ':hover'
    }
  },
  {
    name: 'with focus state',
    description:
      'Simulate triggering the :focus CSS pseudo-class, not available in the production build.',
    options: {
      name: 'focus',
      text: 'Focussed',
      classes: ':focus'
    }
  },
  {
    name: 'secondary',
    description: 'A button for secondary actions',
    options: {
      name: 'secondary',
      text: 'Secondary button',
      classes: 'govuk-button--secondary'
    }
  },
  {
    name: 'secondary disabled',
    options: {
      name: 'secondary',
      text: 'Secondary button disabled',
      classes: 'govuk-button--secondary',
      disabled: true
    }
  },
  {
    name: 'secondary link',
    description: 'A link button for secondary actions',
    options: {
      name: 'secondary',
      text: 'Secondary button',
      href: '/',
      classes: 'govuk-button--secondary'
    }
  },
  {
    name: 'warning',
    description: 'A button for actions that need a warning',
    options: {
      name: 'Warning',
      text: 'Warning button',
      classes: 'govuk-button--warning'
    }
  },
  {
    name: 'warning disabled',
    options: {
      name: 'warning',
      text: 'Warning button disabled',
      classes: 'govuk-button--warning',
      disabled: true
    }
  },
  {
    name: 'warning link',
    description: 'A link button for actions that need a warning',
    options: {
      name: 'Warning',
      text: 'Warning button',
      href: '/',
      classes: 'govuk-button--warning'
    }
  },
  {
    name: 'inverse',
    description: 'A button that appears on dark backgrounds',
    previewLayoutModifiers: ['inverse'],
    options: {
      name: 'Inverse',
      text: 'Inverse button',
      classes: 'govuk-button--inverse'
    }
  },
  {
    name: 'inverse disabled',
    previewLayoutModifiers: ['inverse'],
    options: {
      name: 'Inverse',
      text: 'Inverse button disabled',
      classes: 'govuk-button--inverse',
      disabled: true
    }
  },
  {
    name: 'inverse link',
    description: 'A link button for actions that appear on dark backgrounds',
    previewLayoutModifiers: ['inverse'],
    options: {
      name: 'Inverse',
      text: 'Inverse button',
      href: '/',
      classes: 'govuk-button--inverse'
    }
  },
  {
    name: 'inverse start',
    description: 'A start button that appears on dark backgrounds',
    previewLayoutModifiers: ['inverse'],
    options: {
      name: 'Inverse',
      text: 'Inverse start button',
      href: '/',
      classes: 'govuk-button--inverse',
      isStartButton: true
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      element: 'button',
      text: 'Submit',
      attributes: {
        'aria-controls': 'test-target-element',
        'data-tracking-dimension': 123
      }
    }
  },
  {
    name: 'link attributes',
    hidden: true,
    options: {
      element: 'a',
      text: 'Submit',
      attributes: {
        'aria-controls': 'test-target-element',
        'data-tracking-dimension': 123
      }
    }
  },
  {
    name: 'input attributes',
    hidden: true,
    options: {
      element: 'input',
      text: 'Submit',
      attributes: {
        'aria-controls': 'test-target-element',
        'data-tracking-dimension': 123
      }
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'button',
      classes: 'app-button--custom-modifier'
    }
  },
  {
    name: 'link classes',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'a',
      classes: 'app-button--custom-modifier'
    }
  },
  {
    name: 'input classes',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'input',
      classes: 'app-button--custom-modifier'
    }
  },
  {
    name: 'name',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'button',
      name: 'start-now'
    }
  },
  {
    name: 'type',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'button',
      type: 'button'
    }
  },
  {
    name: 'input type',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'input',
      type: 'button'
    }
  },
  {
    name: 'explicit link',
    hidden: true,
    options: {
      element: 'a',
      href: '/',
      text: 'Continue'
    }
  },
  {
    name: 'no href',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'a'
    }
  },
  {
    name: 'value',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'button',
      value: 'start'
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'button',
      html: 'Start <em>now</em>'
    }
  },
  {
    name: 'no type',
    hidden: true,
    options: {
      text: 'Button!'
    }
  },
  {
    name: 'no data-prevent-double-click',
    hidden: true,
    options: {
      text: 'Submit'
    }
  },
  {
    name: "don't prevent double click",
    hidden: true,
    options: {
      text: 'Submit',
      preventDoubleClick: false
    }
  },
  {
    name: 'id',
    hidden: true,
    options: {
      text: 'Submit',
      element: 'input',
      id: 'submit'
    }
  }
]
