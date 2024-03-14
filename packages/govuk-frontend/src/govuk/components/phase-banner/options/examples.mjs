/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      tag: {
        text: 'Alpha'
      },
      html: 'This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.'
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      text: 'This is a new service – your feedback will help us to improve it',
      classes: 'extra-class one-more-class'
    }
  },
  {
    name: 'text',
    hidden: true,
    options: {
      text: 'This is a new service – your feedback will help us to improve it'
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      text: 'This is a new service - your <a href="#" class="govuk-link">feedback</a> will help us to improve it.'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      text: 'This is a new service – your feedback will help us to improve it',
      attributes: {
        'first-attribute': 'foo',
        'second-attribute': 'bar'
      }
    }
  },
  {
    name: 'tag html',
    hidden: true,
    options: {
      text: 'This is a new service – your feedback will help us to improve it',
      tag: {
        html: '<em>Alpha</em>'
      }
    }
  },
  {
    name: 'tag classes',
    hidden: true,
    options: {
      text: 'This is a new service – your feedback will help us to improve it',
      tag: {
        classes: 'govuk-tag--grey',
        text: 'Alpha'
      }
    }
  }
]
