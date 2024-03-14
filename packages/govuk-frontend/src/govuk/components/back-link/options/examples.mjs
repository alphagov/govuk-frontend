/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      href: '#'
    }
  },
  {
    name: 'with custom text',
    options: {
      href: '#',
      text: 'Back to home'
    }
  },
  {
    name: 'inverse',
    previewLayoutModifiers: ['inverse'],
    options: {
      classes: 'govuk-back-link--inverse',
      href: '#'
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      classes: 'app-back-link--custom-class',
      href: '#'
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      text: '<b>Home</b>',
      href: '#'
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      html: '<b>Back</b>',
      href: '#'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      href: '#',
      html: '<b>Back to home</b>',
      attributes: {
        'data-test': 'attribute',
        'aria-label': 'Back to home'
      }
    }
  }
]
