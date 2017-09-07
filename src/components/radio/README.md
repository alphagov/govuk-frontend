


<h1 class="govuk-u-heading-36">
Radio
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  A radio button is a GOV.UK element that allows users to answer a question by selecting an option. If you have a question with more than one option you should stack radio buttons.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/radio/preview">Preview the radio component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use radio can be found on <a href="http://www.linktodesignsystem.com/radio" title="Link to read guidance on the use of radio on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the radio component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19">Please note, this component depends on @govuk-frontend/globals, which will automatically be installed with the package.
</p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/radio</code></pre>

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
  
  &lt;div class=&quot;govuk-c-radio&quot;&gt;
    &lt;input class=&quot;govuk-c-radio__input &quot; id=&quot;radio-1&quot; name=&quot;radio-group&quot; type=&quot;radio&quot; value=&quot;Yes&quot;  &gt;
    &lt;label class=&quot;govuk-c-radio__label&quot; for=&quot;radio-1&quot;&gt;Yes&lt;/label&gt;
  &lt;/div&gt;
  &lt;div class=&quot;govuk-c-radio&quot;&gt;
    &lt;input class=&quot;govuk-c-radio__input &quot; id=&quot;radio-2&quot; name=&quot;radio-group&quot; type=&quot;radio&quot; value=&quot;No&quot;  &gt;
    &lt;label class=&quot;govuk-c-radio__label&quot; for=&quot;radio-2&quot;&gt;No&lt;/label&gt;
  &lt;/div&gt;
  &lt;div class=&quot;govuk-c-radio&quot;&gt;
    &lt;input class=&quot;govuk-c-radio__input &quot; id=&quot;radio-3&quot; name=&quot;radio-group&quot; type=&quot;radio&quot; value=&quot;No&quot; checked &gt;
    &lt;label class=&quot;govuk-c-radio__label&quot; for=&quot;radio-3&quot;&gt;No&lt;/label&gt;
  &lt;/div&gt;
  &lt;div class=&quot;govuk-c-radio&quot;&gt;
    &lt;input class=&quot;govuk-c-radio__input &quot; id=&quot;radio-4&quot; name=&quot;radio-group&quot; type=&quot;radio&quot; value=&quot;NA&quot;  disabled&gt;
    &lt;label class=&quot;govuk-c-radio__label&quot; for=&quot;radio-4&quot;&gt;Not applicable&lt;/label&gt;
  &lt;/div&gt;


</code>
</pre>


<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &#39;radio/macro.njk&#39; import govukRadio %}

{{ govukRadio(
  classes=&#39;&#39;,
  name=&#39;radio-group&#39;,
  id=&#39;radio&#39;,
  radios=[
   {
      id: &#39;1&#39;,
      value: &#39;Yes&#39;,
      label: &#39;Yes&#39;
    },
    {
      id: &#39;2&#39;,
      value: &#39;No&#39;,
      label: &#39;No&#39;
    },
    {
      id: &#39;3&#39;,
      value: &#39;No&#39;,
      label: &#39;No&#39;,
      checked: &#39;true&#39;
    },
    {
      id: &#39;4&#39;,
      value: &#39;NA&#39;,
      label: &#39;Not applicable&#39;,
      disabled: &#39;true&#39;
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
      <th class="govuk-c-table__header" scope="row"> name</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >Name of the group of radio buttons</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> id</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >ID is prefixed to the ID of each radio button</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> radios</th>
      <td class="govuk-c-table__cell "  >array</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >Radios array with id, value, label, checked and disabled keys</td>
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

<pre><code>npm outdated @govuk-frontend/radio</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/radio</code></pre>

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


