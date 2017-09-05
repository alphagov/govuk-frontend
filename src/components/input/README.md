


<h1 class="govuk-u-heading-36">
Input
</h1>

<p class="govuk-u-core-24">
  A single-line text field.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/input">Find input guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/input/preview">Preview the input component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;input/macro.njk&quot; import govukInput %}

{{ govukInput(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;&#39;,
  errorMessage=&#39;&#39;,
  id=&#39;input-1&#39;,
  name=&#39;test-name&#39;
  )
}}

{{ govukInput(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.&#39;,
  errorMessage=&#39;&#39;,
  id=&#39;input-2&#39;,
  name=&#39;test-name-2&#39;
  )
}}

{{ govukInput(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&#39;,
  errorMessage=&#39;Error message goes here&#39;,
  id=&#39;input-3&#39;,
  name=&#39;test-name-3&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes
| labelText     | string  | Yes       | The label text
| hintText      | string  | No        | Optional hint text
| errorMessage  | string  | No        | Optional error message
| id            | string  | Yes       | The id of the input
| name          | string  | Yes       | The name of the input, which is submitted with the form data.
| value         | string  | No        | Optional initial value of the input

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;input/macro.njk&quot; import govukInput %}

{{ govukInput(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;&#39;,
  errorMessage=&#39;&#39;,
  id=&#39;input-1&#39;,
  name=&#39;test-name&#39;
  )
}}

{{ govukInput(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.&#39;,
  errorMessage=&#39;&#39;,
  id=&#39;input-2&#39;,
  name=&#39;test-name-2&#39;
  )
}}

{{ govukInput(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&#39;,
  errorMessage=&#39;Error message goes here&#39;,
  id=&#39;input-3&#39;,
  name=&#39;test-name-3&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/input</code></pre>

