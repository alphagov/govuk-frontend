


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
| options          | Object  |         | No       | Caption text, size and if first cell is bolder
| data.head        | Array   |         | No       | Data for the table head cells
| data.rows        | Array   |         | Yes      | Data for the table: rows and cells

  <pre><code></code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

  <!-- TODO: Use the table macro here and pass it component argument data -->

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;table class=&quot;govuk-c-table&quot;&gt;
  &lt;thead class=&quot;govuk-c-table__head&quot;&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;col&quot;&gt;Month you apply&lt;/th&gt;
      &lt;th class=&quot;govuk-c-table__header govuk-c-table__header--numeric&quot; scope=&quot;col&quot;&gt;Rate for vehicles&lt;/th&gt;
      &lt;th class=&quot;govuk-c-table__header govuk-c-table__header--numeric&quot; scope=&quot;col&quot;&gt;Rate for bicycles&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody class=&quot;govuk-c-table__body&quot;&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt;January&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell govuk-c-table__cell--numeric&quot;&gt;£165.00&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell govuk-c-table__cell--numeric&quot;&gt;£85.00&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt;February&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell govuk-c-table__cell--numeric&quot;&gt;£165.00&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell govuk-c-table__cell--numeric&quot;&gt;£85.00&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt;March&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell govuk-c-table__cell--numeric&quot;&gt;£151.25&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell govuk-c-table__cell--numeric&quot;&gt;£77.90&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt;April&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell govuk-c-table__cell--numeric&quot;&gt;£136.10&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell govuk-c-table__cell--numeric&quot;&gt;£70.10&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;

&lt;table class=&quot;govuk-c-table&quot;&gt;
  &lt;caption class=&quot;govuk-c-table__caption heading-small&quot;&gt;Dates and amounts&lt;/caption&gt;
  &lt;tbody class=&quot;govuk-c-table__body&quot;&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;td class=&quot;govuk-c-table__cell&quot;&gt;First 6 weeks&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell&quot;&gt;£109.80 per week&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;td class=&quot;govuk-c-table__cell&quot;&gt;Next 33 weeks&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell&quot;&gt;£109.80 per week&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;td class=&quot;govuk-c-table__cell&quot;&gt;Total estimated pay&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell&quot;&gt;£4,282.20&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;td class=&quot;govuk-c-table__cell&quot;&gt;Tell the mother’s employer&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell&quot;&gt;28 days before they want to start maternity pay&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/table</code></pre>
