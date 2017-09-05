

<h1 class="govuk-u-heading-36">
Breadcrumb
</h1>

<p class="govuk-u-core-24">
  Breadcrumb navigation, showing page hierarchy.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com">Find breadcrumb guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>

<div class="govuk-c-breadcrumb ">
  <ol class="govuk-c-breadcrumb__list">
      <li class="govuk-c-breadcrumb__list-item">
        <a class="govuk-c-breadcrumb__link" href="/">Home</a>
      </li>
      <li class="govuk-c-breadcrumb__list-item" aria-current="page">Current page</li>
  </ol>
</div>

</div>

<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/breadcrumb/preview">Preview the breadcrumb component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;breadcrumb/macro.njk&quot; import govukBreadcrumb %}

{{ govukBreadcrumb(
  classes=&#39;&#39;,
  [
    { title: &#39;Home&#39;, url: &#39;/&#39; },
    { title: &#39;Current page&#39; }
  ]
) }}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

| Name        | Type   | Default | Required | Description
|---          |---     |---      |---       |---
| classes     | string |         | No       | Optional additional classes
| breadcrumbs | array  |         | Yes      | Breadcrumbs array with title and url keys
| title       | string |         | Yes      | Title of the breadcrumb item
| url         | string |         | Yes      | Url of the breadcrumb item

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;breadcrumb/macro.njk&quot; import govukBreadcrumb %}

{{ govukBreadcrumb(
  classes=&#39;&#39;,
  [
    { title: &#39;Home&#39;, url: &#39;/&#39; },
    { title: &#39;Current page&#39; }
  ]
) }}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/breadcrumb</code></pre>

