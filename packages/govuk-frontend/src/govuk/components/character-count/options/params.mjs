/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  id: {
    type: 'string',
    required: true,
    description: 'The ID of the textarea.'
  },
  name: {
    type: 'string',
    required: true,
    description:
      'The name of the textarea, which is submitted with the form data.'
  },
  rows: {
    type: 'string',
    required: false,
    description: 'Optional number of textarea rows (default is 5 rows).'
  },
  value: {
    type: 'string',
    required: false,
    description: 'Optional initial value of the textarea.'
  },
  maxlength: {
    type: 'string',
    required: true,
    description:
      'If `maxwords` is set, this is not required. The maximum number of characters. If `maxwords` is provided, the `maxlength` option will be ignored.'
  },
  maxwords: {
    type: 'string',
    required: true,
    description:
      'If `maxlength` is set, this is not required. The maximum number of words. If `maxwords` is provided, the `maxlength` option will be ignored.'
  },
  threshold: {
    type: 'string',
    required: false,
    description:
      'The percentage value of the limit at which point the count message is displayed. If this attribute is set, the count message will be hidden by default.'
  },
  label: {
    type: 'object',
    required: true,
    description: 'The label used by the character count component.',
    isComponent: true
  },
  hint: {
    type: 'object',
    required: false,
    description: 'Can be used to add a hint to the character count component.',
    isComponent: true
  },
  errorMessage: {
    type: 'object',
    required: false,
    description:
      'Can be used to add an error message to the character count component. The error message component will not display if you use a falsy value for `errorMessage`, for example `false` or `null`.',
    isComponent: true
  },
  formGroup: {
    type: 'object',
    required: false,
    description:
      'Additional options for the form group containing the character count component.',
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
      beforeInput: {
        type: 'object',
        required: false,
        description:
          'Content to add before the textarea used by the character count component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'Text to add before the textarea. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'HTML to add before the textarea. If `html` is provided, the `text` option will be ignored.'
          }
        }
      },
      afterInput: {
        type: 'object',
        required: false,
        description:
          'Content to add after the textarea used by the character count component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'Text to add after the textarea. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'HTML to add after the textarea. If `html` is provided, the `text` option will be ignored.'
          }
        }
      }
    }
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the textarea.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the textarea.'
  },
  spellcheck: {
    type: 'boolean',
    required: false,
    description:
      'Optional field to enable or disable the `spellcheck` attribute on the character count.'
  },
  countMessage: {
    type: 'object',
    required: false,
    description:
      'Additional options for the count message used by the character count component.',
    params: {
      classes: {
        type: 'string',
        required: false,
        description: 'Classes to add to the count message.'
      }
    }
  },
  textareaDescriptionText: {
    type: 'string',
    required: false,
    description:
      'Message made available to assistive technologies to describe that the component accepts only a limited amount of content. It is visible on the page when JavaScript is unavailable. The component will replace the `%{count}` placeholder with the value of the `maxlength` or `maxwords` parameter.'
  },
  charactersUnderLimitText: {
    type: 'object',
    required: false,
    description:
      'Message displayed when the number of characters is under the configured maximum, `maxlength`. This message is displayed visually and through assistive technologies. The component will replace the `%{count}` placeholder with the number of remaining characters. This is a [pluralised list of messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).'
  },
  charactersAtLimitText: {
    type: 'string',
    required: false,
    description:
      'Message displayed when the number of characters reaches the configured maximum, `maxlength`. This message is displayed visually and through assistive technologies.'
  },
  charactersOverLimitText: {
    type: 'object',
    required: false,
    description:
      'Message displayed when the number of characters is over the configured maximum, `maxlength`. This message is displayed visually and through assistive technologies. The component will replace the `%{count}` placeholder with the number of characters above the maximum. This is a [pluralised list of messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).'
  },
  wordsUnderLimitText: {
    type: 'object',
    required: false,
    description:
      'Message displayed when the number of words is under the configured maximum, `maxwords`. This message is displayed visually and through assistive technologies. The component will replace the `%{count}` placeholder with the number of remaining words. This is a [pluralised list of messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).'
  },
  wordsAtLimitText: {
    type: 'string',
    required: false,
    description:
      'Message displayed when the number of words reaches the configured maximum, `maxwords`. This message is displayed visually and through assistive technologies.'
  },
  wordsOverLimitText: {
    type: 'object',
    required: false,
    description:
      'Message displayed when the number of words is over the configured maximum, `maxwords`. This message is displayed visually and through assistive technologies. The component will replace the `%{count}` placeholder with the number of characters above the maximum. This is a [pluralised list of messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).'
  }
}
