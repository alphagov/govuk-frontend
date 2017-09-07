


<h1 class="govuk-u-heading-36">
Label
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  Use labels for all form fields.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/label/preview">Preview the label component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use label can be found on <a href="http://www.linktodesignsystem.com/label" title="Link to read guidance on the use of label on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the label component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/label</code></pre>

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
  

&lt;label class=&quot;govuk-c-label &quot; for=&quot;&quot;&gt;
  National Insurance number

    &lt;span class=&quot;govuk-c-label__hint&quot;&gt;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&lt;/span&gt;

&lt;/label&gt;



&lt;label class=&quot;govuk-c-label  govuk-c-label--bold &quot; for=&quot;&quot;&gt;
  National Insurance number

    &lt;span class=&quot;govuk-c-label__hint&quot;&gt;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&lt;/span&gt;

&lt;/label&gt;



&lt;label class=&quot;govuk-c-label &quot; for=&quot;&quot;&gt;
  National Insurance number

    &lt;span class=&quot;govuk-c-label__hint&quot;&gt;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&lt;/span&gt;

    &lt;span class=&quot;govuk-c-error-message &quot;&gt;
  Error message goes here
&lt;/span&gt;

&lt;/label&gt;


</code>
</pre>


<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &quot;label/macro.njk&quot; import govukLabel %}

{{ govukLabel(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&#39;,
  id=&#39;&#39;
  )
}}

{{ govukLabel(
  classes=&#39;govuk-c-label--bold&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&#39;,
  id=&#39;&#39;
  )
}}

{{ govukLabel(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&#39;,
  errorMessage=&#39;Error message goes here&#39;,
  id=&#39;&#39;
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
      <th class="govuk-c-table__header" scope="row"> labelText</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >The label text</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> hintText</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Optional hint text</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> errorMessage</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Optional error message</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> id</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >The value of the for attribute, the id input the label is associated with</td>
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

<pre><code>npm outdated @govuk-frontend/label</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/label</code></pre>

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


