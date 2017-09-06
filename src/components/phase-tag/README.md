


<h1 class="govuk-u-heading-36">
Phase tag
</h1>

<p class="govuk-u-core-24">
  Phase tags are mostly used inside phase banners as an indication of the state of a project. It’s possible to use them outside phase banners, for example as part of a service header.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/phase-tag">Find phase-tag guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/phase-tag/preview">Preview the phase-tag component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;phase-tag/macro.njk&quot; import govukPhaseTag %}

{{ govukPhaseTag(classes=&#39;&#39;, phaseTagText=&#39;Alpha&#39;) }}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name              | Type    | Default | Required  | Description
|---                |---      |---      |---        |---
| classes           | string  |         | No        | Optional additional classes
| phaseTagText      | string  |         | Yes       | Tag text

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;strong class=&quot;govuk-c-phase-tag&quot;&gt;ALPHA&lt;/strong&gt;

&lt;strong class=&quot;govuk-c-phase-tag&quot;&gt;BETA&lt;/strong&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/phase-tag</code></pre>

