/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  text: {
    type: 'string',
    required: true,
    description:
      'If `html` is set, this is not required. Text to use within the skip link component. If `html` is provided, the `text` option will be ignored.'
  },
  html: {
    type: 'string',
    required: true,
    description:
      'If `text` is set, this is not required. HTML to use within the skip link component. If `html` is provided, the `text` option will be ignored.'
  },
  href: {
    type: 'string',
    required: false,
    description:
      'The value of the skip link’s `href` attribute. Defaults to `"#content"` if you do not provide a value.'
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the skip link.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the skip link.'
  }
}
