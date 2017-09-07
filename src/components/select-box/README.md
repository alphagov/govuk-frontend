


<h1 class="govuk-u-heading-36">
Select box
</h1>

<p class="govuk-u-core-24">
The HTML <code>&lt;select&gt;</code> element represents a control that provides a menu of options.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/select-box">Find select-box guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/select-box/preview">Preview the select-box component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;select-box/macro.njk&quot; import govukSelectBox %}


{{ govukSelectBox(
  classes=&#39;&#39;,
  id=&#39;select-box-1&#39;,
  name=&#39;select-box-1&#39;,
  options=[
    {
      value: &#39;1&#39;,
      label: &#39;GOV.UK frontend option 1&#39;
    },
    {
      value: &#39;2&#39;,
      label: &#39;GOV.UK frontend option 2&#39;
    },
    {
      value: &#39;3&#39;,
      label: &#39;GOV.UK frontend option 3&#39;
    }
  ]
)}}

{{ govukSelectBox(
  hasLabelWithText=&#39;Label for select box&#39;,
  labelClasses=&#39;&#39;,
  classes=&#39;&#39;,
  id=&#39;select-box-2&#39;,
  name=&#39;select-box-2&#39;,
  options=[
    {
      value: &#39;a&#39;,
      label: &#39;GOV.UK frontend option a&#39;
    },
    {
      value: &#39;b&#39;,
      label: &#39;GOV.UK frontend option b&#39;,
      selected: &#39;true&#39;
    },
    {
      value: &#39;c&#39;,
      label: &#39;GOV.UK frontend option c&#39;
    }
  ]
)}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name             | Type    | Default | Required | Description
|---               |---      |---      |---       |---
| classes          | string  |         | No       | Optional additional classes
| id               | string  |         | Yes      | Id for each select box
| name             | string  |         | Yes      | Name for each select box
| options          | array   |         | Yes      | Options array with value, label, selected keys
| hasLabelWithText | string  |         | No       | Optional to provide label text that will render the label element
| labelClasses     | string  |         | No       | Optional to provide label with custom classes

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;select-box/macro.njk&quot; import govukSelectBox %}


{{ govukSelectBox(
  classes=&#39;&#39;,
  id=&#39;select-box-1&#39;,
  name=&#39;select-box-1&#39;,
  options=[
    {
      value: &#39;1&#39;,
      label: &#39;GOV.UK frontend option 1&#39;
    },
    {
      value: &#39;2&#39;,
      label: &#39;GOV.UK frontend option 2&#39;
    },
    {
      value: &#39;3&#39;,
      label: &#39;GOV.UK frontend option 3&#39;
    }
  ]
)}}

{{ govukSelectBox(
  hasLabelWithText=&#39;Label for select box&#39;,
  labelClasses=&#39;&#39;,
  classes=&#39;&#39;,
  id=&#39;select-box-2&#39;,
  name=&#39;select-box-2&#39;,
  options=[
    {
      value: &#39;a&#39;,
      label: &#39;GOV.UK frontend option a&#39;
    },
    {
      value: &#39;b&#39;,
      label: &#39;GOV.UK frontend option b&#39;,
      selected: &#39;true&#39;
    },
    {
      value: &#39;c&#39;,
      label: &#39;GOV.UK frontend option c&#39;
    }
  ]
)}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/select-box</code></pre>

