/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      text: 'This publication was withdrawn on 7 March 2014.'
    }
  },
  {
    name: 'paragraph as html heading',
    options: {
      html: '<p class="govuk-notification-banner__heading">You have 9 days to send a response.</p>\n'
    }
  },
  {
    name: 'with text as html',
    options: {
      html:
        '<h3 class="govuk-notification-banner__heading">\n' +
        '  This publication was withdrawn on 7 March 2014\n' +
        '</h3>\n' +
        '<p class="govuk-body">\n' +
        '  Archived and replaced by the <a href="#" class="govuk-notification-banner__link">new planning guidance</a> launched 6 March 2014 on an external website\n' +
        '</p>\n'
    }
  },
  {
    name: 'with type as success',
    options: {
      type: 'success',
      text: 'Email sent to example@email.com'
    }
  },
  {
    name: 'success with custom html',
    options: {
      type: 'success',
      html:
        '<h3 class="govuk-notification-banner__heading">\n' +
        '  4 files uploaded\n' +
        '</h3>\n' +
        '<ul class="govuk-!-margin-0 govuk-list">\n' +
        '  <li><a href="link-1" class="govuk-notification-banner__link">government-strategy.pdf</a></li>\n' +
        '  <li><a href="link-2" class="govuk-notification-banner__link">government-strategy-v1.pdf</a></li>\n' +
        '</ul>\n'
    }
  },
  {
    name: 'with a list',
    options: {
      html:
        '<h3 class="govuk-notification-banner__heading">4 files uploaded</h3>\n' +
        '<ul class="govuk-list govuk-list--bullet govuk-!-margin-bottom-0">\n' +
        '  <li><a href="#" class="govuk-notification-banner__link">government-strategy.pdf</a></li>\n' +
        '  <li><a href="#" class="govuk-notification-banner__link">government-strategy-v2.pdf</a></li>\n' +
        '  <li><a href="#" class="govuk-notification-banner__link">government-strategy-v3-FINAL.pdf</a></li>\n' +
        '  <li><a href="#" class="govuk-notification-banner__link">government-strategy-v4-FINAL-v2.pdf</a></li>\n' +
        '</ul>\n'
    }
  },
  {
    name: 'with long heading',
    options: {
      text: 'This publication was withdrawn on 7 March 2014, before being sent in, sent back, queried, lost, found, subjected to public inquiry, lost again, and finally buried in soft peat for three months and recycled as firelighters.'
    }
  },
  {
    name: 'with lots of content',
    options: {
      html:
        '<h3 class="govuk-notification-banner__heading">\n' +
        '  Check if you need to apply the reverse charge to this application\n' +
        '</h3>\n' +
        '<p class="govuk-body">\n' +
        '  You will have to apply the <a href="#" class="govuk-notification-banner__link">reverse charge</a> if the applicant supplies any of these services:\n' +
        '</p>\n' +
        '<ul class="govuk-list govuk-list--bullet govuk-list--spaced">\n' +
        '  <li>constructing, altering, repairing, extending, demolishing or dismantling buildings or structures (whether permanent or not), including offshore installation services</li>\n' +
        '  <li>constructing, altering, repairing, extending, demolishing of any works forming, or planned to form, part of the land, including (in particular) walls, roadworks, power lines, electronic communications equipment, aircraft runways, railways, inland waterways, docks and harbours</li>\n' +
        '</ul>\n'
    }
  },
  {
    name: 'auto-focus disabled, with type as success',
    options: {
      type: 'success',
      disableAutoFocus: true,
      text: 'Email sent to example@email.com'
    }
  },
  {
    name: 'auto-focus explicitly enabled, with type as success',
    options: {
      type: 'success',
      disableAutoFocus: false,
      text: 'Email sent to example@email.com'
    }
  },
  {
    name: 'role=alert overridden to role=region, with type as success',
    options: {
      type: 'success',
      role: 'region',
      text: 'Email sent to example@email.com'
    }
  },
  {
    name: 'custom tabindex',
    options: {
      type: 'success',
      text: 'Email sent to example@email.com',
      attributes: {
        tabindex: 2
      }
    }
  },
  {
    name: 'custom title',
    hidden: true,
    options: {
      titleText: 'Important information',
      text: 'This publication was withdrawn on 7 March 2014.'
    }
  },
  {
    name: 'title as html',
    hidden: true,
    options: {
      titleHtml: '<span>Important information</span>',
      text: 'This publication was withdrawn on 7 March 2014.'
    }
  },
  {
    name: 'title html as text',
    hidden: true,
    options: {
      titleText: '<span>Important information</span>',
      text: 'This publication was withdrawn on 7 March 2014.'
    }
  },
  {
    name: 'custom title heading level',
    hidden: true,
    options: {
      titleHeadingLevel: 3,
      text: 'This publication was withdrawn on 7 March 2014.'
    }
  },
  {
    name: 'custom title id',
    hidden: true,
    options: {
      titleId: 'my-id',
      text: 'This publication was withdrawn on 7 March 2014.'
    }
  },
  {
    name: 'custom title id with type as success',
    hidden: true,
    options: {
      type: 'success',
      titleId: 'my-id',
      text: 'Email sent to example@email.com'
    }
  },
  {
    name: 'custom text',
    hidden: true,
    options: {
      text: 'This publication was withdrawn on 7 March 2014.'
    }
  },
  {
    name: 'html as text',
    hidden: true,
    options: {
      text: '<span>This publication was withdrawn on 7 March 2014.</span>'
    }
  },
  {
    name: 'custom role',
    hidden: true,
    options: {
      role: 'banner',
      text: 'This publication was withdrawn on 7 March 2014.'
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      text: 'This publication was withdrawn on 7 March 2014.',
      classes: 'app-my-class'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      text: 'This publication was withdrawn on 7 March 2014.',
      attributes: {
        'my-attribute': 'value'
      }
    }
  },
  {
    name: 'with invalid type',
    hidden: true,
    options: {
      type: 'some-type',
      text: 'This publication was withdrawn on 7 March 2014.'
    }
  }
]
