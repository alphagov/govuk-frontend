

<h1 class="govuk-u-heading-36">
Error message
</h1>

<p class="govuk-u-core-24">
  Component to show a red error message - used for form validation.
  Use inside a label or legend.
</p>

<p class="govuk-u-copy-19">
  <a href="">Find error-message guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>

<span class="govuk-c-error-message ">
  Error message goes here
</span>

</div>

<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/error-message/preview">Preview the error-message component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;error-message/macro.njk&quot; import govukErrorMessage %}

{{ govukErrorMessage(
  classes=&#39;&#39;,
  errorMessage=&#39;Error message goes here&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name          | Type    | Default | Required  | Description
|---            |---      |---      |---        |---
| classes       | string  |         | No        | Optional additional classes
| errorMessage  | string  |         | Yes       | Error message

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;error-message/macro.njk&quot; import govukErrorMessage %}

{{ govukErrorMessage(
  classes=&#39;&#39;,
  errorMessage=&#39;Error message goes here&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/error-message</code></pre>

