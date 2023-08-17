/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  rows: {
    type: 'array',
    required: true,
    description: 'The rows within the summary list component.',
    params: {
      classes: {
        type: 'string',
        required: false,
        description: 'Classes to add to the row `div`.'
      },
      key: {
        type: 'object',
        required: true,
        description:
          'The reference content (key) for each row item in the summary list component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'If `html` is set, this is not required. Text to use within each key. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'If `text` is set, this is not required. HTML to use within each key. If `html` is provided, the `text` option will be ignored.'
          },
          classes: {
            type: 'string',
            required: false,
            description: 'Classes to add to the key wrapper.'
          }
        }
      },
      value: {
        type: 'object',
        required: true,
        description:
          'The value for each row item in the summary list component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'If `html` is set, this is not required. Text to use within each value. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'If `text` is set, this is not required. HTML to use within each value. If `html` is provided, the `text` option will be ignored.'
          },
          classes: {
            type: 'string',
            required: false,
            description: 'Classes to add to the value wrapper.'
          }
        }
      },
      actions: {
        type: 'object',
        required: false,
        description:
          'The action link content for each row item in the summary list component.',
        params: {
          items: {
            type: 'array',
            required: false,
            description:
              'The action link items within the row item of the summary list component.',
            params: {
              href: {
                type: 'string',
                required: true,
                description:
                  "The value of the link's `href` attribute for an action item."
              },
              text: {
                type: 'string',
                required: true,
                description:
                  'If `html` is set, this is not required. Text to use within each action item. If `html` is provided, the `text` option will be ignored.'
              },
              html: {
                type: 'string',
                required: true,
                description:
                  'If `text` is set, this is not required. HTML to use within each action item. If `html` is provided, the `text` option will be ignored.'
              },
              visuallyHiddenText: {
                type: 'string',
                required: false,
                description:
                  'Actions rely on context from the surrounding content so may require additional accessible text. Text supplied to this option is appended to the end. Use `html` for more complicated scenarios.'
              },
              classes: {
                type: 'string',
                required: false,
                description: 'Classes to add to the action item.'
              },
              attributes: {
                type: 'object',
                required: false,
                description:
                  'HTML attributes (for example data attributes) to add to the action item.'
              }
            }
          },
          classes: {
            type: 'string',
            required: false,
            description: 'Classes to add to the actions wrapper.'
          }
        }
      }
    }
  },
  card: {
    type: 'object',
    required: false,
    description:
      'Can be used to wrap a summary card around the summary list component. If any of these options are present, a summary card will wrap around the summary list.',
    params: {
      title: {
        type: 'object',
        required: false,
        description: 'Data for the summary card header.',
        params: {
          text: {
            type: 'string',
            required: false,
            description:
              'Text to use within each title. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: false,
            description:
              'Text to use within each title. If `html` is provided, the `text` option will be ignored.'
          },
          headingLevel: {
            type: 'integer',
            required: false,
            description: 'Heading level, from `1` to `6`. Default is `2`.'
          },
          classes: {
            type: 'string',
            required: false,
            description: 'Classes to add to the title wrapper.'
          }
        }
      },
      actions: {
        type: 'object',
        required: false,
        description:
          'The action link content shown in the header of each summary card wrapped around the summary list component.',
        params: {
          items: {
            type: 'array',
            required: false,
            description:
              'The action link items shown in the header within the summary card wrapped around the summary list component.',
            params: {
              href: {
                type: 'string',
                required: true,
                description:
                  "The value of the link's `href` attribute for an action item."
              },
              text: {
                type: 'string',
                required: true,
                description:
                  'If `html` is set, this is not required. Text to use within each action item. If `html` is provided, the `text` option will be ignored.'
              },
              html: {
                type: 'string',
                required: true,
                description:
                  'If `text` is set, this is not required. HTML to use within each action item. If `html` is provided, the `text` option will be ignored.'
              },
              visuallyHiddenText: {
                type: 'string',
                required: false,
                description:
                  'Actions rely on context from the surrounding content so may require additional accessible text. Text supplied to this option is appended to the end. Use `html` for more complicated scenarios.'
              },
              classes: {
                type: 'string',
                required: false,
                description: 'Classes to add to the action item.'
              },
              attributes: {
                type: 'object',
                required: false,
                description:
                  'HTML attributes (for example data attributes) to add to the action item.'
              }
            }
          },
          classes: {
            type: 'string',
            required: false,
            description: 'Classes to add to the actions wrapper.'
          }
        }
      },
      classes: {
        type: 'string',
        required: false,
        description: 'Classes to add to the container.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the container.'
      }
    }
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the container.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the container.'
  }
}
