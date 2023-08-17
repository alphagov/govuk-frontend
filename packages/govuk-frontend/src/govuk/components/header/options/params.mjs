/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  homepageUrl: {
    type: 'string',
    required: false,
    description: 'The URL of the homepage. Defaults to `"/"`.'
  },
  productName: {
    type: 'string',
    required: false,
    description:
      'Product name, used when the product name follows on directly from ‘GOV.UK’. For example, GOV.UK Pay or GOV.UK Design System. In most circumstances, you should use `serviceName`.'
  },
  serviceName: {
    type: 'string',
    required: false,
    description: 'The name of your service, included in the header.'
  },
  serviceUrl: {
    type: 'string',
    required: false,
    description: 'URL for the service name anchor.'
  },
  navigation: {
    type: 'array',
    required: false,
    description: 'Can be used to add navigation to the header component.',
    params: {
      text: {
        type: 'string',
        required: true,
        description:
          'Text for the navigation item. If `html` is provided, the `text` option will be ignored.'
      },
      html: {
        type: 'string',
        required: true,
        description:
          'HTML for the navigation item. If `html` is provided, the `text` option will be ignored.'
      },
      href: {
        type: 'string',
        required: false,
        description: 'URL of the navigation item anchor.'
      },
      active: {
        type: 'boolean',
        required: false,
        description: 'Flag to mark the navigation item as active or not.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the navigation item anchor.'
      }
    }
  },
  navigationClasses: {
    type: 'string',
    required: false,
    description: 'Classes for the navigation section of the header.'
  },
  navigationLabel: {
    type: 'string',
    required: false,
    description:
      'Text for the `aria-label` attribute of the navigation. Defaults to the same value as `menuButtonText`.'
  },
  menuButtonLabel: {
    type: 'string',
    required: false,
    description:
      'Text for the `aria-label` attribute of the button that opens the mobile navigation, if there is a mobile navigation menu.'
  },
  menuButtonText: {
    type: 'string',
    required: false,
    description:
      "Text of the button that opens the mobile navigation menu, if there is a mobile navigation menu. There is no enforced character limit, but there is a limited display space so keep text as short as possible. By default, this is set to 'Menu'."
  },
  containerClasses: {
    type: 'string',
    required: false,
    description:
      'Classes for the container, useful if you want to make the header fixed width.'
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the header container.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the header container.'
  },
  useTudorCrown: {
    type: 'boolean',
    required: false,
    description:
      "Deprecated. If `true`, uses the Tudor crown from King Charles III's royal cypher. Otherwise, uses the St. Edward's crown. Default is `true`."
  }
}
