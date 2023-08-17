/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      text: 'Skip to main content',
      href: '#test-target-element'
    }
  },
  {
    name: 'with focus',
    description:
      'Simulate triggering the :focus CSS pseudo-class, not available in the production build.',
    options: {
      classes: ':focus',
      text: 'Skip to main content',
      href: '#test-target-element'
    }
  },
  {
    name: 'no href',
    hidden: true,
    options: {
      text: 'Skip to main content'
    }
  },
  {
    name: 'custom href',
    hidden: true,
    options: {
      text: 'Skip to custom content',
      href: '#custom'
    }
  },
  {
    name: 'custom text',
    hidden: true,
    options: {
      text: 'skip'
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      text: '<p>skip</p>'
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      html: '<p>skip</p>'
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      text: 'Skip link',
      classes: 'app-skip-link--custom-class'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      text: 'Skip link',
      attributes: {
        'data-test': 'attribute',
        'aria-label': 'Skip to content'
      }
    }
  }
]
