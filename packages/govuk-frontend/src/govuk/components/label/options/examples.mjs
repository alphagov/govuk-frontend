/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      text: 'National Insurance number'
    }
  },
  {
    name: 'with bold text',
    options: {
      classes: 'govuk-label--s',
      text: 'National Insurance number'
    }
  },
  {
    name: 'styled as xl text',
    options: {
      text: 'National Insurance number',
      classes: 'govuk-label--xl'
    }
  },
  {
    name: 'styled as large text',
    options: {
      text: 'National Insurance number',
      classes: 'govuk-label--l'
    }
  },
  {
    name: 'styled as medium text',
    options: {
      text: 'National Insurance number',
      classes: 'govuk-label--m'
    }
  },
  {
    name: 'styled as small text',
    options: {
      text: 'National Insurance number',
      classes: 'govuk-label--s'
    }
  },
  {
    name: 'as page heading xl',
    options: {
      text: 'National Insurance number',
      classes: 'govuk-label--xl',
      isPageHeading: true
    }
  },
  {
    name: 'as page heading l',
    options: {
      text: 'National Insurance number',
      classes: 'govuk-label--l',
      isPageHeading: true
    }
  },
  {
    name: 'as page heading m',
    options: {
      text: 'National Insurance number',
      classes: 'govuk-label--m',
      isPageHeading: true
    }
  },
  {
    name: 'as page heading s',
    options: {
      text: 'National Insurance number',
      classes: 'govuk-label--s',
      isPageHeading: true
    }
  },
  {
    name: 'as page heading without class',
    options: {
      text: 'National Insurance number',
      isPageHeading: true
    }
  },
  {
    name: 'empty',
    hidden: true,
    options: {}
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      text: 'National Insurance number',
      classes: 'extra-class one-more-class'
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      text: 'National Insurance number, <em>NINO</em>'
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      html: 'National Insurance number <em>NINO</em>'
    }
  },
  {
    name: 'for',
    hidden: true,
    options: {
      for: 'test-target-element',
      text: 'National Insurance number'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      text: 'National Insurance number',
      attributes: {
        'first-attribute': 'foo',
        'second-attribute': 'bar'
      }
    }
  }
]
