/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      text:
        "It's on your National Insurance card, benefit letter, payslip or P60.\n" +
        "For example, 'QQ 12 34 56 C'.\n"
    }
  },
  {
    name: 'with html',
    options: {
      html:
        `It's on your National Insurance card, benefit letter, payslip or <a class="govuk-link" href="#">P60</a>.\n` +
        "For example, 'QQ 12 34 56 C'.\n"
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      id: 'example-hint',
      classes: 'app-hint--custom-modifier',
      text: "It's on your National Insurance card, benefit letter, payslip or P60."
    }
  },
  {
    name: 'id',
    hidden: true,
    options: {
      id: 'my-hint',
      text: "It's on your National Insurance card, benefit letter, payslip or P60."
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      text: 'Unexpected <strong>bold text</strong> in body'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      text: "It's on your National Insurance card, benefit letter, payslip or P60.",
      attributes: {
        'data-attribute': 'my data value'
      }
    }
  }
]
