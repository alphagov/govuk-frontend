


<h1 class="govuk-u-heading-36">
Button
</h1>

<p class="govuk-u-core-24">
  Breadcrumb navigation, showing page hierarchy.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/button">Find button guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/button/preview">Preview the button component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;button/macro.njk&quot; import govukButton %}

{{ govukButton(classes=&#39;&#39;, text=&#39;Save and continue&#39;) }}

{{ govukButton(classes=&#39;&#39;, text=&#39;Save and continue&#39;, isDisabled=&#39;true&#39;) }}

{{ govukButton(classes=&#39;&#39;, text=&#39;Start now&#39;, url=&#39;/&#39;, isStart=&#39;true&#39;) }}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>


<!-- TODO: Use the table macro here and pass it component argument data -->

| Name       | Type    | Default | Required | Description
|---         |---      |---      |---       |---
| classes    | string  |         | No       | Optional additional classes
| text       | string  |         | Yes      | Button or link text
| isStart    | boolean |         | No       | Adds the class govuk-c-button--start for a "Start now" button
| isDisabled | boolean |         | No       | Disables the button - adds the class govuk-c-button--disabled and sets disabled="disabled" and aria-disabled="true"
| url        | string  |         | No       | Url that the hyperlink points to


</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;button/macro.njk&quot; import govukButton %}

{{ govukButton(classes=&#39;&#39;, text=&#39;Save and continue&#39;) }}

{{ govukButton(classes=&#39;&#39;, text=&#39;Save and continue&#39;, isDisabled=&#39;true&#39;) }}

{{ govukButton(classes=&#39;&#39;, text=&#39;Start now&#39;, url=&#39;/&#39;, isStart=&#39;true&#39;) }}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/button</code></pre>

