/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      text: 'Error message about full name goes here'
    }
  },
  {
    name: 'translated',
    options: {
      visuallyHiddenText: '',
      html: '<span class="govuk-visually-hidden">Gwall:</span> Neges gwall am yr enw llawn yn mynd yma'
    }
  },
  {
    name: 'id',
    hidden: true,
    options: {
      id: 'my-error-message-id',
      text: 'This is an error message'
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      classes: 'custom-class',
      text: 'This is an error message'
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      text: 'Unexpected > in body'
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      html: 'Unexpected <b>bold text</b> in body copy'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      text: 'This is an error message',
      attributes: {
        'data-test': 'attribute',
        id: 'my-error-message'
      }
    }
  },
  {
    name: 'with visually hidden text',
    hidden: true,
    options: {
      text: 'Rhowch eich enw llawn',
      visuallyHiddenText: 'Gwall'
    }
  },
  {
    name: 'visually hidden text removed',
    hidden: true,
    options: {
      text: 'There is an error on line 42',
      visuallyHiddenText: ''
    }
  }
]
