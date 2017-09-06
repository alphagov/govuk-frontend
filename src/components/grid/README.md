


<h1 class="govuk-u-heading-36">
Grid
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  Grid row with grid items.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/grid/preview">Preview the grid component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use grid can be found on <a href="http://www.linktodesignsystem.com/grid" title="Link to read guidance on the use of grid on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the grid component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/grid</code></pre>

<h2 class="govuk-u-heading-24">Requirements</h2>
<h3 class="govuk-u-bold-19">Build tool configuration</h3>
<p class="govuk-u-copy-19">When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp</p>
<pre>
<code>
  .pipe(sass({
      includePaths: 'node_modules/'
  }))
</code>
</pre>

<h3 class="govuk-u-bold-19">Static asset path configuration</h3>
<p class="govuk-u-copy-19">To show the button image you need to configure your app to show these assets. Below is a sample configuration using Express js:</p>
<pre>
<code>
app.use('/public', express.static(path.join(__dirname, '/node_modules/@govuk-frontend/icons')))
</code>
</pre>

<h2 class="govuk-u-heading-24">Quick start examples</h2>
<p class="govuk-u-copy-19"></p>
<pre><code>


<div class="govuk-c-grid ">
  <div class="govuk-c-grid__item govuk-c-grid__item--full">
     
  </div>
</div>



<div class="govuk-c-grid ">
  <div class="govuk-c-grid__item govuk-c-grid__item--one-half">
     
  </div>
  <div class="govuk-c-grid__item govuk-c-grid__item--one-half">
     
  </div>
</div>



<div class="govuk-c-grid ">
  <div class="govuk-c-grid__item govuk-c-grid__item--one-third">
     
  </div>
  <div class="govuk-c-grid__item govuk-c-grid__item--one-third">
     
  </div>
  <div class="govuk-c-grid__item govuk-c-grid__item--one-third">
     
  </div>
</div>



<div class="govuk-c-grid ">
  <div class="govuk-c-grid__item govuk-c-grid__item--two-thirds">
     
  </div>
  <div class="govuk-c-grid__item govuk-c-grid__item--one-third">
     
  </div>
</div>



<div class="govuk-c-grid ">
  <div class="govuk-c-grid__item govuk-c-grid__item--one-third">
     
  </div>
  <div class="govuk-c-grid__item govuk-c-grid__item--two-thirds">
     
  </div>
</div>



<div class="govuk-c-grid ">
  <div class="govuk-c-grid__item govuk-c-grid__item--one-quarter">
     
  </div>
  <div class="govuk-c-grid__item govuk-c-grid__item--one-quarter">
     
  </div>
  <div class="govuk-c-grid__item govuk-c-grid__item--one-quarter">
     
  </div>
  <div class="govuk-c-grid__item govuk-c-grid__item--one-quarter">
     
  </div>
</div>

</code></pre>

<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
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

<p class="govuk-u-copy-19">Where the macros take the following arguments</p>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes
| gridItems     | array   | Yes       | Grid items array with width key
| width         | string  | Yes       | Width of the grid item - full, one-half, one-third, two-thirds, one-quarter

</div>

<h3 class="govuk-u-bold-19">Setting up Nunjucks views and paths</h3>
<p class="govuk-u-copy-19">Below is an example setup using express configure views:</p>
<pre>
<code>
nunjucks.configure('node_modules/@govuk-frontend`, {
  autoescape: true,
  cache: false,
  express: app
})
</code>
</pre>

<h2 class="govuk-u-heading-24">Getting updates</h2>

<p class="govuk-u-copy-19">To check whether you have the latest version of the button run:</p>

<pre><code>npm outdated @govuk-frontend/grid</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/grid</code></pre>

<h2 class="govuk-u-heading-24">Contribution</h2>
<p class="govuk-u-copy-19">
  Guidelines can be found at <a href="https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md" title="link to contributing guidelines on our github repository">on our Github repository.</a>
</p>

<h2 class="govuk-u-heading-24">Acknowledgements/credits</h2>

<ul class="govuk-c-list ">

  <li>
        GDS developers
  </li>
  <li>
        Jani Kraner
  </li>
  <li>
        Gemma Leigh
  </li>

</ul>


<h2 class="govuk-u-heading-24">License</h2>
<p class="govuk-u-copy-19">MIT</p>
