/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  id: {
    type: 'string',
    required: false,
    description:
      'This is used for the main component and to compose the ID attribute for each item.'
  },
  idPrefix: {
    type: 'string',
    required: false,
    description:
      'Optional prefix. This is used to prefix the `id` attribute for each tab item and panel, separated by `-`.'
  },
  title: {
    type: 'string',
    required: false,
    description: 'Title for the tabs table of contents.'
  },
  items: {
    type: 'array',
    required: true,
    description: 'The individual tabs within the tabs component.',
    params: {
      id: {
        type: 'string',
        required: true,
        description:
          'Specific ID attribute for the tab item. If omitted, then `idPrefix` string is required instead.'
      },
      label: {
        type: 'string',
        required: true,
        description: 'The text label of a tab item.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the tab.'
      },
      panel: {
        description:
          'The contents of each tab within the tabs component. This is referenced as a panel.',
        type: 'object',
        required: true,
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'If `html` is set, this is not required. Text to use within each tab panel. If `html` is provided, the `text` option will be ignored.'
          },
          html: {
            type: 'string',
            required: true,
            description:
              'If `text` is set, this is not required. HTML to use within each tab panel. If `html` is provided, the `text` option will be ignored.'
          },
          attributes: {
            type: 'object',
            required: false,
            description:
              'HTML attributes (for example data attributes) to add to the tab panel.'
          }
        }
      }
    }
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the tabs component.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the tabs component.'
  }
}
