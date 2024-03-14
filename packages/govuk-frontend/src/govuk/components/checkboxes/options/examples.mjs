/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      name: 'nationality',
      items: [
        {
          value: 'british',
          text: 'British'
        },
        {
          value: 'irish',
          text: 'Irish'
        },
        {
          value: 'other',
          text: 'Citizen of another country'
        }
      ]
    }
  },
  {
    name: 'with pre-checked values',
    options: {
      name: 'nationality',
      items: [
        {
          value: 'british',
          text: 'British'
        },
        {
          value: 'irish',
          text: 'Irish'
        },
        {
          value: 'other',
          text: 'Citizen of another country',
          conditional: {
            html:
              '<div class="govuk-form-group">\n' +
              '  <label class="govuk-label" for="other-country">\n' +
              '    Country\n' +
              '  </label>\n' +
              '  <input class="govuk-input" id="other-country" name="other-country" type="text" value="Ravka">\n' +
              '</div>\n'
          }
        }
      ],
      values: ['british', 'other']
    }
  },
  {
    name: 'with divider and None',
    options: {
      name: 'with-divider-and-none',
      fieldset: {
        legend: {
          text: 'Which types of waste do you transport regularly?',
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true
        }
      },
      items: [
        {
          value: 'animal',
          text: 'Waste from animal carcasses'
        },
        {
          value: 'mines',
          text: 'Waste from mines or quarries'
        },
        {
          value: 'farm',
          text: 'Farm or agricultural waste'
        },
        {
          divider: 'or'
        },
        {
          value: 'none',
          text: 'None of these',
          behaviour: 'exclusive'
        }
      ]
    }
  },
  {
    name: 'with divider, None and conditional items',
    options: {
      name: 'with-divider-and-none-and-conditional-items',
      fieldset: {
        legend: {
          text: 'Do you have any access needs?',
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true
        }
      },
      items: [
        {
          value: 'accessible-toilets',
          text: 'Accessible toilets available'
        },
        {
          value: 'braille',
          text: 'Braille translation service available'
        },
        {
          value: 'disabled-car-parking',
          text: 'Disabled car parking available'
        },
        {
          value: 'another-access-need',
          text: 'Another access need',
          conditional: {
            html:
              '<label class="govuk-label" for="other-access-needs">Other access needs</label>\n' +
              '<textarea class="govuk-textarea govuk-!-width-one-third" name="other-access-needs" id="other-access-needs"></textarea>\n'
          }
        },
        {
          divider: 'or'
        },
        {
          value: 'none',
          text: 'None of these',
          behaviour: 'exclusive'
        }
      ]
    }
  },
  {
    name: 'with id and name',
    options: {
      name: 'with-id-and-name',
      fieldset: {
        legend: {
          text: 'What is your nationality?'
        }
      },
      hint: {
        text: 'If you have dual nationality, select all options that are relevant to you.'
      },
      items: [
        {
          name: 'british',
          id: 'item_british',
          value: 'yes',
          text: 'British'
        },
        {
          name: 'irish',
          id: 'item_irish',
          value: 'irish',
          text: 'Irish'
        },
        {
          name: 'custom-name-scottish',
          text: 'Scottish',
          value: 'scottish'
        }
      ]
    }
  },
  {
    name: 'with hints on items',
    options: {
      name: 'with-hints-on-items',
      fieldset: {
        legend: {
          text: 'How do you want to sign in?',
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true
        }
      },
      items: [
        {
          name: 'gateway',
          id: 'government-gateway',
          value: 'gov-gateway',
          text: 'Sign in with Government Gateway',
          hint: {
            text: "You'll have a user ID if you've registered for Self Assessment or filed a tax return online before."
          }
        },
        {
          name: 'verify',
          id: 'govuk-verify',
          value: 'gov-verify',
          text: 'Sign in with GOV.UK Verify',
          hint: {
            text: "You'll have an account if you've already proved your identity with either Barclays, CitizenSafe, Digidentity, Experian, Post Office, Royal Mail or SecureIdentity."
          }
        }
      ]
    }
  },
  {
    name: 'with disabled item',
    options: {
      name: 'sign-in',
      fieldset: {
        legend: {
          text: 'How do you want to sign in?',
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true
        }
      },
      items: [
        {
          name: 'gateway',
          id: 'government-gateway',
          value: 'gov-gateway',
          text: 'Sign in with Government Gateway',
          hint: {
            text: "You'll have a user ID if you've registered for Self Assessment or filed a tax return online before."
          }
        },
        {
          name: 'verify',
          id: 'govuk-verify',
          value: 'gov-verify',
          text: 'Sign in with GOV.UK Verify',
          hint: {
            text: "You'll have an account if you've already proved your identity with either Barclays, CitizenSafe, Digidentity, Experian, Post Office, Royal Mail or SecureIdentity."
          },
          disabled: true
        }
      ]
    }
  },
  {
    name: 'with legend as a page heading',
    options: {
      name: 'waste',
      fieldset: {
        legend: {
          text: 'Which types of waste do you transport regularly?',
          classes: 'govuk-fieldset__legend--l',
          isPageHeading: true
        }
      },
      hint: {
        text: 'Select all that apply'
      },
      items: [
        {
          value: 'animal',
          text: 'Waste from animal carcasses'
        },
        {
          value: 'mines',
          text: 'Waste from mines or quarries'
        },
        {
          value: 'farm',
          text: 'Farm or agricultural waste'
        }
      ]
    }
  },
  {
    name: 'with a medium legend',
    options: {
      name: 'waste',
      fieldset: {
        legend: {
          text: 'Which types of waste do you transport regularly?',
          classes: 'govuk-fieldset__legend--m'
        }
      },
      hint: {
        text: 'Select all that apply'
      },
      errorMessage: {
        text: 'Select which types of waste you transport regularly'
      },
      items: [
        {
          value: 'animal',
          text: 'Waste from animal carcasses'
        },
        {
          value: 'mines',
          text: 'Waste from mines or quarries'
        },
        {
          value: 'farm',
          text: 'Farm or agricultural waste'
        }
      ]
    }
  },
  {
    name: 'without fieldset',
    options: {
      name: 'colours',
      items: [
        {
          value: 'red',
          text: 'Red'
        },
        {
          value: 'green',
          text: 'Green'
        },
        {
          value: 'blue',
          text: 'Blue'
        }
      ]
    }
  },
  {
    name: "with single option set 'aria-describedby' on input",
    options: {
      name: 't-and-c',
      errorMessage: {
        text: 'Please accept the terms and conditions'
      },
      items: [
        {
          value: 'yes',
          text: 'I agree to the terms and conditions'
        }
      ]
    }
  },
  {
    name: "with single option (and hint) set 'aria-describedby' on input",
    options: {
      name: 't-and-c-with-hint',
      errorMessage: {
        text: 'Please accept the terms and conditions'
      },
      items: [
        {
          value: 'yes',
          text: 'I agree to the terms and conditions',
          hint: {
            text: 'Go on, you know you want to!'
          }
        }
      ]
    }
  },
  {
    name: 'with fieldset and error message',
    options: {
      name: 'nationality',
      errorMessage: {
        text: 'Please accept the terms and conditions'
      },
      fieldset: {
        legend: {
          text: 'What is your nationality?'
        }
      },
      items: [
        {
          value: 'british',
          text: 'British'
        },
        {
          value: 'irish',
          text: 'Irish'
        },
        {
          value: 'other',
          text: 'Citizen of another country'
        }
      ]
    }
  },
  {
    name: 'with error message',
    options: {
      name: 'waste',
      errorMessage: {
        text: 'Please select an option'
      },
      fieldset: {
        legend: {
          text: 'Which types of waste do you transport regularly?'
        }
      },
      items: [
        {
          value: 'animal',
          text: 'Waste from animal carcasses'
        },
        {
          value: 'mines',
          text: 'Waste from mines or quarries'
        },
        {
          value: 'farm',
          text: 'Farm or agricultural waste'
        }
      ]
    }
  },
  {
    name: 'with error message and hints on items',
    options: {
      name: 'waste',
      errorMessage: {
        text: 'Please select an option'
      },
      fieldset: {
        legend: {
          text: 'Which types of waste do you transport regularly?'
        }
      },
      items: [
        {
          value: 'animal',
          text: 'Waste from animal carcasses',
          hint: {
            text: 'Nullam id dolor id nibh ultricies vehicula ut id elit.'
          }
        },
        {
          value: 'mines',
          text: 'Waste from mines or quarries',
          hint: {
            text: 'Nullam id dolor id nibh ultricies vehicula ut id elit.'
          }
        },
        {
          value: 'farm',
          text: 'Farm or agricultural waste',
          hint: {
            text: 'Nullam id dolor id nibh ultricies vehicula ut id elit.'
          }
        }
      ]
    }
  },
  {
    name: 'with very long option text',
    options: {
      name: 'waste',
      hint: {
        text: 'Nullam id dolor id nibh ultricies vehicula ut id elit.'
      },
      errorMessage: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      fieldset: {
        legend: {
          text: 'Maecenas faucibus mollis interdum?'
        }
      },
      items: [
        {
          value: 'nullam',
          text: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Donec id elit non mi porta gravida at eget metus.'
        },
        {
          value: 'aenean',
          text: 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Cras mattis consectetur purus sit amet fermentum.'
        },
        {
          value: 'fusce',
          text: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Etiam porta sem malesuada magna mollis euismod. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Sed posuere consectetur est at lobortis.'
        }
      ]
    }
  },
  {
    name: 'with conditional items',
    options: {
      name: 'with-conditional-items',
      idPrefix: 'how-contacted',
      fieldset: {
        legend: {
          text: 'How do you want to be contacted?'
        }
      },
      items: [
        {
          value: 'email',
          text: 'Email',
          conditional: {
            html:
              '<label class="govuk-label" for="context-email">Email address</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="context-email" type="text" id="context-email">\n'
          }
        },
        {
          value: 'phone',
          text: 'Phone',
          conditional: {
            html:
              '<label class="govuk-label" for="contact-phone">Phone number</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="contact-phone" type="text" id="contact-phone">\n'
          }
        },
        {
          value: 'text',
          text: 'Text message',
          conditional: {
            html:
              '<label class="govuk-label" for="contact-text-message">Mobile phone number</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="contact-text-message" type="text" id="contact-text-message">\n'
          }
        }
      ]
    }
  },
  {
    name: 'with conditional items with special characters',
    options: {
      name: 'contact-prefs',
      idPrefix: 'user.profile[contact-prefs]',
      fieldset: {
        legend: {
          text: 'How do you want to be contacted?'
        }
      },
      items: [
        {
          value: 'email',
          text: 'Email',
          conditional: {
            html:
              '<label class="govuk-label" for="context-email">Email address</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="context-email" type="text" id="context-email">\n'
          }
        },
        {
          value: 'phone',
          text: 'Phone',
          conditional: {
            html:
              '<label class="govuk-label" for="contact-phone">Phone number</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="contact-phone" type="text" id="contact-phone">\n'
          }
        },
        {
          value: 'text',
          text: 'Text message',
          conditional: {
            html:
              '<label class="govuk-label" for="contact-text-message">Mobile phone number</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="contact-text-message" type="text" id="contact-text-message">\n'
          }
        }
      ]
    }
  },
  {
    name: 'with conditional item checked',
    options: {
      name: 'how-contacted-checked',
      idPrefix: 'how-contacted-checked',
      fieldset: {
        legend: {
          text: 'How do you want to be contacted?'
        }
      },
      items: [
        {
          value: 'email',
          text: 'Email',
          checked: true,
          conditional: {
            html:
              '<label class="govuk-label" for="context-email">Email address</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="context-email" type="text" id="context-email">\n'
          }
        },
        {
          value: 'phone',
          text: 'Phone',
          conditional: {
            html:
              '<label class="govuk-label" for="contact-phone">Phone number</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="contact-phone" type="text" id="contact-phone">\n'
          }
        },
        {
          value: 'text',
          text: 'Text message',
          conditional: {
            html:
              '<label class="govuk-label" for="contact-text-message">Mobile phone number</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="contact-text-message" type="text" id="contact-text-message">\n'
          }
        }
      ]
    }
  },
  {
    name: 'with optional form-group classes showing group error',
    options: {
      name: 'how-contacted-checked',
      idPrefix: 'how-contacted-checked',
      formGroup: {
        classes: 'govuk-form-group--error'
      },
      fieldset: {
        legend: {
          text: 'How do you want to be contacted?'
        }
      },
      items: [
        {
          value: 'email',
          text: 'Email',
          conditional: {
            html:
              '<label class="govuk-label" for="context-email">Email address</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="context-email" type="text" id="context-email">\n'
          }
        },
        {
          value: 'phone',
          text: 'Phone',
          checked: true,
          conditional: {
            html:
              '<label class="govuk-label" for="contact-phone">Phone number</label>\n' +
              '<span id="contact-phone-error" class="govuk-error-message">Problem with input</span>\n' +
              '<input class="govuk-input govuk-input--error govuk-!-width-one-third" name="contact-phone" type="text" id="contact-phone" aria-describedby="contact-phone-error">\n'
          }
        },
        {
          value: 'text',
          text: 'Text message',
          conditional: {
            html:
              '<label class="govuk-label" for="contact-text-message">Mobile phone number</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="contact-text-message" type="text" id="contact-text-message">\n'
          }
        }
      ]
    }
  },
  {
    name: 'small',
    options: {
      idPrefix: 'nationality',
      name: 'nationality',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'Filter by'
        }
      },
      items: [
        {
          value: 'a',
          text: 'a thing'
        },
        {
          value: 'b',
          text: 'another thing'
        },
        {
          value: 'c',
          text: 'this thing'
        }
      ]
    }
  },
  {
    name: 'small with long text',
    options: {
      idPrefix: 'nationality',
      name: 'nationality',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'Filter by'
        }
      },
      items: [
        {
          value: 'nullam',
          text: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Maecenas faucibus mollis interdum. Donec id elit non mi porta gravida at eget metus.'
        },
        {
          value: 'aenean',
          text: 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Cras mattis consectetur purus sit amet fermentum.'
        },
        {
          value: 'fusce',
          text: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Etiam porta sem malesuada magna mollis euismod. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Sed posuere consectetur est at lobortis.'
        }
      ]
    }
  },
  {
    name: 'small with error',
    options: {
      idPrefix: 'nationality',
      name: 'nationality',
      classes: 'govuk-checkboxes--small',
      errorMessage: {
        text: 'Select a thing'
      },
      fieldset: {
        legend: {
          text: 'Filter by'
        }
      },
      items: [
        {
          value: 'a',
          text: 'a thing'
        },
        {
          value: 'b',
          text: 'another thing'
        },
        {
          value: 'c',
          text: 'this thing'
        }
      ]
    }
  },
  {
    name: 'small with hint',
    options: {
      idPrefix: 'nationality',
      name: 'nationality',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'Filter by'
        }
      },
      items: [
        {
          value: 'a',
          text: 'a thing',
          hint: {
            text: 'hint for a thing'
          }
        },
        {
          value: 'b',
          text: 'another thing'
        },
        {
          value: 'c',
          text: 'this thing'
        }
      ]
    }
  },
  {
    name: 'small with disabled',
    options: {
      idPrefix: 'nationality',
      name: 'nationality',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'Filter by'
        }
      },
      items: [
        {
          value: 'a',
          text: 'a thing'
        },
        {
          value: 'b',
          text: 'another thing'
        },
        {
          value: 'c',
          text: 'this thing',
          disabled: true
        }
      ]
    }
  },
  {
    name: 'small with conditional reveal',
    options: {
      name: 'how-contacted',
      idPrefix: 'how-contacted',
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: 'How do you want to be contacted?'
        }
      },
      items: [
        {
          value: 'a',
          text: 'a thing',
          conditional: {
            html:
              '<label class="govuk-label" for="context-email">Foo</label>\n' +
              '<input class="govuk-input govuk-!-width-one-third" name="context-email" type="text" id="context-email">\n'
          }
        },
        {
          value: 'b',
          text: 'another thing'
        }
      ]
    }
  },
  {
    name: 'with idPrefix',
    hidden: true,
    options: {
      name: 'example-name',
      idPrefix: 'nationality',
      items: [
        {
          value: 1,
          text: 'Option 1'
        },
        {
          value: 2,
          text: 'Option 2'
        }
      ]
    }
  },
  {
    name: 'with falsey values',
    hidden: true,
    options: {
      name: 'example-name',
      items: [
        {
          value: 1,
          text: 'Option 1'
        },
        false,
        null,
        '',
        {
          value: 2,
          text: 'Option 2'
        }
      ]
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      name: 'example-name',
      classes: 'app-checkboxes--custom-modifier',
      items: [
        {
          value: 1,
          text: 'Option 1'
        },
        {
          value: 2,
          text: 'Option 2'
        }
      ]
    }
  },
  {
    name: 'with fieldset describedBy',
    hidden: true,
    options: {
      name: 'example-name',
      fieldset: {
        describedBy: 'test-target-element',
        legend: {
          text: 'Which option?'
        }
      },
      items: [
        {
          value: 1,
          text: 'Option 1'
        },
        {
          value: 2,
          text: 'Option 2'
        }
      ],
      hint: {
        text: 'If you have dual nationality, select all options that are relevant to you.'
      }
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      name: 'example-name',
      attributes: {
        'data-attribute': 'value',
        'data-second-attribute': 'second-value'
      },
      items: [
        {
          value: 1,
          text: 'Option 1'
        },
        {
          value: 2,
          text: 'Option 2'
        }
      ]
    }
  },
  {
    name: 'with checked item',
    hidden: true,
    options: {
      name: 'example-name',
      items: [
        {
          value: 1,
          text: 'Option 1'
        },
        {
          value: 2,
          text: 'Option 2',
          checked: true
        },
        {
          value: 3,
          text: 'Option 3',
          checked: true
        }
      ]
    }
  },
  {
    name: 'items with attributes',
    hidden: true,
    options: {
      name: 'example-name',
      items: [
        {
          value: 1,
          text: 'Option 1',
          attributes: {
            'data-attribute': 'ABC',
            'data-second-attribute': 'DEF'
          }
        },
        {
          value: 2,
          text: 'Option 2',
          attributes: {
            'data-attribute': 'GHI',
            'data-second-attribute': 'JKL'
          }
        }
      ]
    }
  },
  {
    name: 'empty conditional',
    hidden: true,
    options: {
      name: 'example-conditional',
      items: [
        {
          value: 'foo',
          text: 'Foo',
          conditional: {
            html: false
          }
        }
      ]
    }
  },
  {
    name: 'with label classes',
    hidden: true,
    options: {
      name: 'example-label-classes',
      items: [
        {
          value: 'yes',
          text: 'Yes',
          label: {
            classes: 'bold'
          }
        }
      ]
    }
  },
  {
    name: 'multiple hints',
    hidden: true,
    options: {
      name: 'example-multiple-hints',
      hint: {
        text: 'If you have dual nationality, select all options that are relevant to you.'
      },
      items: [
        {
          value: 'british',
          text: 'British',
          hint: {
            text: 'Hint for british option here'
          }
        },
        {
          value: 'irish',
          text: 'Irish'
        },
        {
          value: 'other',
          text: 'Citizen of another country',
          hint: {
            text: 'Hint for other option here'
          }
        }
      ]
    }
  },
  {
    name: 'with error message and hint',
    hidden: true,
    options: {
      name: 'example',
      items: [
        {
          value: 'british',
          text: 'British'
        },
        {
          value: 'irish',
          text: 'Irish'
        }
      ],
      errorMessage: {
        text: 'Please select an option'
      },
      fieldset: {
        legend: {
          text: 'What is your nationality?'
        }
      },
      hint: {
        text: 'If you have dual nationality, select all options that are relevant to you.'
      }
    }
  },
  {
    name: 'with error, hint and fieldset describedBy',
    hidden: true,
    options: {
      name: 'example',
      errorMessage: {
        text: 'Please select an option'
      },
      fieldset: {
        describedBy: 'test-target-element',
        legend: {
          text: 'What is your nationality?'
        }
      },
      hint: {
        text: 'If you have dual nationality, select all options that are relevant to you.'
      },
      items: [
        {
          value: 'british',
          text: 'British'
        },
        {
          value: 'irish',
          text: 'Irish'
        }
      ]
    }
  },
  {
    name: 'label with attributes',
    hidden: true,
    options: {
      name: 'example-name',
      items: [
        {
          value: 1,
          html: '<b>Option 1</b>',
          label: {
            attributes: {
              'data-attribute': 'value',
              'data-second-attribute': 'second-value'
            }
          }
        }
      ]
    }
  },
  {
    name: 'fieldset params',
    hidden: true,
    options: {
      name: 'example-name',
      errorMessage: {
        text: 'Please select an option'
      },
      fieldset: {
        legend: {
          text: 'What is your nationality?'
        },
        classes: 'app-fieldset--custom-modifier',
        attributes: {
          'data-attribute': 'value',
          'data-second-attribute': 'second-value'
        }
      },
      items: [
        {
          value: 'british',
          text: 'British'
        },
        {
          value: 'irish',
          text: 'Irish'
        }
      ]
    }
  },
  {
    name: 'fieldset html params',
    hidden: true,
    options: {
      name: 'example-name',
      fieldset: {
        legend: {
          html: 'What is your <b>nationality</b>?'
        }
      },
      items: [
        {
          value: 'british',
          text: 'British'
        },
        {
          value: 'irish',
          text: 'Irish'
        }
      ]
    }
  },
  {
    name: "with single option set 'aria-describedby' on input, and describedBy",
    hidden: true,
    options: {
      describedBy: 'test-target-element',
      name: 't-and-c',
      errorMessage: {
        text: 'Please accept the terms and conditions'
      },
      items: [
        {
          value: 'yes',
          text: 'I agree to the terms and conditions'
        }
      ]
    }
  },
  {
    name: "with single option (and hint) set 'aria-describedby' on input, and describedBy",
    hidden: true,
    options: {
      describedBy: 'test-target-element',
      name: 't-and-c-with-hint',
      errorMessage: {
        text: 'Please accept the terms and conditions'
      },
      items: [
        {
          value: 'yes',
          text: 'I agree to the terms and conditions',
          hint: {
            text: 'Go on, you know you want to!'
          }
        }
      ]
    }
  },
  {
    name: 'with error and idPrefix',
    hidden: true,
    options: {
      name: 'name-of-checkboxes',
      errorMessage: {
        text: 'Please select an option'
      },
      idPrefix: 'id-prefix',
      items: [
        {
          value: 'animal',
          text: 'Waste from animal carcasses'
        }
      ]
    }
  },
  {
    name: 'with error message and fieldset describedBy',
    hidden: true,
    options: {
      name: 'example',
      errorMessage: {
        text: 'Please select an option'
      },
      fieldset: {
        describedBy: 'test-target-element',
        legend: {
          text: 'What is your nationality?'
        }
      },
      items: [
        {
          value: 'british',
          text: 'British'
        },
        {
          value: 'irish',
          text: 'Irish'
        }
      ]
    }
  },
  {
    name: 'item checked overrides values',
    hidden: true,
    options: {
      name: 'colors',
      items: [
        {
          value: 'red',
          text: 'Red'
        },
        {
          value: 'green',
          text: 'Green',
          checked: false
        },
        {
          value: 'blue',
          text: 'Blue'
        }
      ],
      values: ['red', 'green']
    }
  }
]
