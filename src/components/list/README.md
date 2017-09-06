


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
<pre><code>

<ul class="govuk-c-list ">

  <li>
<a href="/ ">        Related link
</a>  </li>
  <li>
<a href="/ ">        Related link
</a>  </li>
  <li>
<a href="/ ">        Related link
</a>  </li>

</ul>


<ul class="govuk-c-list govuk-c-list--bullet ">

  <li>
        here is a bulleted list
  </li>
  <li>
        here is the second bulleted list item
  </li>
  <li>
        here is the third bulleted list item
  </li>

</ul>


<ol class="govuk-c-list govuk-c-list--number ">

  <li>
        This is a numbered list.
  </li>
  <li>
        This is the second step in a numbered list.
  </li>
  <li>
        The third step is to make sure each item is a full sentence ending with a full stop.
  </li>

</ol>


<ol class="govuk-c-list govuk-c-list--icon ">

  <li>
      <span class="govuk-c-list__icon govuk-u-circle ">1</span>
      Step 1
  </li>
  <li>
      <span class="govuk-c-list__icon govuk-u-circle ">2</span>
      Step 2
  </li>
  <li>
      <span class="govuk-c-list__icon govuk-u-circle ">3</span>
      Step 3
  </li>

</ol>


<ol class="govuk-c-list govuk-c-list--icon ">

  <li>
      <span class="govuk-c-list__icon govuk-u-circle govuk-c-list__icon--large">1</span>
      Step 1 Large icon
  </li>
  <li>
      <span class="govuk-c-list__icon govuk-u-circle govuk-c-list__icon--large">2</span>
      Step 2 Large icon
  </li>
  <li>
      <span class="govuk-c-list__icon govuk-u-circle govuk-c-list__icon--large">3</span>
      Step 3 Large icon
  </li>

</ol>

</code></pre>

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

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name                | Type   | Default | Required | Description
|---                  |---     |---      |---       |---
| classes             | string |         | No       | Optional additional classes
| listItems           | array  |         | Yes      | List items array with url and text keys
| url                 | string |         | Yes      | List item url
| text                | string |         | Yes      | List item text
| options             | object |         | No       | Options object
| options.isBullet    |        |         | No       | Creates bulleted list
| options.isNumber    |        |         | No       | Creates numbered list
| options.isStep      |        |         | No       | Creates list of steps
| options.isStepLarge |        |         | No       | Creates list of steps with large icons

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
