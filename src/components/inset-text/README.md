


<h1 class="govuk-u-heading-36">
Inset text
</h1>

<p class="govuk-u-core-24">
  Use bordered inset text to draw attention to important content on the page.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/inset-text">Find inset-text guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/inset-text/preview">Preview the inset-text component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;inset-text/macro.njk&quot; import govukInsetText %}

{{ govukInsetText(
  classes=&#39;&#39;,
  content=&#39;&lt;p&gt;
    It can take up to 8 weeks to register a lasting power of attorney if&lt;br&gt;
    there are no mistakes in the application.
  &lt;/p&gt;&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name      | Type    | Required  | Description
|---        |---      |---        |---
| classes   | string  | No        | Optional additional classes
| content   | string  | Yes       | Inset text content

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;div class=&quot;govuk-c-inset-text&quot;&gt;
  &lt;p&gt;
    It can take up to 8 weeks to register a lasting power of attorney if&lt;br&gt;
    there are no mistakes in the application.
  &lt;/p&gt;
&lt;/div&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/inset-text</code></pre>

