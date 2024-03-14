/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      messages: [
        {
          headingText: 'Cookies on this government service',
          text: 'We use analytics cookies to help understand how users use our service.',
          actions: [
            {
              text: 'Accept analytics cookies',
              type: 'submit',
              name: 'cookies',
              value: 'accept'
            },
            {
              text: 'Reject analytics cookies',
              type: 'submit',
              name: 'cookies',
              value: 'reject'
            },
            {
              text: 'View cookie preferences',
              href: '/cookie-preferences'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'accepted confirmation banner',
    options: {
      messages: [
        {
          text: 'Your cookie preferences have been saved. You have accepted cookies.',
          role: 'alert',
          actions: [
            {
              text: 'Hide cookie message',
              type: 'button'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'rejected confirmation banner',
    options: {
      messages: [
        {
          text: 'Your cookie preferences have been saved. You have rejected cookies.',
          role: 'alert',
          actions: [
            {
              text: 'Hide cookie message',
              type: 'button'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'client-side implementation',
    options: {
      messages: [
        {
          headingText: 'Cookies on this service',
          text: 'We use cookies to help understand how users use our service.',
          actions: [
            {
              text: 'Accept analytics cookies',
              type: 'submit',
              name: 'cookies',
              value: 'accept'
            },
            {
              text: 'Reject analytics cookies',
              type: 'submit',
              name: 'cookies',
              value: 'reject'
            },
            {
              text: 'View cookie preferences',
              href: '/cookie-preferences'
            }
          ]
        },
        {
          text: 'Your cookie preferences have been saved. You have accepted cookies.',
          role: 'alert',
          hidden: true,
          actions: [
            {
              text: 'Hide cookie message',
              type: 'button'
            }
          ]
        },
        {
          text: 'Your cookie preferences have been saved. You have rejected cookies.',
          role: 'alert',
          hidden: true,
          actions: [
            {
              text: 'Hide cookie message',
              type: 'button'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'with html',
    options: {
      messages: [
        {
          headingHtml: 'Cookies on <span>my service</span>',
          html:
            '<p class="govuk-body">We use cookies in <span>our service</span>.</p>\n' +
            '<p class="govuk-body">We’d like to use analytics cookies so we can understand how you use the Design System and make improvements.</p>\n',
          actions: [
            {
              text: 'Accept analytics cookies',
              type: 'submit',
              name: 'cookies',
              value: 'accept'
            },
            {
              text: 'Reject analytics cookies',
              type: 'submit',
              name: 'cookies',
              value: 'reject'
            },
            {
              text: 'View cookie preferences',
              href: '/cookie-preferences'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'heading html',
    hidden: true,
    options: {
      messages: [
        {
          headingHtml: 'Cookies on <span>my service</span>'
        }
      ]
    }
  },
  {
    name: 'heading html as text',
    hidden: true,
    options: {
      messages: [
        {
          headingText: 'Cookies on <span>my service</span>'
        }
      ]
    }
  },
  {
    name: 'html',
    hidden: true,
    options: {
      messages: [
        {
          html: '<p class="govuk-body">We use cookies in <span>our service</span>.</p>'
        }
      ]
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      messages: [
        {
          classes: 'app-my-class'
        }
      ]
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      messages: [
        {
          attributes: {
            'data-attribute': 'my-value'
          }
        }
      ]
    }
  },
  {
    name: 'custom aria label',
    hidden: true,
    options: {
      ariaLabel: 'Cookies on GOV.UK',
      messages: [
        {
          text: 'We use cookies on GOV.UK'
        }
      ]
    }
  },
  {
    name: 'hidden',
    hidden: true,
    options: {
      messages: [
        {
          hidden: true
        }
      ]
    }
  },
  {
    name: 'hidden false',
    hidden: true,
    options: {
      messages: [
        {
          hidden: false
        }
      ]
    }
  },
  {
    name: 'default action',
    hidden: true,
    options: {
      messages: [
        {
          actions: [
            {
              text: 'This is a button'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'link',
    hidden: true,
    options: {
      messages: [
        {
          actions: [
            {
              text: 'This is a link',
              href: '/link'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'link with false button options',
    hidden: true,
    options: {
      messages: [
        {
          actions: [
            {
              text: 'This is a link',
              href: '/link',
              value: 'cookies',
              name: 'link'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'link as a button',
    hidden: true,
    options: {
      messages: [
        {
          actions: [
            {
              text: 'This is a link',
              href: '/link',
              type: 'button'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'type',
    hidden: true,
    options: {
      messages: [
        {
          actions: [
            {
              text: 'Button',
              type: 'button'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'button classes',
    hidden: true,
    options: {
      messages: [
        {
          actions: [
            {
              text: 'Button with custom classes',
              classes: 'my-button-class app-button-class'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'button attributes',
    hidden: true,
    options: {
      messages: [
        {
          actions: [
            {
              text: 'Button with attributes',
              attributes: {
                'data-button-attribute': 'my-value'
              }
            }
          ]
        }
      ]
    }
  },
  {
    name: 'link classes',
    hidden: true,
    options: {
      messages: [
        {
          actions: [
            {
              text: 'Link with custom classes',
              href: '/my-link',
              classes: 'my-link-class app-link-class'
            }
          ]
        }
      ]
    }
  },
  {
    name: 'link attributes',
    hidden: true,
    options: {
      messages: [
        {
          actions: [
            {
              text: 'Link with attributes',
              href: '/link',
              attributes: {
                'data-link-attribute': 'my-value'
              }
            }
          ]
        }
      ]
    }
  },
  {
    name: 'full banner hidden',
    hidden: true,
    options: {
      hidden: true,
      classes: 'hide-cookie-banner',
      attributes: {
        'data-hide-cookie-banner': 'true'
      },
      messages: [
        {
          headingText: 'Cookies on this service',
          text: 'We use cookies to help understand how users use our service.',
          actions: [
            {
              text: 'Accept analytics cookies',
              type: 'submit',
              name: 'cookies',
              value: 'accept'
            },
            {
              text: 'Reject analytics cookies',
              type: 'submit',
              name: 'cookies',
              value: 'reject'
            },
            {
              text: 'View cookie preferences',
              href: '/cookie-preferences'
            }
          ]
        },
        {
          text: 'Your cookie preferences have been saved. You have accepted cookies.',
          role: 'alert',
          actions: [
            {
              text: 'Hide cookie message',
              type: 'button'
            }
          ]
        },
        {
          text: 'Your cookie preferences have been saved. You have rejected cookies.',
          role: 'alert',
          actions: [
            {
              text: 'Hide cookie message',
              type: 'button'
            }
          ]
        }
      ]
    }
  }
]
