


<h1 class="govuk-u-heading-36">
Textarea
</h1>

<p class="govuk-u-core-24">
  A multi-line text field.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/textarea">Find textarea guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/textarea/preview">Preview the textarea component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;textarea/macro.njk&quot; import govukTextarea %}

{{ govukTextarea(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;&#39;,
  errorMessage=&#39;&#39;,
  id=&#39;textarea&#39;,
  name=&#39;name&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->

| Name          | Type    | Default   | Required  | Description
|---            |---      |---        |---        |---
| classes       | string  |           | No        | Optional additional classes
| labelText     | string  |           | Yes       | The label text
| hintText      | string  |           | No        | Optional hint text
| errorMessage  | string  |           | No        | Optional error message
| id            | string  |           | Yes       | The id of the textarea
| name          | string  |           | Yes       | The name of the textarea
| rows          | string  | 5         | No        | Change default number of textarea rows

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;label class=&quot;govuk-c-label&quot; for=&quot;govuk-c-textarea-a&quot;&gt;
  Why can&#39;t you provide a National Insurance number?
&lt;/label&gt;
&lt;textarea class=&quot;govuk-c-textarea&quot; name=&quot;govuk-c-textarea-a&quot; id=&quot;govuk-c-textarea-a&quot; rows=&quot;5&quot;&gt;&lt;/textarea&gt;

&lt;label class=&quot;govuk-c-label&quot; for=&quot;govuk-c-textarea-b&quot;&gt;
  Why can&#39;t you provide a National Insurance number?
  &lt;span class=&quot;govuk-c-error-message&quot;&gt;
    Error message goes here
  &lt;/span&gt;
&lt;/label&gt;
&lt;textarea class=&quot;govuk-c-textarea govuk-c-textarea--error&quot; name=&quot;govuk-c-textarea-b&quot; id=&quot;govuk-c-textarea-b&quot; rows=&quot;5&quot;&gt;&lt;/textarea&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/textarea</code></pre>

