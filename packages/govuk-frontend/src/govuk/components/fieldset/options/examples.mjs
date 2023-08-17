/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      legend: {
        text: 'What is your address?'
      }
    }
  },
  {
    name: 'styled as xl text',
    options: {
      legend: {
        text: 'What is your address?',
        classes: 'govuk-fieldset__legend--xl'
      }
    }
  },
  {
    name: 'styled as large text',
    options: {
      legend: {
        text: 'What is your address?',
        classes: 'govuk-fieldset__legend--l'
      }
    }
  },
  {
    name: 'styled as medium text',
    options: {
      legend: {
        text: 'What is your address?',
        classes: 'govuk-fieldset__legend--m'
      }
    }
  },
  {
    name: 'styled as small text',
    options: {
      legend: {
        text: 'What is your address?',
        classes: 'govuk-fieldset__legend--s'
      }
    }
  },
  {
    name: 'as page heading xl',
    options: {
      legend: {
        text: 'What is your address?',
        classes: 'govuk-fieldset__legend--xl',
        isPageHeading: true
      }
    }
  },
  {
    name: 'as page heading l',
    options: {
      legend: {
        text: 'What is your address?',
        classes: 'govuk-fieldset__legend--l',
        isPageHeading: true
      }
    }
  },
  {
    name: 'as page heading m',
    options: {
      legend: {
        text: 'What is your address?',
        classes: 'govuk-fieldset__legend--m',
        isPageHeading: true
      }
    }
  },
  {
    name: 'as page heading s',
    options: {
      legend: {
        text: 'What is your address?',
        classes: 'govuk-fieldset__legend--s',
        isPageHeading: true
      }
    }
  },
  {
    name: 'as page heading without class',
    options: {
      legend: {
        text: 'What is your address?',
        isPageHeading: true
      }
    }
  },
  {
    name: 'html fieldset content',
    hidden: true,
    options: {
      legend: {
        text: 'What is your address?'
      },
      html:
        '<div class="my-content">\n' +
        '  <p>This is some content to put inside the fieldset</p>\n' +
        '</div>\n'
    }
  },
  {
    name: 'with describedBy',
    hidden: true,
    options: {
      describedBy: 'test-target-element',
      legend: {
        text: 'Which option?'
      }
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      legend: {
        text: 'What is <b>your</b> address?'
      }
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      legend: {
        html: 'What is <b>your</b> address?'
      }
    }
  },
  {
    name: 'legend classes',
    hidden: true,
    options: {
      legend: {
        text: 'What is your address?',
        classes: 'my-custom-class'
      }
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      classes: 'app-fieldset--custom-modifier',
      legend: {
        text: 'Which option?'
      }
    }
  },
  {
    name: 'role',
    hidden: true,
    options: {
      role: 'group',
      legend: {
        text: 'Which option?'
      }
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      attributes: {
        'data-attribute': 'value'
      },
      legend: {
        text: 'Which option?'
      }
    }
  }
]
