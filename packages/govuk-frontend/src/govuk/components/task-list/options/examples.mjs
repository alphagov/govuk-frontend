/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      items: [
        {
          title: {
            text: 'Company Directors'
          },
          href: '#',
          status: {
            text: 'Completed'
          }
        },
        {
          title: {
            text: 'Registered company details'
          },
          href: '#',
          status: {
            tag: {
              text: 'Incomplete',
              classes: 'govuk-tag--blue'
            }
          }
        },
        {
          title: {
            text: 'Business plan'
          },
          href: '#',
          status: {
            tag: {
              text: 'Incomplete',
              classes: 'govuk-tag--blue'
            }
          }
        }
      ]
    }
  },
  {
    name: 'example with 3 states',
    options: {
      items: [
        {
          title: {
            text: 'Company Directors'
          },
          href: '#',
          status: {
            text: 'Completed'
          }
        },
        {
          title: {
            text: 'Registered company details'
          },
          href: '#',
          status: {
            tag: {
              text: 'Not started',
              classes: 'govuk-tag--light-blue'
            }
          }
        },
        {
          title: {
            text: 'Business plan'
          },
          href: '#',
          status: {
            tag: {
              text: 'In progress',
              classes: 'govuk-tag--blue'
            }
          }
        },
        {
          title: {
            text: 'Documentation'
          },
          href: '#',
          status: {
            tag: {
              text: 'Not started',
              classes: 'govuk-tag--light-blue'
            }
          }
        }
      ]
    }
  },
  {
    name: 'example with hint text and additional states',
    options: {
      items: [
        {
          title: {
            text: 'Company Directors'
          },
          href: '#',
          status: {
            text: 'Completed'
          }
        },
        {
          title: {
            text: 'Registered company details'
          },
          href: '#',
          status: {
            tag: {
              text: 'Not started',
              classes: 'govuk-tag--light-blue'
            }
          }
        },
        {
          title: {
            text: 'Business plan'
          },
          href: '#',
          hint: {
            text: 'Ensure the plan covers objectives, strategies, sales, marketing and financial forecasts.'
          },
          status: {
            tag: {
              text: 'Review',
              classes: 'govuk-tag--pink'
            }
          }
        },
        {
          title: {
            text: 'Documentation'
          },
          href: '#',
          status: {
            tag: {
              text: 'In progress',
              classes: 'govuk-tag--blue'
            }
          }
        },
        {
          title: {
            text: 'Charitable status'
          },
          href: '#',
          status: {
            tag: {
              text: 'Error',
              classes: 'govuk-tag--red'
            }
          }
        },
        {
          title: {
            text: 'Payment'
          },
          hint: {
            text: 'It will cost between £15 and £75'
          },
          status: {
            text: 'Cannot start yet',
            classes: 'govuk-task-list__status--cannot-start-yet'
          }
        }
      ]
    }
  },
  {
    name: 'example with all possible colours',
    options: {
      items: [
        {
          title: {
            text: 'Task A'
          },
          href: '#',
          status: {
            text: 'Text colour'
          }
        },
        {
          title: {
            text: 'Task B'
          },
          href: '#',
          status: {
            text: 'Secondary text colour',
            classes: 'govuk-task-list__status--cannot-start-yet'
          }
        },
        {
          title: {
            text: 'Task C'
          },
          href: '#',
          status: {
            tag: {
              text: 'Grey',
              classes: 'govuk-tag--grey'
            }
          }
        },
        {
          title: {
            text: 'Task D'
          },
          href: '#',
          status: {
            tag: {
              text: 'Blue',
              classes: 'govuk-tag--blue'
            }
          }
        },
        {
          title: {
            text: 'Task E'
          },
          href: '#',
          status: {
            tag: {
              text: 'Light blue',
              classes: 'govuk-tag--light-blue'
            }
          }
        },
        {
          title: {
            text: 'Task F'
          },
          href: '#',
          status: {
            tag: {
              text: 'Turquoise',
              classes: 'govuk-tag--turquoise'
            }
          }
        },
        {
          title: {
            text: 'Task G'
          },
          href: '#',
          status: {
            tag: {
              text: 'Green',
              classes: 'govuk-tag--green'
            }
          }
        },
        {
          title: {
            text: 'Task H'
          },
          href: '#',
          status: {
            tag: {
              text: 'Purple',
              classes: 'govuk-tag--purple'
            }
          }
        },
        {
          title: {
            text: 'Task I'
          },
          href: '#',
          status: {
            tag: {
              text: 'Pink',
              classes: 'govuk-tag--pink'
            }
          }
        },
        {
          title: {
            text: 'Task J'
          },
          href: '#',
          status: {
            tag: {
              text: 'Red',
              classes: 'govuk-tag--red'
            }
          }
        },
        {
          title: {
            text: 'Task K'
          },
          href: '#',
          status: {
            tag: {
              text: 'Orange',
              classes: 'govuk-tag--orange'
            }
          }
        },
        {
          title: {
            text: 'Task L'
          },
          href: '#',
          status: {
            tag: {
              text: 'Yellow',
              classes: 'govuk-tag--yellow'
            }
          }
        }
      ]
    }
  },
  {
    name: 'example with very long single word tags',
    options: {
      items: [
        {
          title: {
            text: 'Company Directors'
          },
          href: '#',
          status: {
            text: 'Completed'
          }
        },
        {
          title: {
            text: 'Registered company details'
          },
          href: '#',
          status: {
            tag: {
              text: 'Incomplete',
              classes: 'govuk-tag--blue'
            }
          }
        },
        {
          title: {
            text: 'A very very very long Business plan'
          },
          href: '#',
          status: {
            tag: {
              text: 'Thisisaverylongwaytosaythatsomethingisincomplete',
              classes: 'govuk-tag--blue'
            }
          }
        }
      ]
    }
  },
  {
    name: 'custom classes',
    hidden: true,
    options: {
      classes: 'custom-class-on-component',
      items: [
        {
          title: {
            text: 'A Link',
            classes: 'custom-class-on-linked-title'
          },
          href: '#',
          classes: 'custom-class-on-task',
          status: {
            classes: 'custom-class-on-status',
            tag: {
              text: 'Status',
              classes: 'custom-class-on-tag'
            }
          }
        },
        {
          title: {
            text: 'Not a link',
            classes: 'custom-class-on-unlinked-title'
          },
          status: {
            tag: {
              text: 'Status'
            }
          }
        }
      ]
    }
  },
  {
    name: 'custom attributes',
    hidden: true,
    options: {
      attributes: {
        'data-custom-attribute': 'custom-value'
      },
      items: [
        {
          title: {
            text: 'A Link'
          },
          href: '#',
          status: {
            tag: {
              text: 'Status',
              attributes: {
                'data-tag-attribute': 'tag-value'
              }
            }
          }
        }
      ]
    }
  },
  {
    name: 'custom id prefix',
    hidden: true,
    options: {
      idPrefix: 'my-custom-id',
      items: [
        {
          title: {
            text: 'A Link'
          },
          hint: {
            text: 'Hint text'
          },
          href: '#',
          status: {
            tag: {
              text: 'Status'
            }
          }
        }
      ]
    }
  },
  {
    name: 'html passed as text',
    hidden: true,
    options: {
      idPrefix: 'my-custom-id',
      items: [
        {
          title: {
            text: '<strong>Linked Title</strong>'
          },
          hint: {
            text: '<strong>Hint</strong>'
          },
          href: '#',
          status: {
            text: '<strong>Status</strong>'
          }
        },
        {
          title: {
            text: '<strong>Unlinked Title</strong>'
          },
          status: {
            tag: {
              text: '<strong>Tag</strong>'
            }
          }
        }
      ]
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      idPrefix: 'my-custom-id',
      items: [
        {
          title: {
            html: '<strong>Linked Title</strong>'
          },
          hint: {
            html: '<strong>Hint</strong>'
          },
          href: '#',
          status: {
            html: '<strong>Status</strong>'
          }
        },
        {
          title: {
            html: '<strong>Unlinked Title</strong>'
          },
          status: {
            tag: {
              html: '<strong>Tag</strong>'
            }
          }
        }
      ]
    }
  }
]
