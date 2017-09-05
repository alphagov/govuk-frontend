

<h1 class="govuk-u-heading-36">
Pagination
</h1>

<p class="govuk-u-core-24">
  Previous/next page links.
  <a href="https://www.gov.uk/voting-in-the-uk/polling-stations">View previous/next links on GOV.UK</a>
</p>

<p class="govuk-u-copy-19">
  <a href="">Find pagination guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>

<nav class="govuk-c-pagination " role="navigation" aria-label="Pagination">
  <ul class="govuk-c-pagination__list">
    <li class="govuk-c-pagination__item govuk-c-pagination__item--previous">
      <a class="govuk-c-pagination__link" href="previous-page" rel="prev">
        <span class="govuk-c-pagination__link-title">
          <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
            <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
          </svg>
          Previous page
        </span>
          <span class="govuk-c-pagination__link-label">1 of 3</span>
      </a>
    </li>

  </ul>
</nav>


<nav class="govuk-c-pagination " role="navigation" aria-label="Pagination">
  <ul class="govuk-c-pagination__list">

    <li class="govuk-c-pagination__item govuk-c-pagination__item--next">
      <a class="govuk-c-pagination__link" href="next-page" rel="next">
        <span class="govuk-c-pagination__link-title">
          Next page
          <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
            <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
          </svg>
        </span>
          <span class="govuk-c-pagination__link-label">Tax disc</span>
      </a>
    </li>
  </ul>
</nav>


<nav class="govuk-c-pagination " role="navigation" aria-label="Pagination">
  <ul class="govuk-c-pagination__list">
    <li class="govuk-c-pagination__item govuk-c-pagination__item--previous">
      <a class="govuk-c-pagination__link" href="previous-page" rel="prev">
        <span class="govuk-c-pagination__link-title">
          <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
            <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
          </svg>
          Previous page
        </span>
          <span class="govuk-c-pagination__link-label">1 of 3</span>
      </a>
    </li>

    <li class="govuk-c-pagination__item govuk-c-pagination__item--next">
      <a class="govuk-c-pagination__link" href="next-page" rel="next">
        <span class="govuk-c-pagination__link-title">
          Next page
          <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
            <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
          </svg>
        </span>
          <span class="govuk-c-pagination__link-label">2 of 3</span>
      </a>
    </li>
  </ul>
</nav>


<nav class="govuk-c-pagination " role="navigation" aria-label="Pagination">
  <ul class="govuk-c-pagination__list">
    <li class="govuk-c-pagination__item govuk-c-pagination__item--previous">
      <a class="govuk-c-pagination__link" href="previous-page" rel="prev">
        <span class="govuk-c-pagination__link-title">
          <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
            <path fill="currentColor" d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
          </svg>
          Previous page
        </span>
      </a>
    </li>

    <li class="govuk-c-pagination__item govuk-c-pagination__item--next">
      <a class="govuk-c-pagination__link" href="next-page" rel="next">
        <span class="govuk-c-pagination__link-title">
          Next page
          <svg class="govuk-c-pagination__link-icon" xmlns="http://www.w3.org/2000/svg" height="13" width="17" viewBox="0 0 17 13">
            <path fill="currentColor" d="m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
          </svg>
        </span>
      </a>
    </li>
  </ul>
</nav>
</div>

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

