

<h1 class="govuk-u-heading-36">
Details
</h1>

<p class="govuk-u-core-24">
  Component for conditionally revealing content, using the details HTML element.
</p>

<p class="govuk-u-copy-19">
  <a href="">Find details guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>

<details class="govuk-c-details ">
  <summary class="govuk-c-details__summary">
    <span class="govuk-c-details__summary-text">Help with nationality</span>
  </summary>
  <div class="govuk-c-border govuk-c-border--left-narrow">
    <div class="govuk-c-details__text">
      <p>
    If you’re not sure about your nationality, try to find out from an official document like a passport or national ID card.
  </p>
  <p>
    We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.
  </p>
    </div>
  </div>
</details>

</div>

<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/details/preview">Preview the details component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;details/macro.njk&quot; import govukDetails %}

{{ govukDetails(
  classes=&#39;&#39;,
  detailsSummaryText=&#39;Help with nationality&#39;,
  detailsText=&#39;&lt;p&gt;
    If you’re not sure about your nationality, try to find out from an official document like a passport or national ID card.
  &lt;/p&gt;
  &lt;p&gt;
    We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.
  &lt;/p&gt;&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name                | Type    | Default | Required  | Description
|---                  |---      |---      |---        |---
| classes             | string  |         | No        | Optional additional classes
| detailsSummaryText  | string  |         | Yes       | Summary element text
| detailsText         | string  |         | Yes       | Revealed details text

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;details/macro.njk&quot; import govukDetails %}

{{ govukDetails(
  classes=&#39;&#39;,
  detailsSummaryText=&#39;Help with nationality&#39;,
  detailsText=&#39;&lt;p&gt;
    If you’re not sure about your nationality, try to find out from an official document like a passport or national ID card.
  &lt;/p&gt;
  &lt;p&gt;
    We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.
  &lt;/p&gt;&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/details</code></pre>

