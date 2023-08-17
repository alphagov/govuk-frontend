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
      'If `html` is set, this is not required. Text to use within the phase banner. If `html` is provided, the `text` option will be ignored.'
  },
  html: {
    type: 'string',
    required: true,
    description:
      'If `text` is set, this is not required. HTML to use within the phase banner. If `html` is provided, the `text` option will be ignored.'
  },
  tag: {
    type: 'object',
    required: true,
    description: 'The tag used by the phase banner component.',
    isComponent: true
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the phase banner container.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the phase banner container.'
  }
}
