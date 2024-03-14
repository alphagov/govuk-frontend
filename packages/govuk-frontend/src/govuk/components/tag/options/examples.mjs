/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      text: 'Alpha'
    }
  },
  {
    name: 'grey',
    options: {
      text: 'Grey',
      classes: 'govuk-tag--grey'
    }
  },
  {
    name: 'blue',
    options: {
      text: 'Blue',
      classes: 'govuk-tag--blue'
    }
  },
  {
    name: 'light blue',
    options: {
      text: 'Light blue',
      classes: 'govuk-tag--light-blue'
    }
  },
  {
    name: 'turquoise',
    options: {
      text: 'Turquoise',
      classes: 'govuk-tag--turquoise'
    }
  },
  {
    name: 'green',
    options: {
      text: 'Green',
      classes: 'govuk-tag--green'
    }
  },
  {
    name: 'purple',
    options: {
      text: 'Purple',
      classes: 'govuk-tag--purple'
    }
  },
  {
    name: 'pink',
    options: {
      text: 'Pink',
      classes: 'govuk-tag--pink'
    }
  },
  {
    name: 'red',
    options: {
      text: 'Red',
      classes: 'govuk-tag--red'
    }
  },
  {
    name: 'orange',
    options: {
      text: 'Orange',
      classes: 'govuk-tag--orange'
    }
  },
  {
    name: 'yellow',
    options: {
      text: 'Yellow',
      classes: 'govuk-tag--yellow'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      text: 'Tag with attributes',
      attributes: {
        'data-test': 'attribute',
        id: 'my-tag'
      }
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      text: '<span>Alpha</span>'
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      html: '<span>Alpha</span>'
    }
  }
]
