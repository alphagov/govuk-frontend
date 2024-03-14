/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      titleText: 'There is a problem',
      errorList: [
        {
          text: 'The date your passport was issued must be in the past',
          href: '#example-error-1'
        },
        {
          text: 'Enter a postcode, like AA1 1AA',
          href: '#example-error-2'
        }
      ]
    }
  },
  {
    name: 'without links',
    options: {
      titleText: 'There is a problem',
      errorList: [
        {
          text: 'Invalid username or password'
        }
      ]
    }
  },
  {
    name: 'mixed with and without links',
    options: {
      titleText: 'There is a problem',
      errorList: [
        {
          text: 'Invalid username or password'
        },
        {
          text: 'Agree to the terms of service to log in',
          href: '#example-error-1'
        }
      ]
    }
  },
  {
    name: 'with everything',
    options: {
      titleText: 'There is a problem',
      descriptionText: 'Please fix the errors below.',
      errorList: [
        {
          text: 'Invalid username or password'
        },
        {
          text: 'Agree to the terms of service to log in',
          href: '#example-error-1'
        }
      ]
    }
  },
  {
    name: 'html as titleText',
    hidden: true,
    options: {
      titleText: 'Alert, <em>alert</em>',
      errorList: [
        {
          text: 'Invalid username or password'
        }
      ]
    }
  },
  {
    name: 'title html',
    hidden: true,
    options: {
      titleHtml: 'Alert, <em>alert</em>',
      errorList: [
        {
          text: 'Invalid username or password'
        }
      ]
    }
  },
  {
    name: 'description',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      descriptionText: 'Lorem ipsum',
      errorList: [
        {
          text: 'Invalid username or password'
        }
      ]
    }
  },
  {
    name: 'html as descriptionText',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      descriptionText: 'See errors below (>)',
      errorList: [
        {
          text: 'Invalid username or password'
        }
      ]
    }
  },
  {
    name: 'description html',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      descriptionHtml: 'See <span>errors</span> below',
      errorList: [
        {
          text: 'Invalid username or password'
        }
      ]
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      classes: 'extra-class one-more-class',
      errorList: [
        {
          text: 'Invalid username or password'
        }
      ]
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      attributes: {
        'first-attribute': 'foo',
        'second-attribute': 'bar'
      },
      errorList: [
        {
          text: 'Invalid username or password'
        }
      ]
    }
  },
  {
    name: 'error list with attributes',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      errorList: [
        {
          text: 'Error-1',
          href: '#item',
          attributes: {
            'data-attribute': 'my-attribute',
            'data-attribute-2': 'my-attribute-2'
          }
        }
      ]
    }
  },
  {
    name: 'error list with html as text',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      errorList: [
        {
          text: 'Descriptive link to the <b>question</b> with an error'
        }
      ]
    }
  },
  {
    name: 'error list with html',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      errorList: [
        {
          html: 'The date your passport was issued <b>must</b> be in the past'
        }
      ]
    }
  },
  {
    name: 'error list with html link',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      errorList: [
        {
          html: 'Descriptive link to the <b>question</b> with an error',
          href: '#error-1'
        }
      ]
    }
  },
  {
    name: 'error list with html as text link',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      errorList: [
        {
          text: 'Descriptive link to the <b>question</b> with an error',
          href: '#error-1'
        }
      ]
    }
  },
  {
    name: 'autofocus disabled',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      disableAutoFocus: true
    }
  },
  {
    name: 'autofocus explicitly enabled',
    hidden: true,
    options: {
      titleText: 'There is a problem',
      disableAutoFocus: false
    }
  }
]
