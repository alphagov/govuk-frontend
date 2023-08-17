/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  fieldset: {
    type: 'object',
    required: false,
    description: 'The fieldset used by the radios component.',
    isComponent: true
  },
  hint: {
    type: 'object',
    required: false,
    description: 'Can be used to add a hint to the radios component.',
    isComponent: true
  },
  errorMessage: {
    type: 'object',
    required: false,
    description:
      'Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for `errorMessage`, for example `false` or `null`.',
    isComponent: true
  },
  formGroup: {
    type: 'object',
    required: false,
    description:
      'Additional options for the form group containing the radios component.',
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
          'Content to add before all radio items within the checkboxes component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'Text to add before all radio items. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'HTML to add before all radio items. If `html` is provided, the `text` option will be ignored.'
          }
        }
      },
      afterInputs: {
        type: 'object',
        required: false,
        description:
          'Content to add after all radio items within the checkboxes component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'Text to add after all radio items. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'HTML to add after all radio items. If `html` is provided, the `text` option will be ignored.'
          }
        }
      }
    }
  },
  idPrefix: {
    type: 'string',
    required: false,
    description:
      'Optional prefix. This is used to prefix the `id` attribute for each radio input, hint and error message, separated by `-`. Defaults to the `name` option value.'
  },
  name: {
    type: 'string',
    required: true,
    description: 'Name attribute for the radio items.'
  },
  items: {
    type: 'array',
    required: true,
    description: 'The radio items within the radios component.',
    params: {
      text: {
        type: 'string',
        required: true,
        description:
          'If `html` is set, this is not required. Text to use within each radio item label. If `html` is provided, the `text` option will be ignored.'
      },
      html: {
        type: 'string',
        required: true,
        description:
          'If `text` is set, this is not required. HTML to use within each radio item label. If `html` is provided, the `text` option will be ignored.'
      },
      id: {
        type: 'string',
        required: false,
        description:
          'Specific ID attribute for the radio item. If omitted, then `idPrefix` string will be applied.'
      },
      value: {
        type: 'string',
        required: true,
        description: 'Value for the radio input.'
      },
      label: {
        type: 'object',
        required: false,
        description:
          'Subset of options for the label used by each radio item within the radios component.',
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
          'Can be used to add a hint to each radio item within the radios component.',
        isComponent: true
      },
      divider: {
        type: 'string',
        required: false,
        description:
          'Divider text to separate radio items, for example the text `"or"`.'
      },
      checked: {
        type: 'boolean',
        required: false,
        description:
          'Whether the radio should be checked when the page loads. Takes precedence over the top-level `value` option.'
      },
      conditional: {
        type: 'object',
        required: false,
        description:
          'Provide additional content to reveal when the radio is checked.',
        params: {
          html: {
            type: 'string',
            description: 'The HTML to reveal when the radio is checked.',
            required: true
          }
        }
      },
      disabled: {
        type: 'boolean',
        required: false,
        description: 'If `true`, radio will be disabled.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the radio input tag.'
      }
    }
  },
  value: {
    type: 'string',
    required: false,
    description:
      'The value for the radio which should be checked when the page loads. Use this as an alternative to setting the `checked` option on each individual item.'
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the radio container.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the radio input tag.'
  }
}
