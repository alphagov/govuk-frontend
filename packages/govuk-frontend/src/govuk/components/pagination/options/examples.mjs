/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      previous: {
        href: '/previous'
      },
      next: {
        href: '/next'
      },
      items: [
        {
          number: 1,
          href: '/page/1'
        },
        {
          number: 2,
          href: '/page/2',
          current: true
        },
        {
          number: 3,
          href: '/page/3'
        }
      ]
    }
  },
  {
    name: 'with custom navigation landmark',
    options: {
      previous: {
        href: '/previous'
      },
      next: {
        href: '/next'
      },
      landmarkLabel: 'search',
      items: [
        {
          number: 1,
          href: '/page/1'
        },
        {
          number: 2,
          href: '/page/2',
          current: true
        },
        {
          number: 3,
          href: '/page/3'
        }
      ]
    }
  },
  {
    name: 'with custom link and item text',
    options: {
      previous: {
        href: '/previous',
        text: 'Previous page'
      },
      next: {
        href: '/next',
        text: 'Next page'
      },
      items: [
        {
          number: 'one',
          href: '/page/1'
        },
        {
          number: 'two',
          href: '/page/2',
          current: true
        },
        {
          number: 'three',
          href: '/page/3'
        }
      ]
    }
  },
  {
    name: 'with custom accessible labels on item links',
    options: {
      previous: {
        href: '/previous'
      },
      next: {
        href: '/next'
      },
      items: [
        {
          number: 1,
          href: '/page/1',
          visuallyHiddenText: '1st page'
        },
        {
          number: 2,
          href: '/page/2',
          current: true,
          visuallyHiddenText: '2nd page (you are currently on this page)'
        },
        {
          number: 3,
          href: '/page/3',
          visuallyHiddenText: '3rd page'
        }
      ]
    }
  },
  {
    name: 'with many pages',
    options: {
      previous: {
        href: '/previous'
      },
      next: {
        href: '/next'
      },
      items: [
        {
          number: 1,
          href: '/page/1'
        },
        {
          ellipsis: true
        },
        {
          number: 8,
          href: '/page/8'
        },
        {
          number: 9,
          href: '/page/9'
        },
        {
          number: 10,
          href: '/page/10',
          current: true
        },
        {
          number: 11,
          href: '/page/11'
        },
        {
          number: 12,
          href: '/page/12'
        },
        {
          ellipsis: true
        },
        {
          number: 40,
          href: '/page/40'
        }
      ]
    }
  },
  {
    name: 'first page',
    options: {
      next: {
        href: '/next'
      },
      items: [
        {
          number: 1,
          href: '/page/1',
          current: true
        },
        {
          number: 2,
          href: '/page/2'
        },
        {
          number: 3,
          href: '/page/3'
        }
      ]
    }
  },
  {
    name: 'last page',
    options: {
      previous: {
        href: '/previous'
      },
      items: [
        {
          number: 1,
          href: '/page/1'
        },
        {
          number: 2,
          href: '/page/2'
        },
        {
          number: 3,
          href: '/page/3',
          current: true
        }
      ]
    }
  },
  {
    name: 'with prev and next only',
    options: {
      previous: {
        href: '/previous'
      },
      next: {
        href: '/next'
      }
    }
  },
  {
    name: 'with prev and next only and labels',
    options: {
      previous: {
        text: 'Previous page',
        labelText: 'Paying VAT and duty',
        href: '/previous'
      },
      next: {
        text: 'Next page',
        labelText: 'Registering an imported vehicle',
        href: '/next'
      }
    }
  },
  {
    name: 'with prev and next only and very long labels',
    options: {
      previous: {
        text: 'Previous page',
        labelText:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        href: '/previous'
      },
      next: {
        text: 'Next page',
        labelText:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        href: '/next'
      }
    }
  },
  {
    name: 'with prev and next only in a different language',
    options: {
      previous: {
        text: 'précédente',
        href: '/previous'
      },
      next: {
        text: 'suivante',
        href: '/next'
      }
    }
  },
  {
    name: 'with previous only',
    options: {
      previous: {
        href: '/previous'
      }
    }
  },
  {
    name: 'with next only',
    options: {
      next: {
        href: '/next'
      }
    }
  },
  {
    name: 'with custom classes',
    hidden: true,
    options: {
      classes: 'my-custom-class',
      previous: {
        href: '/previous'
      },
      next: {
        href: '/next'
      },
      items: [
        {
          number: 1,
          href: '/page/1'
        },
        {
          number: 2,
          href: '/page/2',
          current: true
        },
        {
          number: 3,
          href: '/page/3'
        }
      ]
    }
  },
  {
    name: 'with custom attributes',
    hidden: true,
    options: {
      attributes: {
        'data-attribute-1': 'value-1',
        'data-attribute-2': 'value-2'
      },
      previous: {
        href: '/previous'
      },
      next: {
        href: '/next'
      },
      items: [
        {
          number: 1,
          href: '/page/1'
        },
        {
          number: 2,
          href: '/page/2',
          current: true
        },
        {
          number: 3,
          href: '/page/3'
        }
      ]
    }
  }
]
