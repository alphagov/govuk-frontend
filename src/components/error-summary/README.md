


<h1 class="govuk-u-heading-36">
Error summary
</h1>

<p class="govuk-u-core-24">
  Component to show an error summary box - used at the top of the page, to summarise validation errors.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/error-summary">Find error-summary guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/error-summary/preview">Preview the error-summary component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;error-summary/macro.njk&quot; import govukErrorSummary %}

{{ govukErrorSummary(
  classes=&#39;&#39;,
  title=&#39;Message to alert the user to a problem goes here&#39;,
  description=&#39;Optional description of the errors and how to correct them&#39;,
  listClasses=&#39;&#39;,
  listItems=[
    {
      text: &#39;Descriptive link to the question with an error&#39;,
      url: &#39;#example-error-1&#39;
    },
    {
      text: &#39;Descriptive link to the question with an error&#39;,
      url: &#39;#example-error-2&#39;
    }
  ]
) }}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name        | Type   | Default | Required | Description
|---          |---     |---      |---       |---
| classes     | string |         | No       | Optional additional classes
| title       | string |         | Yes      | Error summary title
| description | string |         | No       | Optional error summary description
| listItems   | array  |         | Yes      | List items array with url and text keys
| url         | string |         | Yes      | List item url
| text        | string |         | Yes      | List item text
| listOptions | object |         | No       | List options

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;div class=&quot;govuk-c-error-summary&quot; aria-labelledby=&quot;error-summary-title&quot; role=&quot;alert&quot; tabindex=&quot;-1&quot;&gt;

  &lt;h2 class=&quot;govuk-c-error-summary__title&quot; id=&quot;error-summary-title&quot;&gt;
    Message to alert the user to a problem goes here
  &lt;/h2&gt;

  &lt;div class=&quot;govuk-c-error-summary__body&quot;&gt;
    &lt;p&gt;
      Optional description of the errors and how to correct them
    &lt;/p&gt;

    &lt;ul class=&quot;govuk-c-list govuk-c-error-summary__list&quot;&gt;
      &lt;li&gt;&lt;a href=&quot;#example-personal-details&quot;&gt;Descriptive link to the question with an error&lt;/a&gt;&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/div&gt;

&lt;/div&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/error-summary</code></pre>

