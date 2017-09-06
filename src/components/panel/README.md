


<h1 class="govuk-u-heading-36">
Panel
</h1>

<p class="govuk-u-core-24">
  The confirmation panel has a turquoise background and white text. Used for transaction end pages, and Bank Holidays.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/panel">Find panel guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/panel/preview">Preview the panel component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;panel/macro.njk&quot; import govukPanel %}

{{ govukPanel(
  classes=&#39;&#39;,
  title=&#39;Application complete&#39;,
  content=&#39;Your reference number is&#39;,
  reference=&#39;HDJ2123F&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes
| title         | string  | Yes       | The panel title
| content       | string  | No        | The panel content
| reference     | string  | No        | Optional reference number

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;div class=&quot;govuk-c-panel govuk-c-panel--confirmation&quot;&gt;
  &lt;h2 class=&quot;govuk-c-panel__title&quot;&gt;
    Application complete
  &lt;/h2&gt;
  &lt;div class=&quot;govuk-c-panel__body&quot;&gt;
    Your reference number is
    &lt;br&gt;
    &lt;strong&gt;HDJ2123F&lt;/strong&gt;
  &lt;/div&gt;
&lt;/div&gt;

&lt;div class=&quot;govuk-c-panel govuk-c-panel--information&quot;&gt;
  Panel content
&lt;/div&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/panel</code></pre>

