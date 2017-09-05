


<h1 class="govuk-u-heading-36">
Grid
</h1>

<p class="govuk-u-core-24">
  Grid row with grid items.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/grid">Find grid guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/grid/preview">Preview the grid component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code>{% from &quot;grid/macro.njk&quot; import govukGrid %}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;full&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;one-half&#39; },
    { width: &#39;one-half&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;one-third&#39; },
    { width: &#39;one-third&#39; },
    { width: &#39;one-third&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;two-thirds&#39; },
    { width: &#39;one-third&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;one-third&#39; },
    { width: &#39;two-thirds&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;one-quarter&#39; },
    { width: &#39;one-quarter&#39; },
    { width: &#39;one-quarter&#39; },
    { width: &#39;one-quarter&#39; }
  ]
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes
| gridItems     | array   | Yes       | Grid items array with width key
| width         | string  | Yes       | Width of the grid item - full, one-half, one-third, two-thirds, one-quarter

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>{% from &quot;grid/macro.njk&quot; import govukGrid %}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;full&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;one-half&#39; },
    { width: &#39;one-half&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;one-third&#39; },
    { width: &#39;one-third&#39; },
    { width: &#39;one-third&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;two-thirds&#39; },
    { width: &#39;one-third&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;one-third&#39; },
    { width: &#39;two-thirds&#39; }
  ]
  )
}}

{{ govukGrid(
  classes=&#39;&#39;,
  gridItems=[
    { width: &#39;one-quarter&#39; },
    { width: &#39;one-quarter&#39; },
    { width: &#39;one-quarter&#39; },
    { width: &#39;one-quarter&#39; }
  ]
  )
}}
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/grid</code></pre>

