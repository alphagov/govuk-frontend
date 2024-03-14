/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  items: {
    type: 'array',
    required: true,
    description: 'The items within breadcrumbs.',
    params: {
      text: {
        type: 'string',
        required: true,
        description:
          'If `html` is set, this is not required. Text to use within the breadcrumbs item. If `html` is provided, the `text` option will be ignored.'
      },
      html: {
        type: 'string',
        required: true,
        description:
          'If `text` is set, this is not required. HTML to use within the breadcrumbs item. If `html` is provided, the `text` option will be ignored.'
      },
      href: {
        type: 'string',
        required: false,
        description:
          'Link for the breadcrumbs item. If not specified, breadcrumbs item is a normal list item.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the individual crumb.'
      }
    }
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the breadcrumbs container.'
  },
  collapseOnMobile: {
    type: 'boolean',
    required: false,
    description:
      'When true, the breadcrumbs will collapse to the first and last item only on tablet breakpoint and below.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the breadcrumbs container.'
  }
}
