/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  items: {
    type: 'array',
    required: false,
    description: 'The items within the pagination component.',
    params: {
      number: {
        type: 'string',
        required: false,
        description: 'The pagination item text – usually a page number.'
      },
      visuallyHiddenText: {
        type: 'string',
        required: false,
        description:
          'The visually hidden label (for the pagination item) which will be applied to an `aria-label` and announced by screen readers on the pagination item link. Should include page number.'
      },
      href: {
        type: 'string',
        required: true,
        description: "The link's URL."
      },
      current: {
        type: 'boolean',
        required: false,
        description:
          'Set to `true` to indicate the current page the user is on.'
      },
      ellipsis: {
        type: 'boolean',
        required: false,
        description:
          'Use this option if you want to specify an ellipsis at a given point between numbers. If you set this option as `true`, any other options for the item are ignored.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'The HTML attributes (for example, data attributes) you want to add to the anchor.'
      }
    }
  },
  previous: {
    type: 'object',
    required: false,
    description: 'A link to the previous page, if there is a previous page.',
    params: {
      text: {
        type: 'string',
        required: false,
        description:
          'The text content of the link to the previous page. Defaults to `"Previous page"`, with \'page\' being visually hidden. If `html` is provided, the `text` option will be ignored.'
      },
      html: {
        type: 'string',
        required: false,
        description:
          'The HTML content of the link to the previous page. Defaults to `"Previous page"`, with \'page\' being visually hidden. If `html` is provided, the `text` option will be ignored.'
      },
      labelText: {
        type: 'string',
        required: false,
        description:
          'The optional label that goes underneath the link to the previous page, providing further context for the user about where the link goes.'
      },
      href: {
        type: 'string',
        required: true,
        description: "The previous page's URL."
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'The HTML attributes (for example, data attributes) you want to add to the anchor.'
      }
    }
  },
  next: {
    type: 'object',
    required: false,
    description: 'A link to the next page, if there is a next page.',
    params: {
      text: {
        type: 'string',
        required: false,
        description:
          'The text content of the link to the next page. Defaults to `"Next page"`, with \'page\' being visually hidden. If `html` is provided, the `text` option will be ignored.'
      },
      html: {
        type: 'string',
        required: false,
        description:
          'The HTML content of the link to the next page. Defaults to `"Next page"`, with \'page\' being visually hidden. If `html` is provided, the `text` option will be ignored.'
      },
      labelText: {
        type: 'string',
        required: false,
        description:
          'The optional label that goes underneath the link to the next page, providing further context for the user about where the link goes.'
      },
      href: {
        type: 'string',
        required: true,
        description: "The next page's URL."
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'The HTML attributes (for example, data attributes) you want to add to the anchor.'
      }
    }
  },
  landmarkLabel: {
    type: 'string',
    required: false,
    description:
      'The label for the navigation landmark that wraps the pagination. Defaults to `"Pagination"`.'
  },
  classes: {
    type: 'string',
    required: false,
    description: 'The classes you want to add to the pagination `nav` parent.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'The HTML attributes (for example, data attributes) you want to add to the pagination `nav` parent.'
  }
}
