


<h1 class="govuk-u-heading-36">
Button
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  A button is an element that allows users to carry out an action on a GOV.UK page. Common use cases include allowing a user to **Start** an application or **Save and continue** their progress.

  A button should have a short text snippet that describes what it will do:
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/button/preview">Preview the button component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use button can be found on <a href="http://www.linktodesignsystem.com/button" title="Link to read guidance on the use of button on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the button component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19">Please note, this component depends on @govuk-frontend/globals and @govuk-frontend/icons, which will automatically be installed with the package.
</p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/button</code></pre>

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
<p class="govuk-u-copy-19">Buttons are configured to perform an action and they can have a different look. For example, they can be disabled until a valid action has been performed by the user.  You can use the following three variants:
</p>
<pre><code>{% from &quot;button/macro.njk&quot; import govukButton %}

{{ govukButton(classes=&#39;&#39;, text=&#39;Save and continue&#39;) }}

{{ govukButton(classes=&#39;&#39;, text=&#39;Save and continue&#39;, isDisabled=&#39;true&#39;) }}

{{ govukButton(classes=&#39;&#39;, text=&#39;Start now&#39;, url=&#39;/&#39;, isStart=&#39;true&#39;) }}
</code></pre>

<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &quot;button/macro.njk&quot; import govukButton %}

{{ govukButton(classes=&#39;&#39;, text=&#39;Save and continue&#39;) }}

{{ govukButton(classes=&#39;&#39;, text=&#39;Save and continue&#39;, isDisabled=&#39;true&#39;) }}

{{ govukButton(classes=&#39;&#39;, text=&#39;Start now&#39;, url=&#39;/&#39;, isStart=&#39;true&#39;) }}
</code></pre>

<p class="govuk-u-copy-19">Where the macros take the following arguments</p>

<div>


<!-- TODO: Use the table macro here and pass it component argument data -->

| Name       | Type    | Default | Required | Description
|---         |---      |---      |---       |---
| classes    | string  |         | No       | Optional additional classes
| text       | string  |         | Yes      | Button or link text
| isStart    | boolean |         | No       | Adds the class govuk-c-button--start for a "Start now" button
| isDisabled | boolean |         | No       | Disables the button - adds the class govuk-c-button--disabled and sets disabled="disabled" and aria-disabled="true"
| url        | string  |         | No       | Url that the hyperlink points to


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

<pre><code>npm outdated @govuk-frontend/button</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/button</code></pre>

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
