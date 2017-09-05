


<h1 class="govuk-u-heading-36">
Pagination
</h1>

<p class="govuk-u-core-24">
  Previous/next page links.
  <a href="https://www.gov.uk/voting-in-the-uk/polling-stations">View previous/next links on GOV.UK</a>
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/pagination">Find pagination guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/pagination/preview">Preview the pagination component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;pagination/macro.njk&quot; import govukPagination %}

{{ govukPagination(
  classes=&#39;&#39;,
  previousPage=[
   {
      url: &#39;previous-page&#39;,
      title: &#39;Previous page&#39;,
      label: &#39;1 of 3&#39;
    }
  ]
  )
}}

{{ govukPagination(
  classes=&#39;&#39;,
  nextPage=[
   {
      url: &#39;next-page&#39;,
      title: &#39;Next page&#39;,
      label: &#39;Tax disc&#39;
    }
  ]
  )
}}

{{ govukPagination(
  classes=&#39;&#39;,
  previousPage=[
   {
      url: &#39;previous-page&#39;,
      title: &#39;Previous page&#39;,
      label: &#39;1 of 3&#39;
    }
  ],
  nextPage=[
   {
      url: &#39;next-page&#39;,
      title: &#39;Next page&#39;,
      label: &#39;2 of 3&#39;
    }
  ]
  )
}}

{{ govukPagination(
  classes=&#39;&#39;,
  previousPage=[
   {
      url: &#39;previous-page&#39;,
      title: &#39;Previous page&#39;
    }
  ],
  nextPage=[
   {
      url: &#39;next-page&#39;,
      title: &#39;Next page&#39;
    }
  ]
  )
}}</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name          | Type    | Default | Required | Description
|---            |---      |---      |---       |---
| classes       | string  |         | No       | Optional additional classes
| name          | string  |         | Yes      | Name of the group of checkboxes
| id            | string  |         | Yes      | ID is prefixed to the ID of each checkbox
| previousPage  | array   |         | No       | previousPage array with url, title and label keys
| nextPage      | array   |         | No       | nextPage array with url, title and label keys

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;pagination/macro.njk&quot; import govukPagination %}

{{ govukPagination(
  classes=&#39;&#39;,
  previousPage=[
   {
      url: &#39;previous-page&#39;,
      title: &#39;Previous page&#39;,
      label: &#39;1 of 3&#39;
    }
  ]
  )
}}

{{ govukPagination(
  classes=&#39;&#39;,
  nextPage=[
   {
      url: &#39;next-page&#39;,
      title: &#39;Next page&#39;,
      label: &#39;Tax disc&#39;
    }
  ]
  )
}}

{{ govukPagination(
  classes=&#39;&#39;,
  previousPage=[
   {
      url: &#39;previous-page&#39;,
      title: &#39;Previous page&#39;,
      label: &#39;1 of 3&#39;
    }
  ],
  nextPage=[
   {
      url: &#39;next-page&#39;,
      title: &#39;Next page&#39;,
      label: &#39;2 of 3&#39;
    }
  ]
  )
}}

{{ govukPagination(
  classes=&#39;&#39;,
  previousPage=[
   {
      url: &#39;previous-page&#39;,
      title: &#39;Previous page&#39;
    }
  ],
  nextPage=[
   {
      url: &#39;next-page&#39;,
      title: &#39;Next page&#39;
    }
  ]
  )
}}</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/pagination</code></pre>

