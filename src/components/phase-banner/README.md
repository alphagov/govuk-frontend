

<h1 class="govuk-u-heading-36">
Phase banner
</h1>

<p class="govuk-u-core-24">
  You have to use an alpha banner if your thing is in alpha, and a beta banner if it’s in beta.
</p>

<p class="govuk-u-copy-19">
  <a href="">Find phase-banner guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>

<div class="govuk-c-phase-banner ">
  <p class="govuk-c-phase-banner__content">
    <strong class="govuk-c-phase-tag "> BETA</strong>

    <span class="govuk-c-phase-banner__text">
      This is a new service – your <a href="#">feedback</a> will help us to improve it.
    </span>
  </p>
</div>

</div>

<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/phase-banner/preview">Preview the phase-banner component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;phase-banner/macro.njk&quot; import govukPhaseBanner %}
{{ govukPhaseBanner(
  phaseBannerText=&#39;This is a new service – your &lt;a href=&quot;#&quot;&gt;feedback&lt;/a&gt; will help us to improve it.&#39;,
  phaseTagText=&#39;BETA&#39;)
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name              | Type    | Default | Required  | Description
|---                |---      |---      |---        |---
| classes           | string  |         | No        | Optional additional classes
| phaseTagText      | string  |         | Yes       | Tag text
| phaseBannerText   | string  |         | Yes       | Banner copy

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;phase-banner/macro.njk&quot; import govukPhaseBanner %}
{{ govukPhaseBanner(
  phaseBannerText=&#39;This is a new service – your &lt;a href=&quot;#&quot;&gt;feedback&lt;/a&gt; will help us to improve it.&#39;,
  phaseTagText=&#39;BETA&#39;)
}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/phase-banner</code></pre>

