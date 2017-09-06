


<h1 class="govuk-u-heading-36">
Checkbox
</h1>

<p class="govuk-u-core-24">
  Breadcrumb navigation, showing page hierarchy.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/checkbox">Find checkbox guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/checkbox/preview">Preview the checkbox component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &#39;checkbox/macro.njk&#39; import govukCheckbox %}

{{ govukCheckbox(
  classes=&#39;&#39;,
  name=&#39;waste-types&#39;,
  id=&#39;waste-type&#39;,
  checkboxes=[
   {
      id: &#39;1&#39;,
      value: &#39;waste-animal&#39;,
      label: &#39;Waste from animal carcasses&#39;
    },
    {
      id: &#39;2&#39;,
      value: &#39;waste-mines&#39;,
      label: &#39;Waste from mines or quarries&#39;
    },
    {
      id: &#39;3&#39;,
      value: &#39;waste-farm&#39;,
      label: &#39;Farm or agricultural waste&#39;,
      checked: &#39;true&#39;
    },
    {
      id: &#39;4&#39;,
      value: &#39;waste-disabled&#39;,
      label: &#39;Disabled checkbox option&#39;,
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
| name        | string  |         | Yes      | Name of the group of checkboxes
| id          | string  |         | Yes      | ID is prefixed to the ID of each checkbox
| checkboxes  | array   |         | Yes      | Checkboxes array with id, value, label, checked and disabled keys


</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;div class=&quot;govuk-c-checkbox&quot;&gt;
  &lt;input class=&quot;govuk-c-checkbox__input&quot; id=&quot;waste-type-1&quot; name=&quot;waste-types&quot; type=&quot;checkbox&quot; value=&quot;waste-animal&quot;&gt;
  &lt;label class=&quot;govuk-c-checkbox__label&quot; for=&quot;waste-type-1&quot;&gt;Waste from animal carcasses&lt;/label&gt;
&lt;/div&gt;
&lt;div class=&quot;govuk-c-checkbox&quot;&gt;
  &lt;input class=&quot;govuk-c-checkbox__input&quot; id=&quot;waste-type-2&quot; name=&quot;waste-types&quot; type=&quot;checkbox&quot; value=&quot;waste-mines&quot;&gt;
  &lt;label class=&quot;govuk-c-checkbox__label&quot; for=&quot;waste-type-2&quot;&gt;Waste from mines or quarries&lt;/label&gt;
&lt;/div&gt;
&lt;div class=&quot;govuk-c-checkbox&quot;&gt;
  &lt;input class=&quot;govuk-c-checkbox__input&quot; id=&quot;waste-type-3&quot; name=&quot;waste-types&quot; type=&quot;checkbox&quot; disabled=&quot;disabled&quot; value=&quot;waste-farm&quot;&gt;
  &lt;label class=&quot;govuk-c-checkbox__label&quot; for=&quot;waste-type-3&quot;&gt;Farm or agricultural waste&lt;/label&gt;
&lt;/div&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/checkbox</code></pre>

