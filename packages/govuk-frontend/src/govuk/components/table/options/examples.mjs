/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      rows: [
        [
          {
            text: 'January'
          },
          {
            text: '£85',
            format: 'numeric'
          },
          {
            text: '£95',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'February'
          },
          {
            text: '£75',
            format: 'numeric'
          },
          {
            text: '£55',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'March'
          },
          {
            text: '£165',
            format: 'numeric'
          },
          {
            text: '£125',
            format: 'numeric'
          }
        ]
      ]
    }
  },
  {
    name: 'table with head',
    options: {
      head: [
        {
          text: 'Month you apply'
        },
        {
          text: 'Rate for bicycles',
          format: 'numeric'
        },
        {
          text: 'Rate for vehicles',
          format: 'numeric'
        }
      ],
      rows: [
        [
          {
            text: 'January'
          },
          {
            text: '£85',
            format: 'numeric'
          },
          {
            text: '£95',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'February'
          },
          {
            text: '£75',
            format: 'numeric'
          },
          {
            text: '£55',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'March'
          },
          {
            text: '£165',
            format: 'numeric'
          },
          {
            text: '£125',
            format: 'numeric'
          }
        ]
      ]
    }
  },
  {
    name: 'table with head and caption',
    options: {
      caption: 'Caption 1: Months and rates',
      captionClasses: 'govuk-table__caption--m',
      firstCellIsHeader: true,
      head: [
        {
          text: 'Month you apply'
        },
        {
          text: 'Rate for bicycles',
          format: 'numeric'
        },
        {
          text: 'Rate for vehicles',
          format: 'numeric'
        }
      ],
      rows: [
        [
          {
            text: 'January'
          },
          {
            text: '£85',
            format: 'numeric'
          },
          {
            text: '£95',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'February'
          },
          {
            text: '£75',
            format: 'numeric'
          },
          {
            text: '£55',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'March'
          },
          {
            text: '£165',
            format: 'numeric'
          },
          {
            text: '£125',
            format: 'numeric'
          }
        ]
      ]
    }
  },
  {
    name: 'with small text modifier for tables with a lot of data',
    options: {
      classes: 'govuk-table--small-text-until-tablet',
      rows: [
        [
          {
            text: 'January'
          },
          {
            text: '£85',
            format: 'numeric'
          },
          {
            text: '£95',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'February'
          },
          {
            text: '£75',
            format: 'numeric'
          },
          {
            text: '£55',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'March'
          },
          {
            text: '£165',
            format: 'numeric'
          },
          {
            text: '£125',
            format: 'numeric'
          }
        ]
      ]
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      classes: 'custom-class-goes-here',
      rows: [
        [
          {
            text: 'Jan'
          },
          {
            text: 'Feb'
          }
        ]
      ]
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      attributes: {
        'data-foo': 'bar'
      },
      rows: [
        [
          {
            text: 'Jan'
          },
          {
            text: 'Feb'
          }
        ]
      ]
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      head: [
        {
          text: 'Foo <script>hacking.do(1337)</script>'
        }
      ],
      rows: [
        [
          {
            text: 'Foo <script>hacking.do(1337)</script>'
          }
        ]
      ]
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      head: [
        {
          html: 'Foo <span>bar</span>'
        }
      ],
      rows: [
        [
          {
            html: 'Foo <span>bar</span>'
          }
        ]
      ]
    }
  },
  {
    name: 'head with classes',
    hidden: true,
    options: {
      head: [
        {
          text: 'Foo',
          classes: 'my-custom-class'
        }
      ],
      rows: [
        [
          {
            text: 'Jan'
          },
          {
            text: 'Feb'
          }
        ]
      ]
    }
  },
  {
    name: 'head with rowspan and colspan',
    hidden: true,
    options: {
      head: [
        {
          text: 'Foo',
          rowspan: 2,
          colspan: 2
        }
      ],
      rows: [
        [
          {
            text: 'Jan'
          },
          {
            text: 'Feb'
          }
        ]
      ]
    }
  },
  {
    name: 'head with attributes',
    hidden: true,
    options: {
      head: [
        {
          text: 'Foo',
          attributes: {
            'data-fizz': 'buzz'
          }
        }
      ],
      rows: [
        [
          {
            text: 'Jan'
          },
          {
            text: 'Feb'
          }
        ]
      ]
    }
  },
  {
    name: 'with firstCellIsHeader true',
    hidden: true,
    options: {
      firstCellIsHeader: true,
      rows: [
        [
          {
            text: 'January'
          },
          {
            text: '£85',
            format: 'numeric'
          },
          {
            text: '£95',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'February'
          },
          {
            text: '£75',
            format: 'numeric'
          },
          {
            text: '£55',
            format: 'numeric'
          }
        ],
        [
          {
            text: 'March'
          },
          {
            text: '£165',
            format: 'numeric'
          },
          {
            text: '£125',
            format: 'numeric'
          }
        ]
      ]
    }
  },
  {
    name: 'firstCellIsHeader with classes',
    hidden: true,
    options: {
      firstCellIsHeader: true,
      rows: [
        [
          {
            text: 'Foo',
            classes: 'my-custom-class'
          }
        ]
      ]
    }
  },
  {
    name: 'firstCellIsHeader with html',
    hidden: true,
    options: {
      firstCellIsHeader: true,
      rows: [
        [
          {
            html: 'Foo <span>bar</span>'
          }
        ]
      ]
    }
  },
  {
    name: 'firstCellIsHeader with html as text',
    hidden: true,
    options: {
      firstCellIsHeader: true,
      rows: [
        [
          {
            text: 'Foo <script>hacking.do(1337)</script>'
          }
        ]
      ]
    }
  },
  {
    name: 'firstCellIsHeader with rowspan and colspan',
    hidden: true,
    options: {
      firstCellIsHeader: true,
      rows: [
        [
          {
            text: 'Foo',
            rowspan: 2,
            colspan: 2
          }
        ]
      ]
    }
  },
  {
    name: 'firstCellIsHeader with attributes',
    hidden: true,
    options: {
      firstCellIsHeader: true,
      rows: [
        [
          {
            text: 'Foo',
            attributes: {
              'data-fizz': 'buzz'
            }
          }
        ]
      ]
    }
  },
  {
    name: 'with falsey items',
    hidden: true,
    options: {
      rows: [
        [
          {
            text: 'A'
          },
          {
            text: 1
          }
        ],
        false,
        null,
        [
          {
            text: 'B'
          },
          {
            text: 2
          }
        ],
        [
          {
            text: 'C'
          },
          {
            text: 3
          }
        ]
      ]
    }
  },
  {
    name: 'rows with classes',
    hidden: true,
    options: {
      rows: [
        [
          {
            text: 'Foo',
            classes: 'my-custom-class'
          }
        ]
      ]
    }
  },
  {
    name: 'rows with rowspan and colspan',
    hidden: true,
    options: {
      rows: [
        [
          {
            text: 'Foo',
            rowspan: 2,
            colspan: 2
          }
        ]
      ]
    }
  },
  {
    name: 'rows with attributes',
    hidden: true,
    options: {
      rows: [
        [
          {
            text: 'Foo',
            attributes: {
              'data-fizz': 'buzz'
            }
          }
        ]
      ]
    }
  }
]
