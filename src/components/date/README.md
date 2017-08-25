


<h1 class="govuk-u-heading-36">
Date
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  A component for entering dates, for example - date of birth.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/date/preview">Preview the date component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use date can be found on <a href="http://www.linktodesignsystem.com/date" title="Link to read guidance on the use of date on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the date component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/date</code></pre>

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
  

&lt;fieldset class=&quot;govuk-c-fieldset For example, 31 3 1980&quot;&gt;
  &lt;legend class=&quot;govuk-c-fieldset__legend&quot;&gt;
    What is your date of birth?
  &lt;/legend&gt;
&lt;/fieldset&gt;



&lt;fieldset class=&quot;govuk-c-fieldset For example, 31 3 1980&quot;&gt;
  &lt;legend class=&quot;govuk-c-fieldset__legend&quot;&gt;
    What is your date of birth?
  &lt;/legend&gt;
&lt;/fieldset&gt;



&lt;fieldset class=&quot;govuk-c-fieldset For example, 31 3 1980&quot;&gt;
  &lt;legend class=&quot;govuk-c-fieldset__legend&quot;&gt;
    What is your date of birth?
  &lt;/legend&gt;
&lt;/fieldset&gt;



&lt;fieldset class=&quot;govuk-c-fieldset For example, 31 3 1980&quot;&gt;
  &lt;legend class=&quot;govuk-c-fieldset__legend&quot;&gt;
    What is your date of birth?
  &lt;/legend&gt;
&lt;/fieldset&gt;



&lt;fieldset class=&quot;govuk-c-fieldset For example, 31 3 1980&quot;&gt;
  &lt;legend class=&quot;govuk-c-fieldset__legend&quot;&gt;
    What is your date of birth?
  &lt;/legend&gt;
&lt;/fieldset&gt;

</code>
</pre>


<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &quot;date/macro.njk&quot; import govukDate %}

{{ govukDate(
  fieldsetClasses=&#39;&#39;,
  legendText=&#39;What is your date of birth?&#39;,
  legendHintText=&#39;For example, 31 3 1980&#39;,
  legendErrorMessage=&#39;&#39;,
  id=&#39;dob&#39;,
  name=&#39;dob&#39;,
  dateItems=[
    {
      name: &#39;day&#39;,
      error: &#39;&#39;
    },
    {
      name: &#39;month&#39;,
      error: &#39;&#39;
    },
    {
      name: &#39;year&#39;,
      error: &#39;&#39;
    }
  ]
  )
}}

{{ govukDate(
  fieldsetClasses=&#39;&#39;,
  legendText=&#39;What is your date of birth?&#39;,
  legendHintText=&#39;For example, 31 3 1980&#39;,
  legendErrorMessage=&#39;Error message goes here&#39;,
  id=&#39;dob&#39;,
  name=&#39;dob&#39;,
  dateItems=[
    {
      name: &#39;day&#39;,
      error: &#39;true&#39;
    },
    {
      name: &#39;month&#39;,
      error: &#39;true&#39;
    },
    {
      name: &#39;year&#39;,
      error: &#39;true&#39;
    }
  ]
  )
}}

{{ govukDate(
  fieldsetClasses=&#39;&#39;,
  legendText=&#39;What is your date of birth?&#39;,
  legendHintText=&#39;For example, 31 3 1980&#39;,
  legendErrorMessage=&#39;Error message goes here&#39;,
  id=&#39;dob-day-error&#39;,
  name=&#39;dob-day-error&#39;,
  dateItems=[
    {
      name: &#39;day&#39;,
      error: &#39;true&#39;
    },
    {
      name: &#39;month&#39;,
      error: &#39;&#39;
    },
    {
      name: &#39;year&#39;,
      error: &#39;&#39;
    }
  ]
  )
}}

{{ govukDate(
  fieldsetClasses=&#39;&#39;,
  legendText=&#39;What is your date of birth?&#39;,
  legendHintText=&#39;For example, 31 3 1980&#39;,
  legendErrorMessage=&#39;Error message goes here&#39;,
  id=&#39;dob-month-error&#39;,
  name=&#39;dob-month-error&#39;,
  dateItems=[
    {
      name: &#39;day&#39;,
      error: &#39;&#39;
    },
    {
      name: &#39;month&#39;,
      error: &#39;true&#39;
    },
    {
      name: &#39;year&#39;,
      error: &#39;&#39;
    }
  ]
  )
}}

{{ govukDate(
  fieldsetClasses=&#39;&#39;,
  legendText=&#39;What is your date of birth?&#39;,
  legendHintText=&#39;For example, 31 3 1980&#39;,
  legendErrorMessage=&#39;Error message goes here&#39;,
  id=&#39;dob-year-error&#39;,
  name=&#39;dob-year-error&#39;,
  dateItems=[
    {
      name: &#39;day&#39;,
      error: &#39;&#39;
    },
    {
      name: &#39;month&#39;,
      error: &#39;&#39;
    },
    {
      name: &#39;year&#39;,
      error: &#39;true&#39;
    }
  ]
  )
}}</code></pre>

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
      <th class="govuk-c-table__header" scope="row"> fieldsetClasses</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Optional additional classes</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> legendText</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Legend text</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> legendHintText</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Optional legend hint text</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> legendErrorMessage</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Optional legend error message</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> id</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Ids of date items</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> Names of date items</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >name of each date input</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> dateItems</th>
      <td class="govuk-c-table__cell "  >object</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >dateItems object with name and error keys</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> dateItems.name</th>
      <td class="govuk-c-table__cell "  ></td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >Name of date item, for example - Day, Month or Year</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> dateItems.error</th>
      <td class="govuk-c-table__cell "  ></td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >Set error for date item</td>
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

<pre><code>npm outdated @govuk-frontend/date</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/date</code></pre>

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


