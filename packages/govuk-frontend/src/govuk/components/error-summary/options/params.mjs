/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  titleText: {
    type: 'string',
    required: true,
    description:
      'If `titleHtml` is set, this is not required. Text to use for the heading of the error summary block. If `titleHtml` is provided, `titleText` will be ignored.'
  },
  titleHtml: {
    type: 'string',
    required: true,
    description:
      'If `titleText` is set, this is not required. HTML to use for the heading of the error summary block. If `titleHtml` is provided, `titleText` will be ignored.'
  },
  descriptionText: {
    type: 'string',
    required: false,
    description:
      'Text to use for the description of the errors. If you set `descriptionHtml`, the component will ignore `descriptionText`.'
  },
  descriptionHtml: {
    type: 'string',
    required: false,
    description:
      'HTML to use for the description of the errors. If you set this option, the component will ignore `descriptionText`.'
  },
  caller: {
    type: 'nunjucks-block',
    required: false,
    description:
      'Not strictly a parameter but [Nunjucks code convention](https://mozilla.github.io/nunjucks/templating.html#call). Using a `call` block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire error summary component in a `call` block.'
  },
  errorList: {
    type: 'array',
    required: true,
    description: 'The list of errors to include in the error summary.',
    params: {
      href: {
        type: 'string',
        required: false,
        description:
          'Href attribute for the error link item. If provided item will be an anchor.'
      },
      text: {
        type: 'string',
        required: true,
        description:
          'If `html` is set, this is not required. Text for the error link item. If `html` is provided, the `text` option will be ignored.'
      },
      html: {
        type: 'string',
        required: true,
        description:
          'If `text` is set, this is not required. HTML for the error link item. If `html` is provided, the `text` option will be ignored.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the error link anchor.'
      }
    }
  },
  disableAutoFocus: {
    type: 'boolean',
    required: false,
    description:
      'Prevent moving focus to the error summary when the page loads.'
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the error-summary container.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the error-summary container.'
  }
}
