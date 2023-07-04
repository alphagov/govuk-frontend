/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {BreadcrumbsExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      items: [
        {
          text: 'Section',
          href: '/section'
        },
        {
          text: 'Sub-section',
          href: '/section/sub-section'
        }
      ]
    }
  },
  {
    name: 'with one level',
    options: {
      items: [
        {
          text: 'Section',
          href: '/section'
        }
      ]
    }
  },
  {
    name: 'with multiple levels',
    options: {
      items: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Section',
          href: '/section'
        },
        {
          text: 'Sub-section',
          href: '/section/sub-section'
        },
        {
          text: 'Sub Sub-section',
          href: '/section/sub-section/sub-sub-section'
        }
      ]
    }
  },
  {
    name: 'without the home section',
    options: {
      items: [
        {
          text: 'Service Manual',
          href: '/service-manual'
        },
        {
          text: 'Agile Delivery',
          href: '/service-manual/agile-delivery'
        }
      ]
    }
  },
  {
    name: 'with last breadcrumb as current page',
    options: {
      items: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Passports, travel and living abroad',
          href: '/browse/abroad'
        },
        {
          text: 'Travel abroad'
        }
      ]
    }
  },
  {
    name: 'with collapse on mobile',
    options: {
      collapseOnMobile: true,
      items: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Education, training and skills',
          href: '/education'
        },
        {
          text: 'Special educational needs and disability (SEND) and high needs',
          href: '/education/special-educational-needs-and-disability-send-and-high-needs'
        }
      ]
    }
  },
  {
    name: 'inverse',
    description: 'Breadcrumbs that appear on dark backgrounds',
    previewLayoutModifiers: ['inverse'],
    options: {
      classes: 'govuk-breadcrumbs--inverse',
      items: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Passports, travel and living abroad',
          href: '/browse/abroad'
        },
        {
          text: 'Travel abroad'
        }
      ]
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      classes: 'app-breadcrumbs--custom-modifier',
      items: [
        {
          text: 'Home'
        }
      ]
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      attributes: {
        id: 'my-navigation',
        role: 'navigation'
      },
      items: [
        {
          text: 'Home'
        }
      ]
    }
  },
  {
    name: 'item attributes',
    hidden: true,
    options: {
      items: [
        {
          text: 'Section 1',
          href: '/section',
          attributes: {
            'data-attribute': 'my-attribute',
            'data-attribute-2': 'my-attribute-2'
          }
        }
      ]
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      items: [
        {
          text: '<span>Section 1</span>'
        }
      ]
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      items: [
        {
          html: '<em>Section 1</em>'
        },
        {
          html: '<em>Section 2</em>',
          href: '/section-2'
        }
      ]
    }
  }
]

/**
 * @typedef {import('../macro.mjs').BreadcrumbsOptions} BreadcrumbsOptions
 * @typedef {Omit<ComponentExample, 'options'> & { options: BreadcrumbsOptions }} BreadcrumbsExample
 * @typedef {import('@govuk-frontend/lib/components').ComponentExample} ComponentExample
 */
