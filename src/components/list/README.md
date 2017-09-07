


<h1 class="govuk-u-heading-36">
List
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  Breadcrumb navigation, showing page hierarchy.
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/list/preview">Preview the list component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use list can be found on <a href="http://www.linktodesignsystem.com/list" title="Link to read guidance on the use of list on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the list component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/list</code></pre>

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
  
&lt;ul class=&quot;govuk-c-list &quot;&gt;

  &lt;li&gt;
&lt;a href=&quot;/ &quot;&gt;        Related link
&lt;/a&gt;  &lt;/li&gt;
  &lt;li&gt;
&lt;a href=&quot;/ &quot;&gt;        Related link
&lt;/a&gt;  &lt;/li&gt;
  &lt;li&gt;
&lt;a href=&quot;/ &quot;&gt;        Related link
&lt;/a&gt;  &lt;/li&gt;

&lt;/ul&gt;


&lt;ul class=&quot;govuk-c-list govuk-c-list--bullet &quot;&gt;

  &lt;li&gt;
        here is a bulleted list
  &lt;/li&gt;
  &lt;li&gt;
        here is the second bulleted list item
  &lt;/li&gt;
  &lt;li&gt;
        here is the third bulleted list item
  &lt;/li&gt;

&lt;/ul&gt;


&lt;ol class=&quot;govuk-c-list govuk-c-list--number &quot;&gt;

  &lt;li&gt;
        This is a numbered list.
  &lt;/li&gt;
  &lt;li&gt;
        This is the second step in a numbered list.
  &lt;/li&gt;
  &lt;li&gt;
        The third step is to make sure each item is a full sentence ending with a full stop.
  &lt;/li&gt;

&lt;/ol&gt;


&lt;ol class=&quot;govuk-c-list govuk-c-list--icon &quot;&gt;

  &lt;li&gt;
      &lt;span class=&quot;govuk-c-list__icon govuk-u-circle &quot;&gt;1&lt;/span&gt;
      Step 1
  &lt;/li&gt;
  &lt;li&gt;
      &lt;span class=&quot;govuk-c-list__icon govuk-u-circle &quot;&gt;2&lt;/span&gt;
      Step 2
  &lt;/li&gt;
  &lt;li&gt;
      &lt;span class=&quot;govuk-c-list__icon govuk-u-circle &quot;&gt;3&lt;/span&gt;
      Step 3
  &lt;/li&gt;

&lt;/ol&gt;


&lt;ol class=&quot;govuk-c-list govuk-c-list--icon &quot;&gt;

  &lt;li&gt;
      &lt;span class=&quot;govuk-c-list__icon govuk-u-circle govuk-c-list__icon--large&quot;&gt;1&lt;/span&gt;
      Step 1 Large icon
  &lt;/li&gt;
  &lt;li&gt;
      &lt;span class=&quot;govuk-c-list__icon govuk-u-circle govuk-c-list__icon--large&quot;&gt;2&lt;/span&gt;
      Step 2 Large icon
  &lt;/li&gt;
  &lt;li&gt;
      &lt;span class=&quot;govuk-c-list__icon govuk-u-circle govuk-c-list__icon--large&quot;&gt;3&lt;/span&gt;
      Step 3 Large icon
  &lt;/li&gt;

&lt;/ol&gt;


</code>
</pre>


<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &quot;list/macro.njk&quot; import govukList %}

{{ govukList(
  classes=&#39;&#39;,
  [
    {
      text: &#39;Related link&#39;,
      url: &#39;/&#39;
    },
    {
      text: &#39;Related link&#39;,
      url: &#39;/&#39;
    },
    {
      text: &#39;Related link&#39;,
      url: &#39;/&#39;
    }
  ]
) }}

{{ govukList(
  classes=&#39;&#39;,
  [
    {
      text: &#39;here is a bulleted list&#39;
    },
    {
      text: &#39;here is the second bulleted list item&#39;
    },
    {
      text: &#39;here is the third bulleted list item&#39;
    }
  ],
  options = {
    &#39;isBullet&#39;: &#39;true&#39;
  }
) }}

{{ govukList(
  classes=&#39;&#39;,
  [
    {
      text: &#39;This is a numbered list.&#39;
    },
    {
      text: &#39;This is the second step in a numbered list.&#39;
    },
    {
      text: &#39;The third step is to make sure each item is a full sentence ending with a full stop.&#39;
    }
  ],
  options = {
    &#39;isNumber&#39;: &#39;true&#39;
  }
) }}

{{ govukList(
  classes=&#39;&#39;,
  [
    {
      text: &#39;Step 1&#39;
    },
    {
      text: &#39;Step 2&#39;
    },
    {
      text: &#39;Step 3&#39;
    }
  ],
  options = {
    &#39;isStep&#39;: &#39;true&#39;
  }
) }}

{{ govukList(
  classes=&#39;&#39;,
  [
    {
      text: &#39;Step 1 Large icon&#39;
    },
    {
      text: &#39;Step 2 Large icon&#39;
    },
    {
      text: &#39;Step 3 Large icon&#39;
    }
  ],
  options = {
    &#39;isStepLarge&#39;: &#39;true&#39;
  }
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
      <th class="govuk-c-table__header" scope="row"> options</th>
      <td class="govuk-c-table__cell "  >object</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Options object</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> options.isBullet</th>
      <td class="govuk-c-table__cell "  ></td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Creates bulleted list</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> options.isNumber</th>
      <td class="govuk-c-table__cell "  ></td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Creates numbered list</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> options.isStep</th>
      <td class="govuk-c-table__cell "  ></td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Creates list of steps</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> options.isStepLarge</th>
      <td class="govuk-c-table__cell "  ></td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Creates list of steps with large icons</td>
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

<pre><code>npm outdated @govuk-frontend/list</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/list</code></pre>

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
