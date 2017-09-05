

<h1 class="govuk-u-heading-36">
Cookie banner
</h1>

<p class="govuk-u-core-24">
  Cookie banner description.
</p>

<p class="govuk-u-copy-19">
  <a href="">Find cookie-banner guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>
<div class="govuk-c-cookie-banner js-cookie-banner ">
  <p class="govuk-c-cookie-banner__text">GOV.UK uses cookies to make the site simpler. <a href="https://www.gov.uk/help/cookies">Find out more about cookies</a></p>
</div>

</div>

<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/cookie-banner/preview">Preview the cookie-banner component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;cookie-banner/macro.njk&quot; import govukCookieBanner %}
{{ govukCookieBanner(
  classes=&#39;&#39;,
  cookieBannerText=&#39;GOV.UK uses cookies to make the site simpler. &lt;a href=&quot;https://www.gov.uk/help/cookies&quot;&gt;Find out more about cookies&lt;/a&gt;&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>


<!-- TODO: Use the table macro here and pass it component argument data -->

| Name                | Type    | Default | Required  | Description
|---                  |---      |---      |---        |---
| classes             | string  |         | No        | Optional additional classes
| cookieBannerText    | string  |         | Yes       | Cookie banner copy


</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;cookie-banner/macro.njk&quot; import govukCookieBanner %}
{{ govukCookieBanner(
  classes=&#39;&#39;,
  cookieBannerText=&#39;GOV.UK uses cookies to make the site simpler. &lt;a href=&quot;https://www.gov.uk/help/cookies&quot;&gt;Find out more about cookies&lt;/a&gt;&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/cookie-banner</code></pre>

