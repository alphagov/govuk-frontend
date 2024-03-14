/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {}
  },
  {
    name: 'with custom HTML content licence and copyright notice',
    description:
      'Open Government Licence and Crown copyright notice translated into Welsh',
    options: {
      contentLicence: {
        html: 'Mae’r holl gynnwys ar gael dan <a class="govuk-footer__link" href="https://www.nationalarchives.gov.uk/doc/open-government-licence-cymraeg/version/3/" rel="license">Drwydded y Llywodraeth Agored v3.0</a>, ac eithrio lle nodir yn wahanol'
      },
      copyright: {
        html: '<span>Hawlfraint y Goron</span>'
      }
    }
  },
  {
    name: 'with custom text content licence and copyright notice',
    description:
      'Open Government Licence and Crown copyright notice translated into Welsh',
    options: {
      contentLicence: {
        text: 'Mae’r holl gynnwys ar gael dan Drwydded y Llywodraeth Agored v3.0, ac eithrio lle nodir yn wahanol'
      },
      copyright: {
        text: '© Hawlfraint y Goron'
      }
    }
  },
  {
    name: 'with meta',
    description:
      'Secondary navigation with meta information relating to the site',
    options: {
      meta: {
        visuallyHiddenTitle: 'Items',
        items: [
          {
            href: '#1',
            text: 'Item 1'
          },
          {
            href: '#2',
            text: 'Item 2'
          },
          {
            href: '#3',
            text: 'Item 3'
          }
        ]
      }
    }
  },
  {
    name: 'with custom meta',
    description: 'Custom meta section',
    options: {
      meta: {
        text: 'GOV.UK Prototype Kit v7.0.1'
      }
    }
  },
  {
    name: 'with meta links and meta content',
    description: 'Secondary navigation links and custom meta text',
    options: {
      meta: {
        items: [
          {
            href: '#1',
            text: 'Bibendum Ornare'
          },
          {
            href: '#2',
            text: 'Nullam'
          },
          {
            href: '#3',
            text: 'Tortor Fringilla'
          },
          {
            href: '#4',
            text: 'Tellus'
          },
          {
            href: '#5',
            text: 'Egestas Nullam'
          },
          {
            href: '#6',
            text: 'Euismod Etiam'
          },
          {
            href: '#7',
            text: 'Fusce Sollicitudin'
          },
          {
            href: '#8',
            text: 'Ligula Nullam Ultricies'
          }
        ],
        html: 'Built by the <a href="#" class="govuk-footer__link">Department of Magical Law Enforcement</a>'
      }
    }
  },
  {
    name: 'with custom meta',
    description: 'Custom meta section',
    options: {
      meta: {
        text: 'GOV.UK Prototype Kit v7.0.1'
      }
    }
  },
  {
    name: 'with default width navigation (one column)',
    options: {
      navigation: [
        {
          title: 'Navigation section',
          items: [
            {
              href: '#1',
              text: 'Navigation item 1'
            },
            {
              href: '#2',
              text: 'Navigation item 2'
            },
            {
              href: '#3',
              text: 'Navigation item 3'
            },
            {
              href: '#4',
              text: 'Navigation item 4'
            },
            {
              href: '#5',
              text: 'Navigation item 5'
            },
            {
              href: '#6',
              text: 'Navigation item 6'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'with default width navigation (two columns)',
    options: {
      navigation: [
        {
          title: 'Navigation section',
          columns: 2,
          items: [
            {
              href: '#1',
              text: 'Navigation item 1'
            },
            {
              href: '#2',
              text: 'Navigation item 2'
            },
            {
              href: '#3',
              text: 'Navigation item 3'
            },
            {
              href: '#4',
              text: 'Navigation item 4'
            },
            {
              href: '#5',
              text: 'Navigation item 5'
            },
            {
              href: '#6',
              text: 'Navigation item 6'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'with navigation',
    options: {
      navigation: [
        {
          title: 'Two column list',
          width: 'two-thirds',
          columns: 2,
          items: [
            {
              href: '#1',
              text: 'Navigation item 1'
            },
            {
              href: '#2',
              text: 'Navigation item 2'
            },
            {
              href: '#3',
              text: 'Navigation item 3'
            },
            {
              href: '#4',
              text: 'Navigation item 4'
            },
            {
              href: '#5',
              text: 'Navigation item 5'
            },
            {
              href: '#6',
              text: 'Navigation item 6'
            }
          ]
        },
        {
          title: 'Single column list',
          width: 'one-third',
          items: [
            {
              href: '#1',
              text: 'Navigation item 1'
            },
            {
              href: '#2',
              text: 'Navigation item 2'
            },
            {
              href: '#3',
              text: 'Navigation item 3'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'Full GDS example',
    description: "A full example based on GOV.UK's current footer",
    options: {
      navigation: [
        {
          title: 'Coronavirus (COVID-19)',
          width: 'two-thirds',
          items: [
            {
              href: '/coronavirus',
              text: 'Coronavirus (COVID-19): guidance and support'
            }
          ]
        },
        {
          title: 'Brexit',
          width: 'one-third',
          items: [
            {
              href: '/brexit',
              text: 'Check what you need to do'
            }
          ]
        },
        {
          title: 'Services and information',
          width: 'two-thirds',
          columns: 2,
          items: [
            {
              href: '/browse/benefits',
              text: 'Benefits'
            },
            {
              href: '/browse/births-deaths-marriages',
              text: 'Births, deaths, marriages and care'
            },
            {
              href: '/browse/business',
              text: 'Business and self-employed'
            },
            {
              href: '/browse/childcare-parenting',
              text: 'Childcare and parenting'
            },
            {
              href: '/browse/citizenship',
              text: 'Citizenship and living in the UK'
            },
            {
              href: '/browse/justice',
              text: 'Crime, justice and the law'
            },
            {
              href: '/browse/disabilities',
              text: 'Disabled people'
            },
            {
              href: '/browse/driving',
              text: 'Driving and transport'
            },
            {
              href: '/browse/education',
              text: 'Education and learning'
            },
            {
              href: '/browse/employing-people',
              text: 'Employing people'
            },
            {
              href: '/browse/environment-countryside',
              text: 'Environment and countryside'
            },
            {
              href: '/browse/housing-local-services',
              text: 'Housing and local services'
            },
            {
              href: '/browse/tax',
              text: 'Money and tax'
            },
            {
              href: '/browse/abroad',
              text: 'Passports, travel and living abroad'
            },
            {
              href: '/browse/visas-immigration',
              text: 'Visas and immigration'
            },
            {
              href: '/browse/working',
              text: 'Working, jobs and pensions'
            }
          ]
        },
        {
          title: 'Departments and policy',
          width: 'one-third',
          items: [
            {
              href: '/government/how-government-works',
              text: 'How government works'
            },
            {
              href: '/government/organisations',
              text: 'Departments'
            },
            {
              href: '/world',
              text: 'Worldwide'
            },
            {
              href: '/government/policies',
              text: 'Policies'
            },
            {
              href: '/government/publications',
              text: 'Publications'
            },
            {
              href: '/government/announcements',
              text: 'Announcements'
            }
          ]
        }
      ],
      meta: {
        items: [
          {
            href: '/help',
            text: 'Help'
          },
          {
            href: '/help/cookies',
            text: 'Cookies'
          },
          {
            href: '/contact',
            text: 'Contact'
          },
          {
            href: '/help/terms-conditions',
            text: 'Terms and conditions'
          },
          {
            href: '/cymraeg',
            text: 'Rhestr o Wasanaethau Cymraeg'
          }
        ],
        html: 'Built by the <a class="govuk-footer__link" href="#">Government Digital Service</a>'
      }
    }
  },
  {
    name: 'Three equal columns',
    description: 'A full example to demonstrate three equal width columns',
    options: {
      navigation: [
        {
          title: 'Single column list 1',
          width: 'one-third',
          columns: 1,
          items: [
            {
              href: '#1',
              text: 'Navigation item 1'
            },
            {
              href: '#2',
              text: 'Navigation item 2'
            },
            {
              href: '#3',
              text: 'Navigation item 3'
            },
            {
              href: '#4',
              text: 'Navigation item 4'
            },
            {
              href: '#5',
              text: 'Navigation item 5'
            },
            {
              href: '#6',
              text: 'Navigation item 6'
            }
          ]
        },
        {
          title: 'Single column list 2',
          width: 'one-third',
          columns: 1,
          items: [
            {
              href: '#1',
              text: 'Navigation item 1'
            },
            {
              href: '#2',
              text: 'Navigation item 2'
            },
            {
              href: '#3',
              text: 'Navigation item 3'
            },
            {
              href: '#4',
              text: 'Navigation item 4'
            },
            {
              href: '#5',
              text: 'Navigation item 5'
            },
            {
              href: '#6',
              text: 'Navigation item 6'
            }
          ]
        },
        {
          title: 'Single column list 3',
          width: 'one-third',
          columns: 1,
          items: [
            {
              href: '#1',
              text: 'Navigation item 1'
            },
            {
              href: '#2',
              text: 'Navigation item 2'
            },
            {
              href: '#3',
              text: 'Navigation item 3'
            },
            {
              href: '#4',
              text: 'Navigation item 4'
            },
            {
              href: '#5',
              text: 'Navigation item 5'
            },
            {
              href: '#6',
              text: 'Navigation item 6'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      attributes: {
        'data-test-attribute': 'value',
        'data-test-attribute-2': 'value-2'
      }
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      classes: 'app-footer--custom-modifier'
    }
  },
  {
    name: 'with container classes',
    hidden: true,
    options: {
      containerClasses: 'app-width-container'
    }
  },
  {
    name: 'with HTML passed as text content',
    hidden: true,
    options: {
      contentLicence: {
        text: 'Mae’r holl gynnwys ar gael dan <a class="govuk-footer__link" href="https://www.nationalarchives.gov.uk/doc/open-government-licence-cymraeg/version/3/" rel="license">Drwydded y Llywodraeth Agored v3.0</a>, ac eithrio lle nodir yn wahanol'
      },
      copyright: {
        text: '<span>Hawlfraint y Goron</span>'
      }
    }
  },
  {
    name: 'with empty meta',
    hidden: true,
    options: {
      meta: {}
    }
  },
  {
    name: 'with empty meta items',
    hidden: true,
    options: {
      meta: {
        items: []
      }
    }
  },
  {
    name: 'meta html as text',
    hidden: true,
    options: {
      meta: {
        text: 'GOV.UK Prototype Kit <strong>v7.0.1</strong>'
      }
    }
  },
  {
    name: 'with meta html',
    hidden: true,
    options: {
      meta: {
        html: 'GOV.UK Prototype Kit <strong>v7.0.1</strong>'
      }
    }
  },
  {
    name: 'with meta item attributes',
    hidden: true,
    options: {
      meta: {
        items: [
          {
            href: '#1',
            text: 'meta item 1',
            attributes: {
              'data-attribute': 'my-attribute',
              'data-attribute-2': 'my-attribute-2'
            }
          }
        ]
      }
    }
  },
  {
    name: 'with empty navigation',
    hidden: true,
    options: {
      navigation: []
    }
  },
  {
    name: 'with navigation item attributes',
    hidden: true,
    options: {
      navigation: [
        {
          title: 'Single column list 1',
          items: [
            {
              href: '#1',
              text: 'Navigation item 1',
              attributes: {
                'data-attribute': 'my-attribute',
                'data-attribute-2': 'my-attribute-2'
              }
            }
          ]
        }
      ]
    }
  }
]
