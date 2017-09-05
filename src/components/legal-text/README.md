

<h1 class="govuk-u-heading-36">
Legal text
</h1>

<p class="govuk-u-core-24">
  Use bold text with an exclamation icon if there are legal consequences - for example, a fine or prison sentence.
</p>

<p class="govuk-u-copy-19">
  <a href="">Find legal-text guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>


<div class="govuk-c-legal-text ">
  <span class="govuk-c-legal-text__icon govuk-u-circle" aria-hidden="true">!</span>
  <strong class="govuk-c-legal-text__text">
    <span class="govuk-c-legal-text__assistive">Warning</span>
    You can be fined up to £5,000 if you don’t register.
  </strong>
</div>

</div>

<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/legal-text/preview">Preview the legal-text component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;legal-text/macro.njk&quot; import govukLegalText %}

{{ govukLegalText(
  classes=&#39;&#39;,
  iconFallbackText=&#39;Warning&#39;,
  legalText=&#39;You can be fined up to £5,000 if you don’t register.&#39;)
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name              | Type    | Default | Required  | Description
|---                |---      |---      |---        |---
| classes           | string  |         | No        | Optional additional classes
| iconFallbackText  | string  |         | Yes       | The fallback text for the icon
| legalText         | string  |         | Yes       | The text next to the icon

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;legal-text/macro.njk&quot; import govukLegalText %}

{{ govukLegalText(
  classes=&#39;&#39;,
  iconFallbackText=&#39;Warning&#39;,
  legalText=&#39;You can be fined up to £5,000 if you don’t register.&#39;)
}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/legal-text</code></pre>

