/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {AccordionExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      id: 'default-example',
      items: [
        {
          heading: {
            text: 'Section A'
          },
          content: {
            text: 'We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.'
          }
        },
        {
          heading: {
            text: 'Section B'
          },
          content: {
            html:
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 2</li>\n' +
              '</ul>\n'
          }
        }
      ]
    }
  },
  {
    name: 'with additional descriptions',
    options: {
      id: 'with-descriptions',
      items: [
        {
          heading: {
            text: 'Test'
          },
          summary: {
            text: 'Additional description'
          },
          content: {
            html:
              '<p class="govuk-body">\n' +
              '  We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.\n' +
              '</p>\n' +
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 1</li>\n' +
              '</ul>\n'
          }
        },
        {
          heading: {
            text: 'Test 2'
          },
          summary: {
            html: '<span class="govuk-!-font-weight-regular">Additional description (wrapped in span)</span>'
          },
          content: {
            html:
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 2</li>\n' +
              '</ul>\n'
          }
        }
      ]
    }
  },
  {
    name: 'with long content and description',
    options: {
      id: 'with-long-content-and-description',
      items: [
        {
          heading: {
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc quis tortor porttitor.'
          },
          summary: {
            text: 'Etiam diam dui, tempus ut pharetra in, aliquet non dui. Nunc pulvinar maximus tortor, ac finibus augue congue vitae. Donec sed cursus lorem.'
          },
          content: {
            html:
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 1</li>\n' +
              '</ul>\n'
          }
        },
        {
          heading: {
            text: 'Praesent faucibus leo feugiat libero pharetra lacinia. Aliquam aliquet ante vitae mollis vestibulum.'
          },
          summary: {
            html: '<span class="govuk-!-font-weight-regular">Maecenas nec <abbr>est</abbr> sapien. Etiam varius luctus mauris non porttitor. </span>'
          },
          content: {
            html:
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 2</li>\n' +
              '</ul>\n'
          }
        }
      ]
    }
  },
  {
    name: 'with one section open',
    options: {
      id: 'one-section-open-example',
      items: [
        {
          heading: {
            text: 'Section A'
          },
          expanded: true,
          content: {
            html:
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 1</li>\n' +
              '</ul>\n'
          }
        },
        {
          heading: {
            text: 'Section B'
          },
          content: {
            html:
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 2</li>\n' +
              '</ul>\n'
          }
        }
      ]
    }
  },
  {
    name: 'with all sections already open',
    options: {
      id: 'all-sections-open-example',
      items: [
        {
          heading: {
            text: 'Section A'
          },
          expanded: true,
          content: {
            html:
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 1</li>\n' +
              '</ul>\n'
          }
        },
        {
          heading: {
            text: 'Section B'
          },
          expanded: true,
          content: {
            html:
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 2</li>\n' +
              '</ul>\n'
          }
        }
      ]
    }
  },
  {
    name: 'with focusable elements inside',
    options: {
      id: 'with-focusable-elements',
      items: [
        {
          heading: {
            text: 'Section A'
          },
          content: {
            html: '<a class="govuk-link" href="#">Link A</a>'
          }
        },
        {
          heading: {
            text: 'Section B'
          },
          content: {
            html: '<a class="govuk-link" href="#">Link B</a>'
          }
        }
      ]
    }
  },
  {
    name: 'with translations',
    options: {
      id: 'with-translations',
      hideAllSectionsText: 'Collapse all sections',
      showAllSectionsText: 'Expand all sections',
      hideSectionText: 'Collapse',
      hideSectionAriaLabelText: 'Collapse this section',
      showSectionText: 'Expand',
      showSectionAriaLabelText: 'Expand this section',
      items: [
        {
          heading: {
            text: 'Section A'
          },
          content: {
            text: 'We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.'
          }
        },
        {
          heading: {
            text: 'Section B'
          },
          content: {
            html:
              '<ul class="govuk-list govuk-list--bullet">\n' +
              '  <li>Example item 2</li>\n' +
              '</ul>\n'
          }
        }
      ]
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      id: 'accordion-classes',
      classes: 'myClass',
      items: [
        {
          heading: {
            text: 'Section A'
          },
          content: {
            text: 'Some content'
          }
        }
      ]
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      id: 'accordion-attributes',
      attributes: {
        'data-attribute': 'value'
      },
      items: [
        {
          heading: {
            text: 'Section A'
          },
          content: {
            text: 'Some content'
          }
        }
      ]
    }
  },
  {
    name: 'custom heading level',
    hidden: true,
    options: {
      id: 'accordion-heading',
      headingLevel: 3,
      items: [
        {
          heading: {
            text: 'Section A'
          },
          content: {
            text: 'Some content'
          }
        }
      ]
    }
  },
  {
    name: 'heading html',
    hidden: true,
    options: {
      id: 'accordion-heading-html',
      items: [
        {
          heading: {
            html: '<span class="myClass">Section A</span>'
          },
          content: {
            text: 'Some content'
          }
        }
      ]
    }
  },
  {
    name: 'with falsey values',
    hidden: true,
    options: {
      id: 'accordion-falsey',
      items: [
        {
          heading: {
            text: 'Section A'
          },
          content: {
            text: 'Some content'
          }
        },
        // @ts-expect-error Falsy item for tests
        false,
        // @ts-expect-error Falsy item for tests
        '',
        null,
        {
          heading: {
            text: 'Section B'
          },
          content: {
            text: 'Some content'
          }
        }
      ]
    }
  },
  {
    name: 'with remember expanded off',
    hidden: true,
    options: {
      id: 'accordion-remember-expanded-off',
      rememberExpanded: false,
      items: [
        {
          heading: {
            text: 'Section A'
          },
          content: {
            text: 'Some content'
          }
        }
      ]
    }
  }
]

/**
 * @typedef {import('../macro.mjs').AccordionOptions} AccordionOptions
 * @typedef {Omit<ComponentExample, 'options'> & { options: AccordionOptions }} AccordionExample
 * @typedef {import('@govuk-frontend/lib/components').ComponentExample} ComponentExample
 */
