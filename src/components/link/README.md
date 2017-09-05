


<h1 class="govuk-u-heading-36">
Link
</h1>

<p class="govuk-u-core-24">
Link component, with the following modifiers:

`--back`
Back link - a black underlined link with a left pointing arrow. To sit at the top left of a page

`--muted`
Muted link - used for is "anything wrong with this page?" links

`--download`
Download Link - with download icon

`--skip`
Skiplink - skip to the main page content
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/link">Find link guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/link/preview">Preview the link component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;link/macro.njk&quot; import govukLink %}

{{ govukLink(
  classes=&#39;govuk-c-link--back&#39;,
  linkHref=&#39;&#39;,
  linkText=&#39;Back&#39;)
}}

{{ govukLink(
  classes=&#39;govuk-c-link--muted&#39;,
  linkHref=&#39;&#39;,
  linkText=&#39;Is there anything wrong with this page?&#39;)
}}

{{ govukLink(
  classes=&#39;govuk-c-link--download&#39;,
  linkHref=&#39;&#39;,
  tagText=&#39;Download&#39;)
}}

{{ govukLink(
  classes=&#39;govuk-c-link--skip&#39;,
  linkHref=&#39;&#39;,
  linkText=&#39;Skip to main content&#39;)
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name      | Type    | Default | Required  | Description
|---        |---      |---      |---        |---
| linkHref  | string  |         | Yes       | The value of the link href attribute
| linkText  | string  |         | Yes       | The link text
| classes   | string  |         | Yes       | The modifier required for the link type
                                            | --back
                                            | --muted
                                            | --download
                                            | --skip

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;link/macro.njk&quot; import govukLink %}

{{ govukLink(
  classes=&#39;govuk-c-link--back&#39;,
  linkHref=&#39;&#39;,
  linkText=&#39;Back&#39;)
}}

{{ govukLink(
  classes=&#39;govuk-c-link--muted&#39;,
  linkHref=&#39;&#39;,
  linkText=&#39;Is there anything wrong with this page?&#39;)
}}

{{ govukLink(
  classes=&#39;govuk-c-link--download&#39;,
  linkHref=&#39;&#39;,
  tagText=&#39;Download&#39;)
}}

{{ govukLink(
  classes=&#39;govuk-c-link--skip&#39;,
  linkHref=&#39;&#39;,
  linkText=&#39;Skip to main content&#39;)
}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/link</code></pre>

