/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  rows: {
    type: 'array',
    required: true,
    description: 'The rows within the table component.',
    params: {
      text: {
        type: 'string',
        required: true,
        description:
          'If `html` is set, this is not required. Text for cells in table rows. If `html` is provided, the `text` option will be ignored.'
      },
      html: {
        type: 'string',
        required: true,
        description:
          'If `text` is set, this is not required. HTML for cells in table rows. If `html` is provided, the `text` option will be ignored.'
      },
      format: {
        type: 'string',
        required: false,
        description:
          'Specify format of a cell. Currently we only use "numeric".'
      },
      classes: {
        type: 'string',
        required: false,
        description: 'Classes to add to the table row cell.'
      },
      colspan: {
        type: 'integer',
        required: false,
        description: 'Specify how many columns a cell extends.'
      },
      rowspan: {
        type: 'integer',
        required: false,
        description: 'Specify how many rows a cell extends.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the table cell.'
      }
    }
  },
  head: {
    type: 'array',
    required: false,
    description:
      'Can be used to add a row of table header cells (`<th>`) at the top of the table component.',
    params: {
      text: {
        type: 'string',
        required: false,
        description:
          'If `html` is set, this is not required. Text for table head cells. If `html` is provided, the `text` option will be ignored.'
      },
      html: {
        type: 'string',
        required: false,
        description:
          'If `text` is set, this is not required. HTML for table head cells. If `html` is provided, the `text` option will be ignored.'
      },
      format: {
        type: 'string',
        required: false,
        description:
          'Specify format of a cell. Currently we only use "numeric".'
      },
      classes: {
        type: 'string',
        required: false,
        description: 'Classes to add to the table head cell.'
      },
      colspan: {
        type: 'integer',
        required: false,
        description: 'Specify how many columns a cell extends.'
      },
      rowspan: {
        type: 'integer',
        required: false,
        description: 'Specify how many rows a cell extends.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'HTML attributes (for example data attributes) to add to the table cell.'
      }
    }
  },
  caption: {
    type: 'string',
    required: false,
    description: 'Caption text.'
  },
  captionClasses: {
    type: 'string',
    required: false,
    description:
      'Classes for caption text size. Classes should correspond to the available typography heading classes.'
  },
  firstCellIsHeader: {
    type: 'boolean',
    required: false,
    description:
      'If set to `true`, the first cell in each row will be a table header (`<th>`).'
  },
  classes: {
    type: 'string',
    required: false,
    description: 'Classes to add to the table container.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'HTML attributes (for example data attributes) to add to the table container.'
  }
}
