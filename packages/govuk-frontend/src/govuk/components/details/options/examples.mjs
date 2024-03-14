/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      summaryText: 'Help with nationality',
      text: 'We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.'
    }
  },
  {
    name: 'expanded',
    options: {
      id: 'help-with-nationality',
      summaryText: 'Help with nationality',
      text: 'We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.',
      open: true
    }
  },
  {
    name: 'with html',
    options: {
      summaryText: 'Where to find your National Insurance Number',
      html:
        'Your National Insurance number can be found on\n' +
        '<ul>\n' +
        '  <li>your National Insurance card</li>\n' +
        '  <li>your payslip</li>\n' +
        '  <li>P60</li>\n' +
        '  <li>benefits information</li>\n' +
        '  <li>tax return</li>\n' +
        '</ul>\n'
    }
  },
  {
    name: 'id',
    hidden: true,
    options: {
      id: 'my-details-element',
      summaryText: 'Expand this section',
      text: 'Here are some more details'
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      summaryText: 'Expand this section',
      text: 'More about the greater than symbol (>)'
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      summaryText: 'Expand this section',
      html: 'More about <b>bold text</b>'
    }
  },
  {
    name: 'summary html as text',
    hidden: true,
    options: {
      summaryText: 'The greater than symbol (>) is the best',
      text: 'Here are some more details'
    }
  },
  {
    name: 'summary html',
    hidden: true,
    options: {
      summaryHtml: 'Use <b>bold text</b> sparingly',
      text: 'Here are some more details'
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      classes: 'some-additional-class',
      text: 'Here are some more details',
      summaryText: 'Expand me'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      text: 'Here are some more details',
      summaryText: 'Expand me',
      attributes: {
        'data-some-data-attribute': 'i-love-data',
        'another-attribute': 'foo'
      }
    }
  }
]
