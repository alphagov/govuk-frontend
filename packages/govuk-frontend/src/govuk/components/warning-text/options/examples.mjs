/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      text: 'You can be fined up to £5,000 if you don’t register.',
      iconFallbackText: 'Warning'
    }
  },
  {
    name: 'multiple lines',
    options: {
      text: 'If you are not covered by this License), You must: (a) comply with the terms stated above for the purpose of this license. It explains, for example, the production of a Source form, including but not limited to, the implied warranties or conditions of this License, without any additional file created by such Respondent to you under Sections 2.1 and 2.2 above. Larger Works. You may choose to distribute such a notice and a brief idea of what it does.',
      iconFallbackText: 'Warning'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      text: 'You can be fined up to £5,000 if you don’t register.',
      attributes: {
        id: 'my-warning-text',
        'data-test': 'attribute'
      }
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      text: 'Warning text',
      classes: 'govuk-warning-text--custom-class'
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      text: 'You can be fined up to £5,000 if you don’t register.',
      html: '<span>Some custom warning text</span>'
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      text: '<span>Some custom warning text</span>'
    }
  },
  {
    name: 'icon fallback text only',
    hidden: true,
    options: {
      iconFallbackText: 'Some custom fallback text'
    }
  },
  {
    name: 'no icon fallback text',
    hidden: true,
    options: {
      text: 'This is a warning'
    }
  }
]
