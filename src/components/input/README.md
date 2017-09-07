


<h1 class="govuk-u-heading-36">
Input
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  A single-line text field.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/input/preview">Preview the input component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use input can be found on <a href="http://www.linktodesignsystem.com/input" title="Link to read guidance on the use of input on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the input component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/input</code></pre>

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
  


&lt;label class=&quot;govuk-c-label &quot; for=&quot;input-1&quot;&gt;
  National Insurance number


&lt;/label&gt;


&lt;input class=&quot;govuk-c-input &quot; id=&quot;input-1&quot; name=&quot;test-name&quot; type=&quot;text&quot; &gt;




&lt;label class=&quot;govuk-c-label &quot; for=&quot;input-2&quot;&gt;
  National Insurance number

    &lt;span class=&quot;govuk-c-label__hint&quot;&gt;It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.&lt;/span&gt;

&lt;/label&gt;


&lt;input class=&quot;govuk-c-input &quot; id=&quot;input-2&quot; name=&quot;test-name-2&quot; type=&quot;text&quot; &gt;




&lt;label class=&quot;govuk-c-label &quot; for=&quot;input-3&quot;&gt;
  National Insurance number

    &lt;span class=&quot;govuk-c-label__hint&quot;&gt;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&lt;/span&gt;

    &lt;span class=&quot;govuk-c-error-message &quot;&gt;
  Error message goes here
&lt;/span&gt;

&lt;/label&gt;


&lt;input class=&quot;govuk-c-input govuk-c-input--error&quot; id=&quot;input-3&quot; name=&quot;test-name-3&quot; type=&quot;text&quot; &gt;


</code>
</pre>


<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &quot;input/macro.njk&quot; import govukInput %}

{{ govukInput(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;&#39;,
  errorMessage=&#39;&#39;,
  id=&#39;input-1&#39;,
  name=&#39;test-name&#39;
  )
}}

{{ govukInput(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.&#39;,
  errorMessage=&#39;&#39;,
  id=&#39;input-2&#39;,
  name=&#39;test-name-2&#39;
  )
}}

{{ govukInput(
  classes=&#39;&#39;,
  labelText=&#39;National Insurance number&#39;,
  hintText=&#39;It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.&#39;,
  errorMessage=&#39;Error message goes here&#39;,
  id=&#39;input-3&#39;,
  name=&#39;test-name-3&#39;
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
      <td class="govuk-c-table__cell "  >The id of the input</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> name</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >The name of the input, which is submitted with the form data</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> value</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Optional initial value of the input</td>
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

<pre><code>npm outdated @govuk-frontend/input</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/input</code></pre>

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


