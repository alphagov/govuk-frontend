


<h1 class="govuk-u-heading-36">
Site width container
</h1>

<p class="govuk-u-core-24">
  A container set to the width of the site (960px) and its margins.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/site-width-container">Find site-width-container guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/site-width-container/preview">Preview the site-width-container component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;site-width-container/macro.njk&quot; import govukSiteWidthContainer %}

{{ govukSiteWidthContainer(classes) }}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->

| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;div class=&quot;govuk-c-site-width-container&quot;&gt;
  Site width container
&lt;/div&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/site-width-container</code></pre>

