

<h1 class="govuk-u-heading-36">
Fieldset
</h1>

<p class="govuk-u-core-24">
  The fieldset element is used to group several controls within a web form.
  The legend element represents a caption for the content of its parent fieldset.
</p>

<p class="govuk-u-copy-19">
  <a href="">Find fieldset guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>

<fieldset class="govuk-c-fieldset ">
  <legend class="govuk-c-fieldset__legend">
    Legend text goes here
  </legend>
</fieldset>

</div>

<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/fieldset/preview">Preview the fieldset component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;fieldset/macro.njk&quot; import govukFieldset %}

{{ govukFieldset(
  classes=&#39;&#39;,
  legendText=&#39;Legend text goes here&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name        | Type    | Default | Required  | Description
|---          |---      |---      |---        |---
| classes     | string  |         | No        | Optional additional classes
| legendText  | string  |         | No        | Legend text

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;fieldset/macro.njk&quot; import govukFieldset %}

{{ govukFieldset(
  classes=&#39;&#39;,
  legendText=&#39;Legend text goes here&#39;
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/fieldset</code></pre>

