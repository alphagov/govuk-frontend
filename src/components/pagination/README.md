


<h1 class="govuk-u-heading-36">
Pagination
</h1>

<h2 class="govuk-u-heading-24">Introduction</h2>
<p class="govuk-u-core-24">
  Previous/next page links.
  <a href="https://www.gov.uk/voting-in-the-uk/polling-stations">View previous/next links on GOV.UK</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/pagination/preview">Preview the pagination component.
</a>
</p>

<h2 class="govuk-u-heading-24">Guidance</h2>

<p class="govuk-u-copy-19">
  More information about when to use pagination can be found on <a href="http://www.linktodesignsystem.com/pagination" title="Link to read guidance on the use of pagination on Gov.uk Design system website">GOV.UK Design System</a>
</p>

<h2 class="govuk-u-heading-24">Dependencies</h2>

<p class="govuk-u-copy-19">To consume the pagination component you must be running npm version 5 or above. </p>

<p class="govuk-u-copy-19"></p>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/pagination</code></pre>

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
  
&lt;nav class=&quot;govuk-c-pagination &quot; role=&quot;navigation&quot; aria-label=&quot;Pagination&quot;&gt;
  &lt;ul class=&quot;govuk-c-pagination__list&quot;&gt;
    &lt;li class=&quot;govuk-c-pagination__item govuk-c-pagination__item--previous&quot;&gt;
      &lt;a class=&quot;govuk-c-pagination__link&quot; href=&quot;previous-page&quot; rel=&quot;prev&quot;&gt;
        &lt;span class=&quot;govuk-c-pagination__link-title&quot;&gt;
          &lt;svg class=&quot;govuk-c-pagination__link-icon&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; height=&quot;13&quot; width=&quot;17&quot; viewBox=&quot;0 0 17 13&quot;&gt;
            &lt;path fill=&quot;currentColor&quot; d=&quot;m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z&quot;&gt;&lt;/path&gt;
          &lt;/svg&gt;
          Previous page
        &lt;/span&gt;
          &lt;span class=&quot;govuk-c-pagination__link-label&quot;&gt;1 of 3&lt;/span&gt;
      &lt;/a&gt;
    &lt;/li&gt;

  &lt;/ul&gt;
&lt;/nav&gt;


&lt;nav class=&quot;govuk-c-pagination &quot; role=&quot;navigation&quot; aria-label=&quot;Pagination&quot;&gt;
  &lt;ul class=&quot;govuk-c-pagination__list&quot;&gt;

    &lt;li class=&quot;govuk-c-pagination__item govuk-c-pagination__item--next&quot;&gt;
      &lt;a class=&quot;govuk-c-pagination__link&quot; href=&quot;next-page&quot; rel=&quot;next&quot;&gt;
        &lt;span class=&quot;govuk-c-pagination__link-title&quot;&gt;
          Next page
          &lt;svg class=&quot;govuk-c-pagination__link-icon&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; height=&quot;13&quot; width=&quot;17&quot; viewBox=&quot;0 0 17 13&quot;&gt;
            &lt;path fill=&quot;currentColor&quot; d=&quot;m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z&quot;&gt;&lt;/path&gt;
          &lt;/svg&gt;
        &lt;/span&gt;
          &lt;span class=&quot;govuk-c-pagination__link-label&quot;&gt;Tax disc&lt;/span&gt;
      &lt;/a&gt;
    &lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;


&lt;nav class=&quot;govuk-c-pagination &quot; role=&quot;navigation&quot; aria-label=&quot;Pagination&quot;&gt;
  &lt;ul class=&quot;govuk-c-pagination__list&quot;&gt;
    &lt;li class=&quot;govuk-c-pagination__item govuk-c-pagination__item--previous&quot;&gt;
      &lt;a class=&quot;govuk-c-pagination__link&quot; href=&quot;previous-page&quot; rel=&quot;prev&quot;&gt;
        &lt;span class=&quot;govuk-c-pagination__link-title&quot;&gt;
          &lt;svg class=&quot;govuk-c-pagination__link-icon&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; height=&quot;13&quot; width=&quot;17&quot; viewBox=&quot;0 0 17 13&quot;&gt;
            &lt;path fill=&quot;currentColor&quot; d=&quot;m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z&quot;&gt;&lt;/path&gt;
          &lt;/svg&gt;
          Previous page
        &lt;/span&gt;
          &lt;span class=&quot;govuk-c-pagination__link-label&quot;&gt;1 of 3&lt;/span&gt;
      &lt;/a&gt;
    &lt;/li&gt;

    &lt;li class=&quot;govuk-c-pagination__item govuk-c-pagination__item--next&quot;&gt;
      &lt;a class=&quot;govuk-c-pagination__link&quot; href=&quot;next-page&quot; rel=&quot;next&quot;&gt;
        &lt;span class=&quot;govuk-c-pagination__link-title&quot;&gt;
          Next page
          &lt;svg class=&quot;govuk-c-pagination__link-icon&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; height=&quot;13&quot; width=&quot;17&quot; viewBox=&quot;0 0 17 13&quot;&gt;
            &lt;path fill=&quot;currentColor&quot; d=&quot;m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z&quot;&gt;&lt;/path&gt;
          &lt;/svg&gt;
        &lt;/span&gt;
          &lt;span class=&quot;govuk-c-pagination__link-label&quot;&gt;2 of 3&lt;/span&gt;
      &lt;/a&gt;
    &lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;


