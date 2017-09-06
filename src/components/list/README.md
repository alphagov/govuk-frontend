


<h1 class="govuk-u-heading-36">
List
</h1>

<p class="govuk-u-core-24">
  Breadcrumb navigation, showing page hierarchy.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/list">Find list guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/list/preview">Preview the list component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

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

<h2 class="govuk-u-heading-24">Component arguments</h2>

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

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;ul class=&quot;govuk-c-list&quot;&gt;
  &lt;li&gt;&lt;a href=&quot;#&quot;&gt;Related link&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href=&quot;#&quot;&gt;Related link&lt;/a&gt;&lt;/li&gt;
  &lt;li&gt;&lt;a href=&quot;#&quot;&gt;Related link&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;

&lt;ul class=&quot;govuk-c-list govuk-c-list--bullet&quot;&gt;
  &lt;li&gt;here is a bulleted list&lt;/li&gt;
  &lt;li&gt;vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/li&gt;
  &lt;li&gt;vestibulum id ligula porta felis euismod semper&lt;/li&gt;
  &lt;li&gt;integer posuere erat a ante venenatis dapibus posuere velit aliquet&lt;/li&gt;
&lt;/ul&gt;

&lt;ol class=&quot;govuk-c-list govuk-c-list--number&quot;&gt;
  &lt;li&gt;This is a numbered list.&lt;/li&gt;
  &lt;li&gt;This is the second step in a numbered list.&lt;/li&gt;
  &lt;li&gt;The third step is to make sure each item is a full sentence ending with a full stop.&lt;/li&gt;
&lt;/ol&gt;

&lt;!-- normal steps icon size --&gt;
&lt;ol class=&quot;govuk-c-list govuk-c-list--icon&quot;&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;1&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;2&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;3&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;4&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;5&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;6&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;7&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;8&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;9&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;10&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;11&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;12&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;13&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-u-circle&quot;&gt;14&lt;/span&gt;Step&lt;/li&gt;
&lt;/ol&gt;

&lt;!-- large steps icon size --&gt;
&lt;ol class=&quot;govuk-c-list govuk-c-list--icon&quot;&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;1&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;2&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;3&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;4&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;5&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;6&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;7&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;8&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;9&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;10&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;11&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;12&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;13&lt;/span&gt;Step&lt;/li&gt;
  &lt;li&gt;&lt;span class=&quot;govuk-c-list__icon govuk-c-list__icon--large govuk-u-circle&quot;&gt;14&lt;/span&gt;Step&lt;/li&gt;
&lt;/ol&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/list</code></pre>

