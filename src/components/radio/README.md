


<h1 class="govuk-u-heading-36">
Radio
</h1>

<p class="govuk-u-core-24">
  A radio button. You must use the `value` attribute to define the value submitted by this item. Use the `checked` attribute to indicate whether this item is selected by default. Radio buttons that have the same value for the name attribute are in the same "radio button group". Only one radio button in a group can be selected at a time.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/radio">Find radio guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/radio/preview">Preview the radio component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &#39;radio/macro.njk&#39; import govukRadio %}

{{ govukRadio(
  classes=&#39;&#39;,
  name=&#39;radio-group&#39;,
  id=&#39;radio&#39;,
  radios=[
   {
      id: &#39;1&#39;,
      value: &#39;Yes&#39;,
      label: &#39;Yes&#39;
    },
    {
      id: &#39;2&#39;,
      value: &#39;No&#39;,
      label: &#39;No&#39;
    },
    {
      id: &#39;3&#39;,
      value: &#39;No&#39;,
      label: &#39;No&#39;,
      checked: &#39;true&#39;
    },
    {
      id: &#39;4&#39;,
      value: &#39;NA&#39;,
      label: &#39;Not applicable&#39;,
      disabled: &#39;true&#39;
    }
  ]
) }}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name        | Type    | Default | Required | Description
|---          |---      |---      |---       |---
| classes     | string  |         | No       | Optional additional classes
| name        | string  |         | Yes      | Name of the group of radio buttons
| id          | string  |         | Yes      | ID is prefixed to the ID of each radio button
| radios      | array   |         | Yes      | Radios array with id, value, label, checked and disabled keys

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;div class=&quot;govuk-c-radio&quot;&gt;
  &lt;input class=&quot;govuk-c-radio__input&quot; id=&quot;radio-1&quot; type=&quot;radio&quot; name=&quot;radio-group&quot; value=&quot;Yes&quot;&gt;
  &lt;label class=&quot;govuk-c-radio__label&quot; for=&quot;radio-1&quot;&gt;Yes&lt;/label&gt;
&lt;/div&gt;
&lt;div class=&quot;govuk-c-radio&quot;&gt;
  &lt;input class=&quot;govuk-c-radio__input&quot; id=&quot;radio-2&quot; type=&quot;radio&quot; name=&quot;radio-group&quot; value=&quot;No&quot;&gt;
  &lt;label class=&quot;govuk-c-radio__label&quot; for=&quot;radio-2&quot;&gt;No&lt;/label&gt;
&lt;/div&gt;
&lt;div class=&quot;govuk-c-radio&quot;&gt;
  &lt;input class=&quot;govuk-c-radio__input&quot; id=&quot;radio-3&quot; type=&quot;radio&quot; name=&quot;radio-group&quot; disabled=&quot;disabled&quot; value=&quot;NA&quot;&gt;
  &lt;label class=&quot;govuk-c-radio__label&quot; for=&quot;radio-3&quot;&gt;Not applicable&lt;/label&gt;
&lt;/div&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/radio</code></pre>

