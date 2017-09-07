


<h1 class="govuk-u-heading-36">
Table
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  Table description.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/table/preview">Preview the table component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use table can be found on <a href="http://www.linktodesignsystem.com/table" title="Link to read guidance on the use of table on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the table component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/table</code></pre>

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
  

&lt;table class=&quot;govuk-c-table &quot;&gt;
  &lt;caption class=&quot;govuk-c-table__caption  small &quot;&gt;Months and rates&lt;/caption&gt;
  &lt;tbody class=&quot;govuk-c-table__body&quot;&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt; January&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£85&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£95&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt; February&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£75&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£55&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt; March&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£165&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£125&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;



&lt;table class=&quot;govuk-c-table &quot;&gt;
  &lt;thead class=&quot;govuk-c-table__head&quot;&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header &quot;   scope=&quot;col&quot;&gt;Month you apply&lt;/th&gt;
      &lt;th class=&quot;govuk-c-table__header  govuk-c-table__header--numeric &quot;   scope=&quot;col&quot;&gt;Rate for bicycles&lt;/th&gt;
      &lt;th class=&quot;govuk-c-table__header  govuk-c-table__header--numeric &quot;   scope=&quot;col&quot;&gt;Rate for vehicles&lt;/th&gt;
  &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody class=&quot;govuk-c-table__body&quot;&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt; January&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£85&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£95&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt; February&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£75&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£55&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr class=&quot;govuk-c-table__row&quot;&gt;
      &lt;th class=&quot;govuk-c-table__header&quot; scope=&quot;row&quot;&gt; March&lt;/th&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£165&lt;/td&gt;
      &lt;td class=&quot;govuk-c-table__cell  govuk-c-table__cell--numeric &quot;  &gt;£125&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;


</code>
</pre>


<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &#39;table/macro.njk&#39; import govukTable %}

{# table with a caption #}
{{ govukTable(
  classes=&#39;&#39;,
  options = {
    &#39;caption&#39;: &#39;Months and rates&#39;,
    &#39;captionSize&#39;: &#39;small&#39;,
    &#39;isFirstCellHeader&#39;: &#39;true&#39;
  },
  data = {
    &#39;rows&#39; : [
      [
        {
          text: &#39;January&#39;
        },
        {
          text: &#39;£85&#39;,
          type: &#39;numeric&#39;
        },
        {
          text: &#39;£95&#39;,
          type: &#39;numeric&#39;
        }
      ],
      [
        {
          text: &#39;February&#39;
        },
        {
          text: &#39;£75&#39;,
          type: &#39;numeric&#39;
        },
        {
          text: &#39;£55&#39;,
          type: &#39;numeric&#39;
        }
      ],
      [
        {
          text: &#39;March&#39;
        },
        {
          text: &#39;£165&#39;,
          type: &#39;numeric&#39;
        },
        {
          text: &#39;£125&#39;,
          type: &#39;numeric&#39;
        }
      ]
    ]
  }
)}}

{# table with a head #}
{{ govukTable(
  classes=&#39;&#39;,
  options = {
    &#39;isFirstCellHeader&#39;: &#39;true&#39;
  },
  data = {
    &#39;head&#39; : [
      {
        text: &#39;Month you apply&#39;
      },
      {
        text: &#39;Rate for bicycles&#39;,
        type: &#39;numeric&#39;
      },
      {
        text: &#39;Rate for vehicles&#39;,
        type: &#39;numeric&#39;
      }
    ],
    &#39;rows&#39; : [
      [
        {
          text: &#39;January&#39;
        },
        {
          text: &#39;£85&#39;,
          type: &#39;numeric&#39;
        },
        {
          text: &#39;£95&#39;,
          type: &#39;numeric&#39;
        }
      ],
      [
        {
          text: &#39;February&#39;
        },
        {
          text: &#39;£75&#39;,
          type: &#39;numeric&#39;
        },
        {
          text: &#39;£55&#39;,
          type: &#39;numeric&#39;
        }
      ],
      [
        {
          text: &#39;March&#39;
        },
        {
          text: &#39;£165&#39;,
          type: &#39;numeric&#39;
        },
        {
          text: &#39;£125&#39;,
          type: &#39;numeric&#39;
        }
      ]
    ]
  }
)}}
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
      <th class="govuk-c-table__header" scope="row"> data</th>
      <td class="govuk-c-table__cell "  >array</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >Data array with text and type keys</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> options</th>
      <td class="govuk-c-table__cell "  >array</td>
      <td class="govuk-c-table__cell "  >Yes</td>
      <td class="govuk-c-table__cell "  >Options array with caption, captionSize and isFirstCellHeader keys</td>
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

<pre><code>npm outdated @govuk-frontend/table</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/table</code></pre>

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


