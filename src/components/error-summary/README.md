


<h1 class="govuk-u-heading-36">
Error summary
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  Component to show an error summary box - used at the top of the page, to summarise validation errors.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/error-summary/preview">Preview the error-summary component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use error-summary can be found on <a href="http://www.linktodesignsystem.com/error-summary" title="Link to read guidance on the use of error-summary on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the error-summary component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/error-summary</code></pre>

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
  

&lt;div class=&quot;govuk-c-error-summary &quot; aria-labelledby=&quot;error-summary-title&quot; role=&quot;alert&quot; tabindex=&quot;-1&quot;&gt;

  &lt;h2 class=&quot;govuk-c-error-summary__title&quot; id=&quot;error-summary-title&quot;&gt;
    Message to alert the user to a problem goes here
  &lt;/h2&gt;

  &lt;div class=&quot;govuk-c-error-summary__body&quot;&gt;
    &lt;p&gt;
      Optional description of the errors and how to correct them
    &lt;/p&gt;
    &lt;ul class=&quot;govuk-c-list  govuk-c-error-summary__list&quot;&gt;

  &lt;li&gt;
&lt;a href=&quot;#example-error-1 &quot;&gt;        Descriptive link to the question with an error
&lt;/a&gt;  &lt;/li&gt;
  &lt;li&gt;
&lt;a href=&quot;#example-error-2 &quot;&gt;        Descriptive link to the question with an error
&lt;/a&gt;  &lt;/li&gt;

&lt;/ul&gt;

  &lt;/div&gt;

&lt;/div&gt;


</code>
</pre>


<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &quot;error-summary/macro.njk&quot; import govukErrorSummary %}

{{ govukErrorSummary(
  classes=&#39;&#39;,
  title=&#39;Message to alert the user to a problem goes here&#39;,
  description=&#39;Optional description of the errors and how to correct them&#39;,
  listClasses=&#39;&#39;,
  listItems=[
    {
      text: &#39;Descriptive link to the question with an error&#39;,
      url: &#39;#example-error-1&#39;
    },
    {
      text: &#39;Descriptive link to the question with an error&#39;,
      url: &#39;#example-error-2&#39;
    }
  ]
) }}
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
      <th class="govuk-c-table__header" scope="row"> title</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >Error summary title</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> description</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Optional error summary description</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> listItems</th>
      <td class="govuk-c-table__cell "  >array</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >List items array with url and text keys</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> url</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >List item url</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> text</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >List item text</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> listOptions</th>
      <td class="govuk-c-table__cell "  >object</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >List options</td>
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

<pre><code>npm outdated @govuk-frontend/error-summary</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/error-summary</code></pre>

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


