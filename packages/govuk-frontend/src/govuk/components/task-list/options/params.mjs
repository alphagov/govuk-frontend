/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  items: {
    type: 'array',
    required: true,
    description: 'The items for each task within the task list component.',
    params: {
      title: {
        type: 'object',
        required: true,
        description:
          'The main title for the task within the task list component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'Text to use within the title. If `html` is provided, the `text` argument will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'HTML to use within the title. If `html` is provided, the `text` argument will be ignored.'
          },
          classes: {
            type: 'string',
            required: false,
            description: 'Classes to add to the title wrapper.'
          }
        }
      },
      hint: {
        type: 'object',
        required: false,
        description:
          'Can be used to add a hint to each task within the task list component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'Text to use within the hint. If `html` is provided, the `text` argument will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'HTML to use within the hint. If `html` is provided, the `text` argument will be ignored.'
          }
        }
      },
      status: {
        type: 'object',
        required: true,
        description: 'The status for each task within the task list component.',
        params: {
          tag: {
            type: 'object',
            isComponent: true,
            required: false,
            description:
              'Can be used to add a tag to the status of the task within the task list component.'
          },
          text: {
            required: false,
            type: 'string',
            description:
              'Text to use for the status, as an alternative to using a tag. If `html` or `tag` is provided, the `text` argument will be ignored.'
          },
          html: {
            required: false,
            type: 'string',
            description:
              'HTML to use for the status, as an alternative to using a tag. If `html` or `tag` is provided, the `text` argument will be ignored.'
          },
          classes: {
            type: 'string',
            required: false,
            description: 'Classes to add to the status container.'
          }
        }
      },
      href: {
        type: 'string',
        required: false,
        description:
          'The value of the link’s `href` attribute for the task list item.'
      },
      classes: {
        type: 'string',
        required: false,
        description: 'Classes to add to the item `div`.'
      }
    }
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the `ul` container for the task list.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the `ul` container for the task list.'
  },
  idPrefix: {
    type: 'string',
    required: false,
    description:
      'Optional prefix. This is used to prefix the `id` attribute for the task list item tag and hint, separated by `-`. Defaults to `"task-list"`.'
  }
}
