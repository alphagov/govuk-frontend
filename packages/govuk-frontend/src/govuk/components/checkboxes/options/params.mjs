/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  describedBy: {
    type: 'string',
    required: false,
    description:
      'One or more element IDs to add to the input `aria-describedby` attribute without a fieldset, used to provide additional descriptive information for screenreader users.'
  },
  fieldset: {
    type: 'object',
    required: false,
    description: 'Can be used to add a fieldset to the checkboxes component.',
    isComponent: true
  },
  hint: {
    type: 'object',
    required: false,
    description: 'Can be used to add a hint to the checkboxes component.',
    isComponent: true
  },
  errorMessage: {
    type: 'object',
    required: false,
    description:
      'Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for `errorMessage`, for example `false` or `null`.',
    isComponent: true
  },
  formGroup: {
    type: 'object',
    required: false,
    description:
      'Additional options for the form group containing the checkboxes component.',
    params: {
      classes: {
        type: 'string',
        required: false,
        description:
          'Classes to add to the form group (for example to show error state for the whole group).'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the form group.'
      },
      beforeInputs: {
        type: 'object',
        required: false,
        description:
          'Content to add before all checkbox items within the checkboxes component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'Text to add before all checkbox items. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'HTML to add before all checkbox items. If `html` is provided, the `text` option will be ignored.'
          }
        }
      },
      afterInputs: {
        type: 'object',
        required: false,
        description:
          'Content to add after all checkbox items within the checkboxes component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'Text to add after all checkbox items. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'HTML to add after all checkbox items. If `html` is provided, the `text` option will be ignored.'
          }
        }
      }
    }
  },
  idPrefix: {
    type: 'string',
    required: false,
    description:
      'Optional prefix. This is used to prefix the `id` attribute for each checkbox item input, hint and error message, separated by `-`. Defaults to the `name` option value.'
  },
  name: {
    type: 'string',
    required: true,
    description: 'Name attribute for all checkbox items.'
  },
  items: {
    type: 'array',
    required: true,
    description: 'The checkbox items within the checkboxes component.',
    params: {
      text: {
        type: 'string',
        required: true,
        description:
          'If `html` is set, this is not required. Text to use within each checkbox item label. If `html` is provided, the `text` option will be ignored.'
      },
      html: {
        type: 'string',
        required: true,
        description:
          'If `text` is set, this is not required. HTML to use within each checkbox item label. If `html` is provided, the `text` option will be ignored.'
      },
      id: {
        type: 'string',
        required: false,
        description:
          'Specific ID attribute for the checkbox item. If omitted, then component global `idPrefix` option will be applied.'
      },
      name: {
        type: 'string',
        required: false,
        description:
          'Specific name for the checkbox item. If omitted, then component global `name` string will be applied.'
      },
      value: {
        type: 'string',
        required: true,
        description: 'Value for the checkbox input.'
      },
      label: {
        type: 'object',
        required: false,
        description:
          'Subset of options for the label used by each checkbox item within the checkboxes component.',
        isComponent: true,
        params: {
          classes: {
            type: 'string',
            required: false,
            description: 'Classes to add to the label tag.'
          },
          attributes: {
            type: 'object',
            required: false,
            description:
              'HTML attributes (for example data attributes) to add to the label tag.'
          }
        }
      },
      hint: {
        type: 'object',
        required: false,
        description:
          'Can be used to add a hint to each checkbox item within the checkboxes component.',
        isComponent: true
      },
      divider: {
        type: 'string',
        required: false,
        description:
          'Divider text to separate checkbox items, for example the text `"or"`.'
      },
      checked: {
        type: 'boolean',
        required: false,
        description:
          'Whether the checkbox should be checked when the page loads. Takes precedence over the top-level `values` option.'
      },
      conditional: {
        type: 'object',
        required: false,
        description:
          'Provide additional content to reveal when the checkbox is checked.',
        params: {
          html: {
            type: 'string',
            description: 'The HTML to reveal when the checkbox is checked.',
            required: true
          }
        }
      },
      behaviour: {
        type: 'string',
        required: false,
        description:
          'If set to `"exclusive"`, implements a \'None of these\' type behaviour via JavaScript when checkboxes are clicked.'
      },
      disabled: {
        type: 'boolean',
        required: false,
        description: 'If `true`, checkbox will be disabled.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the checkbox input tag.'
      }
    }
  },
  values: {
    type: 'array',
    required: false,
    description:
      'Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the `checked` option on each individual item.'
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the checkboxes container.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the anchor tag.'
  }
}
