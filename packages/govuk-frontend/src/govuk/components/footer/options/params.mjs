/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  meta: {
    type: 'object',
    required: false,
    description:
      'The meta section of the footer after any navigation, before the copyright and license information.',
    params: {
      visuallyHiddenTitle: {
        type: 'string',
        required: false,
        description:
          'Title for a meta item section. Defaults to `"Support links"`.'
      },
      html: {
        type: 'string',
        required: false,
        description:
          'HTML to add to the meta section of the footer, which will appear below any links specified using meta `items`.'
      },
      text: {
        type: 'string',
        required: false,
        description:
          'Text to add to the meta section of the footer, which will appear below any links specified using meta `items`. If meta `html` is specified, this option is ignored.'
      },
      items: {
        type: 'array',
        required: false,
        description:
          'The meta `items` add content within a unordered list to the meta section of the footer component. These appear above any text or custom html in the meta section.',
        params: {
          text: {
            type: 'string',
            required: true,
            description: 'List item text in the meta section of the footer.'
          },
          href: {
            type: 'string',
            required: true,
            description:
              'List item link `href` attribute in the meta section of the footer.'
          },
          attributes: {
            type: 'object',
            required: false,
            description:
              'HTML attributes (for example data attributes) to add to the anchor in the footer meta section.'
          }
        }
      }
    }
  },
  navigation: {
    type: 'array',
    required: false,
    description:
      'The navigation section of the footer before a section break and the copyright and license information.',
    params: {
      title: {
        type: 'string',
        required: true,
        description: 'Title for a section.'
      },
      columns: {
        type: 'integer',
        required: false,
        description:
          'Amount of columns to display items in navigation section of the footer.'
      },
      width: {
        type: 'string',
        required: false,
        description:
          'Width of each navigation section in the footer. You can pass any Design System grid width here – for example, `"one-third"`, `"two-thirds"` or `"one-half"`. Defaults to `"full"`.'
      },
      items: {
        type: 'array',
        required: false,
        description:
          'The items within the navigation section of the footer component.',
        params: {
          text: {
            type: 'string',
            required: true,
            description:
              'List item text in the navigation section of the footer.'
          },
          href: {
            type: 'string',
            required: true,
            description:
              'List item link `href` attribute in the navigation section of the footer. Both `text` and `href` attributes need to be present to create a link.'
          },
          attributes: {
            type: 'object',
            required: false,
            description:
              'HTML attributes (for example data attributes) to add to the anchor in the footer navigation section.'
          }
        }
      }
    }
  },
  contentLicence: {
    type: 'object',
    required: false,
    description:
      'The content licence information within the footer component. Defaults to Open Government Licence (OGL) v3 licence.',
    params: {
      text: {
        type: 'string',
        required: false,
        description:
          'If `html` is set, this is not required. If `html` is provided, the `text` option will be ignored. If neither are provided, the text for the Open Government Licence is used.'
      },
      html: {
        type: 'string',
        required: false,
        description:
          'If `text` is set, this is not required. If `html` is provided, the `text` option will be ignored. If neither are provided, the text for the Open Government Licence is used. The content licence is inside a `<span>` element, so you can only add [phrasing content](https://html.spec.whatwg.org/#phrasing-content) to it.'
      }
    }
  },
  copyright: {
    type: 'object',
    required: false,
    description:
      'The copyright information in the footer component, this defaults to `"© Crown copyright"`.',
    params: {
      text: {
        type: 'string',
        required: false,
        description:
          'If `html` is set, this is not required. If `html` is provided, the `text` option will be ignored. If neither are provided, `"© Crown copyright"` is used.'
      },
      html: {
        type: 'string',
        required: false,
        description:
          'If `text` is set, this is not required. If `html` is provided, the `text` option will be ignored. If neither are provided, `"© Crown copyright"` is used. The copyright notice is inside an `<a>` element, so you can only use text formatting elements within it.'
      }
    }
  },
  containerClasses: {
    type: 'string',
    required: false,
    description:
      'Classes that can be added to the inner container, useful if you want to make the footer full width.'
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the footer component container.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the footer component container.'
  }
}
