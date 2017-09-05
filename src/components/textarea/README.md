

<h1 class="govuk-u-heading-36">
Textarea
</h1>

<p class="govuk-u-core-24">
  A multi-line text field.
</p>

<p class="govuk-u-copy-19">
  <a href="">Find textarea guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>



<label class="govuk-c-label " for="textarea">
  National Insurance number


</label>


<textarea class="govuk-c-textarea  " id="textarea" name="name" rows=" 5 "></textarea>

</div>

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

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/textarea</code></pre>

