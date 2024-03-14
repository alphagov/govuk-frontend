/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  text: {
    type: 'string',
    required: false,
    description:
      'Text to use within the back link component. If `html` is provided, the `text` option will be ignored. Defaults to `"Back"`.'
  },
  html: {
    type: 'string',
    required: false,
    description:
      'HTML to use within the back link component. If `html` is provided, the `text` option will be ignored. Defaults to `"Back"`.'
  },
  href: {
    type: 'string',
    required: true,
    description: "The value of the link's `href` attribute."
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the anchor tag.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the anchor tag.'
  }
}
