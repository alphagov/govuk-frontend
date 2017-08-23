


<h1 class="govuk-u-heading-36">
Table
</h1>

<p class="govuk-u-core-24">
  Table description.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/table">Find table guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/table/preview">Preview the table component.
</a>
</p>

<h2 class="govuk-u-heading-24">How to call this component</h2>
```
@@include('table.html')
```
## Nunjucks

```
{% from 'table/macro.njk' import govukTable %}

{# table with a caption #}
{{ govukTable(
  classes='',
  options = {
    'caption': 'Months and rates',
    'captionSize': 'small',
    'isFirstCellHeader': 'true'
  },
  data = {
    'rows' : [
      [
        {
          text: 'January'
        },
        {
          text: '£85',
          type: 'numeric'
        },
        {
          text: '£95',
          type: 'numeric'
        }
      ],
      [
        {
          text: 'February'
        },
        {
          text: '£75',
          type: 'numeric'
        },
        {
          text: '£55',
          type: 'numeric'
        }
      ],
      [
        {
          text: 'March'
        },
        {
          text: '£165',
          type: 'numeric'
        },
        {
          text: '£125',
          type: 'numeric'
        }
      ]
    ]
  }
)}}

{# table with a head #}
{{ govukTable(
  classes='',
  options = {
    'isFirstCellHeader': 'true'
  },
  data = {
    'head' : [
      {
        text: 'Month you apply'
      },
      {
        text: 'Rate for bicycles',
        type: 'numeric'
      },
      {
        text: 'Rate for vehicles',
        type: 'numeric'
      }
    ],
    'rows' : [
      [
        {
          text: 'January'
        },
        {
          text: '£85',
          type: 'numeric'
        },
        {
          text: '£95',
          type: 'numeric'
        }
      ],
      [
        {
          text: 'February'
        },
        {
          text: '£75',
          type: 'numeric'
        },
        {
          text: '£55',
          type: 'numeric'
        }
      ],
      [
        {
          text: 'March'
        },
        {
          text: '£165',
          type: 'numeric'
        },
        {
          text: '£125',
          type: 'numeric'
        }
      ]
    ]
  }
)}}
```

## Arguments

| Name             | Type    | Default | Required | Description
|---               |---      |---      |---       |---
| classes          | string  |         | No       | Optional additional classes
| data             | object  |         | Yes      | Data for the table: rows, head and cells
| data.options     | Object  |         | No       | Caption text , size and if first cell in bolder
| data.head        | Array   |         | No       | Data for the table head cells
| data.rows        | Array   |         | Yes      | Data for the table: rows, head and cells

  <pre><code></code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

  <!-- TODO: Use the table macro here and pass it component argument data -->

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code></code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/table</code></pre>
