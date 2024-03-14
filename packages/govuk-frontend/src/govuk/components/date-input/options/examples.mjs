/**
 * Component examples with Nunjucks macro options (or params)
 *
 * @satisfies {import('@govuk-frontend/lib/components').ComponentExample[]}
 */
export const examples = [
  {
    name: 'default',
    options: {
      id: 'dob'
    }
  },
  {
    name: 'complete question',
    options: {
      id: 'dob',
      namePrefix: 'dob',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2'
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2'
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4'
        }
      ]
    }
  },
  {
    name: 'day and month',
    options: {
      id: 'bday',
      namePrefix: 'bday',
      fieldset: {
        legend: {
          text: 'What is your birthday?'
        }
      },
      hint: {
        text: 'For example, 5 12'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2'
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2'
        }
      ]
    }
  },
  {
    name: 'month and year',
    options: {
      id: 'dob',
      namePrefix: 'dob',
      fieldset: {
        legend: {
          text: 'When did you move to this property?'
        }
      },
      hint: {
        text: 'For example, 3 1980'
      },
      items: [
        {
          name: 'month',
          classes: 'govuk-input--width-2'
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4'
        }
      ]
    }
  },
  {
    name: 'with errors only',
    options: {
      id: 'dob-errors',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      errorMessage: {
        text: 'Error message goes here'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2 govuk-input--error'
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2 govuk-input--error'
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4 govuk-input--error'
        }
      ]
    }
  },
  {
    name: 'with errors and hint',
    options: {
      id: 'dob-errors',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      },
      errorMessage: {
        text: 'Error message goes here'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2 govuk-input--error'
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2 govuk-input--error'
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4 govuk-input--error'
        }
      ]
    }
  },
  {
    name: 'with error on day input',
    options: {
      id: 'dob-day-error',
      namePrefix: 'dob-day-error',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      },
      errorMessage: {
        text: 'Error message goes here'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2 govuk-input--error'
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2'
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4'
        }
      ]
    }
  },
  {
    name: 'with error on month input',
    options: {
      id: 'dob-month-error',
      namePrefix: 'dob-month-error',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      },
      errorMessage: {
        text: 'Error message goes here'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2'
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2 govuk-input--error'
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4'
        }
      ]
    }
  },
  {
    name: 'with error on year input',
    options: {
      id: 'dob-year-error',
      namePrefix: 'dob-year-error',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      },
      errorMessage: {
        text: 'Error message goes here'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2'
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2'
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4 govuk-input--error'
        }
      ]
    }
  },
  {
    name: 'with default items',
    options: {
      id: 'dob',
      namePrefix: 'dob',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      }
    }
  },
  {
    name: 'with optional form-group classes',
    options: {
      id: 'dob',
      namePrefix: 'dob',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      },
      formGroup: {
        classes: 'extra-class'
      }
    }
  },
  {
    name: 'with autocomplete values',
    options: {
      id: 'dob-with-autocomplete-attribute',
      namePrefix: 'dob-with-autocomplete',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2',
          autocomplete: 'bday-day'
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2',
          autocomplete: 'bday-month'
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4',
          autocomplete: 'bday-year'
        }
      ]
    }
  },
  {
    name: 'with input attributes',
    options: {
      id: 'dob-with-input-attributes',
      namePrefix: 'dob-with-input-attributes',
      fieldset: {
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      },
      items: [
        {
          name: 'day',
          classes: 'govuk-input--width-2',
          attributes: {
            'data-example-day': 'day'
          }
        },
        {
          name: 'month',
          classes: 'govuk-input--width-2',
          attributes: {
            'data-example-month': 'month'
          }
        },
        {
          name: 'year',
          classes: 'govuk-input--width-4',
          attributes: {
            'data-example-year': 'year'
          }
        }
      ]
    }
  },
  {
    name: 'classes',
    hidden: true,
    options: {
      id: 'with-classes',
      classes: 'app-date-input--custom-modifier'
    }
  },
  {
    name: 'attributes',
    hidden: true,
    options: {
      id: 'with-attributes',
      attributes: {
        'data-attribute': 'my data value'
      }
    }
  },
  {
    name: 'with empty items',
    hidden: true,
    options: {
      id: 'with-empty-items',
      items: []
    }
  },
  {
    name: 'custom pattern',
    hidden: true,
    options: {
      id: 'with-custom-pattern',
      items: [
        {
          name: 'day',
          pattern: '[0-8]*'
        }
      ]
    }
  },
  {
    name: 'custom inputmode',
    hidden: true,
    options: {
      id: 'with-custom-inputmode',
      items: [
        {
          name: 'day',
          pattern: '[0-9X]*',
          inputmode: 'text'
        }
      ]
    }
  },
  {
    name: 'with nested name',
    hidden: true,
    options: {
      id: 'with-nested-name',
      items: [
        {
          name: 'day[dd]'
        },
        {
          name: 'month[mm]'
        },
        {
          name: 'year[yyyy]'
        }
      ]
    }
  },
  {
    name: 'with id on items',
    hidden: true,
    options: {
      id: 'with-item-id',
      items: [
        {
          id: 'day',
          name: 'day'
        },
        {
          id: 'month',
          name: 'month'
        },
        {
          id: 'year',
          name: 'year'
        }
      ]
    }
  },
  {
    name: 'suffixed id',
    hidden: true,
    options: {
      id: 'my-date-input',
      items: [
        {
          name: 'day'
        },
        {
          name: 'month'
        },
        {
          name: 'year'
        }
      ]
    }
  },
  {
    name: 'with values',
    hidden: true,
    options: {
      id: 'with-values',
      items: [
        {
          id: 'day',
          name: 'day'
        },
        {
          id: 'month',
          name: 'month'
        },
        {
          id: 'year',
          name: 'year',
          value: 2018
        }
      ]
    }
  },
  {
    name: 'with hint and describedBy',
    hidden: true,
    options: {
      id: 'dob-errors',
      fieldset: {
        describedBy: 'test-target-element',
        legend: {
          text: 'What is your date of birth?'
        }
      },
      hint: {
        text: 'For example, 31 3 1980'
      }
    }
  },
  {
    name: 'with error and describedBy',
    hidden: true,
    options: {
      id: 'dob-errors',
      fieldset: {
        describedBy: 'test-target-element',
        legend: {
          text: 'What is your date of birth?'
        }
      },
      errorMessage: {
        text: 'Error message goes here'
      }
    }
  },
  {
    name: 'fieldset html',
    hidden: true,
    options: {
      id: 'with-fieldset-html',
      fieldset: {
        legend: {
          html: 'What is your <b>date of birth</b>?'
        }
      }
    }
  },
  {
    name: 'items with classes',
    hidden: true,
    options: {
      id: 'with-item-classes',
      items: [
        {
          name: 'day',
          classes: 'app-date-input__day'
        },
        {
          name: 'month',
          classes: 'app-date-input__month'
        },
        {
          name: 'year',
          classes: 'app-date-input__year'
        }
      ]
    }
  },
  {
    name: 'items without classes',
    hidden: true,
    options: {
      id: 'without-item-classes',
      items: [
        {
          name: 'day'
        },
        {
          name: 'month'
        },
        {
          name: 'year'
        }
      ]
    }
  }
]
