


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
<pre><code>&lt;nav class=&quot;govuk-c-pagination&quot; role=&quot;navigation&quot; aria-label=&quot;Pagination&quot;&gt;
  &lt;ul class=&quot;govuk-c-pagination__list&quot;&gt;
    &lt;li class=&quot;govuk-c-pagination__item govuk-c-pagination__item--previous&quot;&gt;
      &lt;a class=&quot;govuk-c-pagination__link&quot; href=&quot;#&quot; rel=&quot;prev&quot;&gt;
        &lt;span class=&quot;govuk-c-pagination__link-title&quot;&gt;
          &lt;svg class=&quot;govuk-c-pagination__link-icon&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; height=&quot;13&quot; width=&quot;17&quot; viewBox=&quot;0 0 17 13&quot;&gt;
            &lt;path fill=&quot;currentColor&quot; d=&quot;m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z&quot;&gt;&lt;/path&gt;
          &lt;/svg&gt;
          Previous
        &lt;/span&gt;
        &lt;span class=&quot;govuk-c-pagination__link-label&quot;&gt;Overview&lt;/span&gt;
      &lt;/a&gt;
    &lt;/li&gt;
    &lt;li class=&quot;govuk-c-pagination__item govuk-c-pagination__item--next&quot;&gt;
      &lt;a class=&quot;govuk-c-pagination__link&quot; href=&quot;#&quot; rel=&quot;next&quot;&gt;
        &lt;span class=&quot;govuk-c-pagination__link-title&quot;&gt;
          Next
          &lt;svg class=&quot;govuk-c-pagination__link-icon&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; height=&quot;13&quot; width=&quot;17&quot; viewBox=&quot;0 0 17 13&quot;&gt;
            &lt;path fill=&quot;currentColor&quot; d=&quot;m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z&quot;&gt;&lt;/path&gt;
          &lt;/svg&gt;
        &lt;/span&gt;
          &lt;span class=&quot;govuk-c-pagination__link-label&quot;&gt;Voting by post&lt;/span&gt;
      &lt;/a&gt;
    &lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/pagination</code></pre>

