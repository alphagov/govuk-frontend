/**
 * Nunjucks macro option (or param) configs
 *
 * @satisfies {{ [param: string]: import('@govuk-frontend/lib/components').ComponentOption }}
 */
export const params = {
  ariaLabel: {
    type: 'string',
    required: false,
    description:
      'The text for the `aria-label` which labels the cookie banner region. This region applies to all messages that the cookie banner includes. For example, the cookie message and the confirmation message. Defaults to `"Cookie banner"`.'
  },
  hidden: {
    type: 'boolean',
    required: false,
    description:
      'Defaults to `false`. If you set this option to `true`, the whole cookie banner is hidden, including all messages within the banner. You can use `hidden` for client-side implementations where the cookie banner HTML is present, but hidden until the cookie banner is shown using JavaScript.'
  },
  classes: {
    type: 'string',
    required: false,
    description:
      'The additional classes that you want to add to the cookie banner.'
  },
  attributes: {
    type: 'object',
    required: false,
    description:
      'The additional attributes that you want to add to the cookie banner. For example, data attributes.'
  },
  messages: {
    type: 'array',
    required: true,
    description:
      'The different messages you can pass into the cookie banner. For example, the cookie message and the confirmation message.',
    params: {
      headingText: {
        type: 'string',
        required: false,
        description:
          'The heading text that displays in the message. You can use any string with this option. If you set `headingHtml`, `headingText` is ignored.'
      },
      headingHtml: {
        type: 'string',
        required: false,
        description:
          'The heading HTML to use within the message. You can use any string with this option. If you set `headingHtml`, `headingText` is ignored. If you are not passing HTML, use `headingText`.'
      },
      text: {
        type: 'string',
        required: true,
        description:
          'The text for the main content within the message. You can use any string with this option. If you set `html`, `text` is not required and is ignored.'
      },
      html: {
        type: 'string',
        required: true,
        description:
          'The HTML for the main content within the message. You can use any string with this option. If you set `html`, `text` is not required and is ignored. If you are not passing HTML, use `text`.'
      },
      actions: {
        type: 'array',
        required: false,
        description:
          'The buttons and links that you want to display in the message. `actions` defaults to `"button"` unless you set `href`, which renders the action as a link.',
        params: {
          text: {
            type: 'string',
            required: true,
            description: 'The button or link text.'
          },
          type: {
            type: 'string',
            required: false,
            description:
              'The type of button – `"button"` or `"submit"`. If `href` is provided, set `type` to `"button"` render a link styled as a button.'
          },
          href: {
            type: 'string',
            required: false,
            description:
              'The `href` for a link. Set `type` to `"button"` and set `href` to render a link styled as a button.'
          },
          name: {
            type: 'string',
            required: false,
            description:
              'The name attribute for the button. Does not apply if you set `href`, which makes a link.'
          },
          value: {
            type: 'string',
            required: false,
            description:
              'The value attribute for the button. Does not apply if you set `href`, which makes a link.'
          },
          classes: {
            type: 'string',
            required: false,
            description:
              'The additional classes that you want to add to the button or link.'
          },
          attributes: {
            type: 'object',
            required: false,
            description:
              'The additional attributes that you want to add to the button or link. For example, data attributes.'
          }
        }
      },
      hidden: {
        type: 'boolean',
        required: false,
        description:
          'Defaults to `false`. If you set it to `true`, the message is hidden. You can use `hidden` for client-side implementations where the confirmation message HTML is present, but hidden on the page.'
      },
      role: {
        type: 'string',
        required: false,
        description:
          'Set `role` to `"alert"` on confirmation messages to allow assistive tech to automatically read the message. You will also need to move focus to the confirmation message using JavaScript you have written yourself.'
      },
      classes: {
        type: 'string',
        required: false,
        description:
          'The additional classes that you want to add to the message.'
      },
      attributes: {
        type: 'object',
        required: false,
        description:
          'The additional attributes that you want to add to the message. For example, data attributes.'
      }
    }
  }
}
