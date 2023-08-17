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
      'If `html` is set, this is not required. Text to use within the warning text component. If `html` is provided, the `text` option will be ignored.'
  },
  html: {
    type: 'string',
    required: true,
    description:
      'If `text` is set, this is not required. HTML to use within the warning text component. If `html` is provided, the `text` option will be ignored.'
  },
  iconFallbackText: {
    type: 'string',
    required: false,
    description: 'The fallback text for the icon. Defaults to `"Warning"`.'
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the warning text.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the warning text.'
  }
}
