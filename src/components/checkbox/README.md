


<h1 class="govuk-u-heading-36">
Checkbox
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  Breadcrumb navigation, showing page hierarchy.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/checkbox/preview">Preview the checkbox component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use checkbox can be found on <a href="http://www.linktodesignsystem.com/checkbox" title="Link to read guidance on the use of checkbox on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the checkbox component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/checkbox</code></pre>

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

  <div class="govuk-c-checkbox ">
    <input class="govuk-c-checkbox__input" id="waste-type-1" name="waste-types" type="checkbox" value="waste-animal"   >
    <label class="govuk-c-checkbox__label" for="waste-type-1">Waste from animal carcasses</label>
  </div>
  <div class="govuk-c-checkbox ">
    <input class="govuk-c-checkbox__input" id="waste-type-2" name="waste-types" type="checkbox" value="waste-mines"   >
    <label class="govuk-c-checkbox__label" for="waste-type-2">Waste from mines or quarries</label>
  </div>
  <div class="govuk-c-checkbox ">
    <input class="govuk-c-checkbox__input" id="waste-type-3" name="waste-types" type="checkbox" value="waste-farm"  checked >
    <label class="govuk-c-checkbox__label" for="waste-type-3">Farm or agricultural waste</label>
  </div>
  <div class="govuk-c-checkbox ">
    <input class="govuk-c-checkbox__input" id="waste-type-4" name="waste-types" type="checkbox" value="waste-disabled"   disabled>
    <label class="govuk-c-checkbox__label" for="waste-type-4">Disabled checkbox option</label>
  </div>

</code></pre>

<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &#39;checkbox/macro.njk&#39; import govukCheckbox %}

{{ govukCheckbox(
  classes=&#39;&#39;,
  name=&#39;waste-types&#39;,
  id=&#39;waste-type&#39;,
  checkboxes=[
   {
      id: &#39;1&#39;,
      value: &#39;waste-animal&#39;,
      label: &#39;Waste from animal carcasses&#39;
    },
    {
      id: &#39;2&#39;,
      value: &#39;waste-mines&#39;,
      label: &#39;Waste from mines or quarries&#39;
    },
    {
      id: &#39;3&#39;,
      value: &#39;waste-farm&#39;,
      label: &#39;Farm or agricultural waste&#39;,
      checked: &#39;true&#39;
    },
    {
      id: &#39;4&#39;,
      value: &#39;waste-disabled&#39;,
      label: &#39;Disabled checkbox option&#39;,
      disabled: &#39;true&#39;
    }
  ]
) }}
</code></pre>

<p class="govuk-u-copy-19">Where the macros take the following arguments</p>

<div>


<!-- TODO: Use the table macro here and pass it component argument data -->

| Name        | Type    | Default | Required | Description
|---          |---      |---      |---       |---
| classes     | string  |         | No       | Optional additional classes
| name        | string  |         | Yes      | Name of the group of checkboxes
| id          | string  |         | Yes      | ID is prefixed to the ID of each checkbox
| checkboxes  | array   |         | Yes      | Checkboxes array with id, value, label, checked and disabled keys


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

<pre><code>npm outdated @govuk-frontend/checkbox</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/checkbox</code></pre>

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
