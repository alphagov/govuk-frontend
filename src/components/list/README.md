# List

A list of items, list variants are bulleted or numbered.

## Guidance

Guidance and documentation can be found on [GOV.UK Design System](linkgoeshere).

## Demo

List [demo](list.html).

## Usage

Code example(s)

```
@@include('list.html')
```

## Nunjucks

```
{% from "list/macro.njk" import govukList %}

{{ govukList(
  classes='',
  [
    {
      text: 'Related link',
      url: '/'
    },
    {
      text: 'Related link',
      url: '/'
    },
    {
      text: 'Related link',
      url: '/'
    }
  ]
) }}

{{ govukList(
  classes='',
  [
    {
      text: 'here is a bulleted list'
    },
    {
      text: 'here is the second bulleted list item'
    },
    {
      text: 'here is the third bulleted list item'
    }
  ],
  options = {
    'isBullet': 'true'
  }
) }}

{{ govukList(
  classes='',
  [
    {
      text: 'This is a numbered list.'
    },
    {
      text: 'This is the second step in a numbered list.'
    },
    {
      text: 'The third step is to make sure each item is a full sentence ending with a full stop.'
    }
  ],
  options = {
    'isNumber': 'true'
  }
) }}

{{ govukList(
  classes='',
  [
    {
      text: 'Step 1'
    },
    {
      text: 'Step 2'
    },
    {
      text: 'Step 3'
    }
  ],
  options = {
    'isStep': 'true'
  }
) }}

{{ govukList(
  classes='',
  [
    {
      text: 'Step 1 Large icon'
    },
    {
      text: 'Step 2 Large icon'
    },
    {
      text: 'Step 3 Large icon'
    }
  ],
  options = {
    'isStepLarge': 'true'
  }
) }}
```

## Arguments

| Name                | Type   | Default | Required | Description
|---                  |---     |---      |---       |---
| classes             | string |         | No       | Optional additional classes
| listItems           | array  |         | Yes      | List items array with url and text keys
| url                 | string |         | Yes      | List item url
| text                | string |         | Yes      | List item text
| options             | object |         | No       | Options object
| options.isBullet    |        |         | No       | Creates bulleted list
| options.isNumber    |        |         | No       | Creates numbered list
| options.isStep      |        |         | No       | Creates list of steps
| options.isStepLarge |        |         | No       | Creates list of steps with large icons

<!--
## Installation

```
npm install --save @govuk-frontend/list
```
-->