&lt;nav class=&quot;govuk-c-pagination &quot; role=&quot;navigation&quot; aria-label=&quot;Pagination&quot;&gt;
  &lt;ul class=&quot;govuk-c-pagination__list&quot;&gt;
    &lt;li class=&quot;govuk-c-pagination__item govuk-c-pagination__item--previous&quot;&gt;
      &lt;a class=&quot;govuk-c-pagination__link&quot; href=&quot;previous-page&quot; rel=&quot;prev&quot;&gt;
        &lt;span class=&quot;govuk-c-pagination__link-title&quot;&gt;
          &lt;svg class=&quot;govuk-c-pagination__link-icon&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; height=&quot;13&quot; width=&quot;17&quot; viewBox=&quot;0 0 17 13&quot;&gt;
            &lt;path fill=&quot;currentColor&quot; d=&quot;m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z&quot;&gt;&lt;/path&gt;
          &lt;/svg&gt;
          Previous page
        &lt;/span&gt;
      &lt;/a&gt;
    &lt;/li&gt;

    &lt;li class=&quot;govuk-c-pagination__item govuk-c-pagination__item--next&quot;&gt;
      &lt;a class=&quot;govuk-c-pagination__link&quot; href=&quot;next-page&quot; rel=&quot;next&quot;&gt;
        &lt;span class=&quot;govuk-c-pagination__link-title&quot;&gt;
          Next page
          &lt;svg class=&quot;govuk-c-pagination__link-icon&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; height=&quot;13&quot; width=&quot;17&quot; viewBox=&quot;0 0 17 13&quot;&gt;
            &lt;path fill=&quot;currentColor&quot; d=&quot;m10.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z&quot;&gt;&lt;/path&gt;
          &lt;/svg&gt;
        &lt;/span&gt;
      &lt;/a&gt;
    &lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;

</code>
</pre>


<h2 class="govuk-u-heading-24">If you are using Nunjucks</h2>
<p class="govuk-u-copy-19">To use a macro, follow the below code examples:</p>
<pre><code>{% from &quot;pagination/macro.njk&quot; import govukPagination %}

{{ govukPagination(
  classes=&#39;&#39;,
  previousPage=[
   {
      url: &#39;previous-page&#39;,
      title: &#39;Previous page&#39;,
      label: &#39;1 of 3&#39;
    }
  ]
  )
}}

{{ govukPagination(
  classes=&#39;&#39;,
  nextPage=[
   {
      url: &#39;next-page&#39;,
      title: &#39;Next page&#39;,
      label: &#39;Tax disc&#39;
    }
  ]
  )
}}

{{ govukPagination(
  classes=&#39;&#39;,
  previousPage=[
   {
      url: &#39;previous-page&#39;,
      title: &#39;Previous page&#39;,
      label: &#39;1 of 3&#39;
    }
  ],
  nextPage=[
   {
      url: &#39;next-page&#39;,
      title: &#39;Next page&#39;,
      label: &#39;2 of 3&#39;
    }
  ]
  )
}}

{{ govukPagination(
  classes=&#39;&#39;,
  previousPage=[
   {
      url: &#39;previous-page&#39;,
      title: &#39;Previous page&#39;
    }
  ],
  nextPage=[
   {
      url: &#39;next-page&#39;,
      title: &#39;Next page&#39;
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
      <th class="govuk-c-table__header" scope="row"> classes</th>
      <td class="govuk-c-table__cell "  >string</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Optional additional classes</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> previousPage</th>
      <td class="govuk-c-table__cell "  >array</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Previous page array with url, title and label keys</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row"> nextPage</th>
      <td class="govuk-c-table__cell "  >array</td>
      <td class="govuk-c-table__cell "  >No</td>
      <td class="govuk-c-table__cell "  >Next page array with url, title and label keys</td>
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

<pre><code>npm outdated @govuk-frontend/pagination</code></pre>

<p class="govuk-u-copy-19">To update the latest version run:</p>

<pre><code>npm update @govuk-frontend/pagination</code></pre>

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
