


<h1 class="govuk-u-heading-36">
Link
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
Link component, with the following modifiers:

`--back`
Back link - a black underlined link with a left pointing arrow. To sit at the top left of a page

`--muted`
Muted link - used for is "anything wrong with this page?" links

`--download`
Download Link - with download icon

`--skip`
Skiplink - skip to the main page content
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/link/preview">Preview the link component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use link can be found on <a href="http://www.linktodesignsystem.com/link" title="Link to read guidance on the use of link on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the link component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/link</code></pre>

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

<a href="" class="govuk-c-link govuk-c-link--back">Back</a>


<a href="" class="govuk-c-link govuk-c-link--muted">Is there anything wrong with this page?</a>


<a href="" class="govuk-c-link govuk-c-link--download"></a>


<a href="" class="govuk-c-link govuk-c-link--skip">Skip to main content</a>

</code></pre>

<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &quot;link/macro.njk&quot; import govukLink %}

{{ govukLink(
  classes=&#39;govuk-c-link--back&#39;,
  linkHref=&#39;&#39;,
  linkText=&#39;Back&#39;)
}}

{{ govukLink(
  classes=&#39;govuk-c-link--muted&#39;,
  linkHref=&#39;&#39;,
  linkText=&#39;Is there anything wrong with this page?&#39;)
}}

{{ govukLink(
  classes=&#39;govuk-c-link--download&#39;,
  linkHref=&#39;&#39;,
  tagText=&#39;Download&#39;)
}}

{{ govukLink(
  classes=&#39;govuk-c-link--skip&#39;,
  linkHref=&#39;&#39;,
  linkText=&#39;Skip to main content&#39;)
}}
</code></pre>

<p class="govuk-u-copy-19">Where the macros take the following arguments</p>

<div>

<!-- TODO: Use the table macro here and pass it component argument data -->
| Name      | Type    | Default | Required  | Description
|---        |---      |---      |---        |---
| linkHref  | string  |         | Yes       | The value of the link href attribute
| linkText  | string  |         | Yes       | The link text
| classes   | string  |         | Yes       | The modifier required for the link type
                                            | --back
                                            | --muted
                                            | --download
                                            | --skip

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

<pre><code>npm outdated @govuk-frontend/link</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/link</code></pre>

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
