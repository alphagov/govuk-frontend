


<h1 class="govuk-u-heading-36">
Details
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  Component for conditionally revealing content, using the details HTML element.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/details/preview">Preview the details component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use details can be found on <a href="http://www.linktodesignsystem.com/details" title="Link to read guidance on the use of details on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the details component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/details</code></pre>

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
<pre>
<code>
  
&lt;details class=&quot;govuk-c-details &quot;&gt;
  &lt;summary class=&quot;govuk-c-details__summary&quot;&gt;
    &lt;span class=&quot;govuk-c-details__summary-text&quot;&gt;Help with nationality&lt;/span&gt;
  &lt;/summary&gt;
  &lt;div class=&quot;govuk-c-border govuk-c-border--left-narrow&quot;&gt;
    &lt;div class=&quot;govuk-c-details__text&quot;&gt;
      &lt;p&gt;
    If you’re not sure about your nationality, try to find out from an official document like a passport or national ID card.
  &lt;/p&gt;
  &lt;p&gt;
    We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.
  &lt;/p&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/details&gt;


</code>
</pre>


<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &quot;details/macro.njk&quot; import govukDetails %}

{{ govukDetails(
  classes=&#39;&#39;,
  detailsSummaryText=&#39;Help with nationality&#39;,
  detailsText=&#39;&lt;p&gt;
    If you’re not sure about your nationality, try to find out from an official document like a passport or national ID card.
  &lt;/p&gt;
  &lt;p&gt;
    We need to know your nationality so we can work out which elections you’re entitled to vote in. If you can’t provide your nationality, you’ll have to send copies of identity documents through the post.
  &lt;/p&gt;&#39;
  )
}}
</code></pre>

<p class="govuk-u-copy-19">Where the macros take the following arguments</p>

<h2 class="govuk-u-heading-24">Component arguments</h2>
<div>
<table class="govuk-c-table ">
  <thead class="govuk-c-table__head">
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header "   scope="col">Name</th>
      <th class="govuk-c-table__header "   scope="col">Type</th>
      <th class="govuk-c-table__header "   scope="col">Required</th>
      <th class="govuk-c-table__header "   scope="col">Description</th>
  </tr>
  </thead>
  <tbody class="govuk-c-table__body">
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> classes</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Optional additional classes</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> detailsSummaryText</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >Summary element text</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> detailsText</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >Revealed details text</td>
    </tr>
  </tbody>
</table>

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

<pre><code>npm outdated @govuk-frontend/details</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/details</code></pre>

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


