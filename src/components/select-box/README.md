


<h1 class="govuk-u-heading-36">
Select box
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
The HTML <code>&lt;select&gt;</code> element represents a control that provides a menu of options.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/select-box/preview">Preview the select-box component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use select-box can be found on <a href="http://www.linktodesignsystem.com/select-box" title="Link to read guidance on the use of select-box on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the select-box component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/select-box</code></pre>

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



<select class="govuk-c-select-box " id="select-box-1" name="select-box-1">
  <option value="1">GOV.UK frontend option 1</option>
  <option value="2">GOV.UK frontend option 2</option>
  <option value="3">GOV.UK frontend option 3</option>
</select>




<label class="govuk-c-label " for="select-box-2">
  Label for select box


</label>

<select class="govuk-c-select-box " id="select-box-2" name="select-box-2">
  <option value="a">GOV.UK frontend option a</option>
  <option value="b"selected>GOV.UK frontend option b</option>
  <option value="c">GOV.UK frontend option c</option>
</select>

</code></pre>

<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
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

<p class="govuk-u-copy-19">Where the macros take the following arguments</p>

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

<pre><code>npm outdated @govuk-frontend/select-box</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/select-box</code></pre>

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
