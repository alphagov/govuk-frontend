

<h1 class="govuk-u-heading-36">
List
</h1>

<p class="govuk-u-core-24">
  Breadcrumb navigation, showing page hierarchy.
</p>

<p class="govuk-u-copy-19">
  <a href="">Find list guidance on the GOV.UK Design System.</a>
</p>

<h2 class="govuk-u-heading-24">How this component looks</h2>

<div>

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

</div>

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

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/list</code></pre>

