/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      titleHtml: 'Application complete',
      text: 'Your reference number: HDJ2123F'
    }
  },
  {
    name: 'custom heading level',
    options: {
      titleText: 'Application complete',
      headingLevel: 2,
      text: 'Your reference number: HDJ2123F'
    }
  },
  {
    name: 'title html as text',
    hidden: true,
    options: {
      titleText: 'Application <strong>not</strong> complete',
      text: 'Please complete form 1'
    }
  },
  {
    name: 'title html',
    hidden: true,
    options: {
      titleHtml: 'Application <strong>not</strong> complete',
      html: 'Please complete <strong>form 1</strong>'
    }
  },
  {
    name: 'body html as text',
    hidden: true,
    options: {
      titleText: 'Application complete',
      text: 'Your reference number<br><strong>HDJ2123F</strong>'
    }
  },
  {
    name: 'body html',
    hidden: true,
    options: {
      titleText: 'Application complete',
      html: 'Your reference number<br><strong>HDJ2123F</strong>'
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      titleText: 'Application complete',
      text: 'Your reference number is HDJ2123F',
      classes: 'extra-class one-more-class'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      titleText: 'Application complete',
      text: 'Your reference number is HDJ2123F',
      attributes: {
        'first-attribute': 'foo',
        'second-attribute': 'bar'
      }
    }
  },
  {
    name: 'title with no body text',
    hidden: true,
    options: {
      titleText: 'Application complete'
    }
  }
]
