

<h1 class="govuk-u-heading-36">
Error summary
</h1>

<p class="govuk-u-core-24">
  Component to show an error summary box - used at the top of the page, to summarise validation errors.
</p>

<p class="govuk-u-copy-19">
  <a href="">Find error-summary guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>


<div class="govuk-c-error-summary " aria-labelledby="error-summary-title" role="alert" tabindex="-1">

  <h2 class="govuk-c-error-summary__title" id="error-summary-title">
    Message to alert the user to a problem goes here
  </h2>

  <div class="govuk-c-error-summary__body">
    <p>
      Optional description of the errors and how to correct them
    </p>
    <ul class="govuk-c-list  govuk-c-error-summary__list">

  <li>
<a href="#example-error-1 ">        Descriptive link to the question with an error
</a>  </li>
  <li>
<a href="#example-error-2 ">        Descriptive link to the question with an error
</a>  </li>

</ul>

  </div>

</div>

</div>

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

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/error-summary</code></pre>

